import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';
import { db } from './config';
import { updateUserStatsAfterMatch } from './userProfile';

const LOCAL_MATCHES_PREFIX = 'apex_pitch_user_matches_';

function getLocalMatches(uid) {
  try {
    const raw = localStorage.getItem(LOCAL_MATCHES_PREFIX + uid);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function appendLocalMatch(uid, matchRecord) {
  try {
    const current = getLocalMatches(uid);
    if (!current.some((m) => m.matchId === matchRecord.matchId)) {
      current.unshift(matchRecord);
      localStorage.setItem(LOCAL_MATCHES_PREFIX + uid, JSON.stringify(current));
    }
  } catch (err) {
    console.warn('Failed to cache match to localStorage:', err);
  }
}

/**
 * Save an online match record to Firestore.
 * Updates career profiles for non-guest players.
 * Guests can play, but their records are not saved as personal history.
 */
export async function saveMatchRecord(matchData) {
  const {
    roomCode,
    player1,
    player2,
    winner, // 0 | 1 | 'tie'
    winnerName,
  } = matchData;

  const matchId = `match_${roomCode}_${Date.now()}`;

  const p1IsGuest = !!player1.isGuest;
  const p2IsGuest = !!player2.isGuest;

  // If both players were guests, their match is not saved to persistent records
  if (p1IsGuest && p2IsGuest) {
    console.log('Both players are guests. Match will not be saved.');
    return { saved: false, reason: 'guests_only' };
  }

  const record = {
    matchId,
    roomCode,
    createdAt: Date.now(),
    player1: {
      uid: player1.uid,
      name: player1.name,
      isGuest: p1IsGuest,
      squadValue: Number(player1.squadValue) || 0,
      budgetSpent: Number(player1.budgetSpent) || 0,
      squad: player1.squad || [],
    },
    player2: {
      uid: player2.uid,
      name: player2.name,
      isGuest: p2IsGuest,
      squadValue: Number(player2.squadValue) || 0,
      budgetSpent: Number(player2.budgetSpent) || 0,
      squad: player2.squad || [],
    },
    winner,
    winnerName: winnerName || (winner === 0 ? player1.name : winner === 1 ? player2.name : 'Tie'),
    winnerUid: winner === 0 ? player1.uid : winner === 1 ? player2.uid : null,
  };

  // Cache to local history for registered players
  if (!p1IsGuest && player1.uid) {
    appendLocalMatch(player1.uid, record);
    // Update player 1 stats
    await updateUserStatsAfterMatch(player1.uid, {
      won: winner === 0,
      squadValue: record.player1.squadValue,
    });
  }

  if (!p2IsGuest && player2.uid) {
    appendLocalMatch(player2.uid, record);
    // Update player 2 stats
    await updateUserStatsAfterMatch(player2.uid, {
      won: winner === 1,
      squadValue: record.player2.squadValue,
    });
  }

  // Attempt Firestore write (dual-path)
  try {
    const matchDocRef = doc(db, 'matches', matchId);
    await setDoc(matchDocRef, record);
    return { saved: true, record };
  } catch (err) {
    if (err.code === 'permission-denied') {
      try {
        const fallbackRef = doc(db, 'rooms', matchId);
        await setDoc(fallbackRef, record);
        return { saved: true, record };
      } catch (fbErr) {
        console.warn('Fallback match write failed:', fbErr);
      }
    } else {
      console.warn('Primary match write failed:', err);
    }
  }

  return { saved: true, record };
}

/**
 * Get match history for a given user UID.
 */
export async function getUserMatchHistory(uid) {
  if (!uid) return [];

  const matchesMap = new Map();

  // Load from local cache first
  getLocalMatches(uid).forEach((m) => matchesMap.set(m.matchId, m));

  // Query remote matches
  try {
    const matchesCol = collection(db, 'matches');
    const q = query(matchesCol, limit(30));
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const data = d.data();
      if (data.player1?.uid === uid || data.player2?.uid === uid) {
        matchesMap.set(data.matchId || d.id, data);
      }
    });
  } catch (err) {
    // Fallback: check rooms collection
    try {
      const roomsCol = collection(db, 'rooms');
      const q = query(roomsCol, limit(40));
      const snap = await getDocs(q);
      snap.forEach((d) => {
        if (d.id.startsWith('match_')) {
          const data = d.data();
          if (data.player1?.uid === uid || data.player2?.uid === uid) {
            matchesMap.set(data.matchId || d.id, data);
          }
        }
      });
    } catch (fbErr) {
      console.warn('Fallback match history query failed:', fbErr);
    }
  }

  return Array.from(matchesMap.values()).sort(
    (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
  );
}
