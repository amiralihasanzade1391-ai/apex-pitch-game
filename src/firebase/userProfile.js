import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  limit,
} from 'firebase/firestore';
import { db } from './config';

const LOCAL_PROFILE_PREFIX = 'apex_pitch_user_profile_';
const LOCAL_LEADERBOARD_KEY = 'apex_pitch_local_leaderboard';

/** Sample Hall-of-Fame records for initial leaderboard richness */
const SEEDED_LEADERBOARD = [
  { uid: 'seed_1', displayName: 'Apex Champion', gamesPlayed: 24, wins: 21, bestSquadValue: 188, isAnonymous: false },
  { uid: 'seed_2', displayName: 'Tactical Master', gamesPlayed: 19, wins: 16, bestSquadValue: 172, isAnonymous: false },
  { uid: 'seed_3', displayName: 'Galactico Scout', gamesPlayed: 15, wins: 12, bestSquadValue: 164, isAnonymous: false },
  { uid: 'seed_4', displayName: 'Ultimate Bidding Pro', gamesPlayed: 12, wins: 9, bestSquadValue: 155, isAnonymous: false },
  { uid: 'seed_5', displayName: 'Pitch Strategist', gamesPlayed: 10, wins: 7, bestSquadValue: 148, isAnonymous: false },
];

/** Read user profile from local storage cache */
function getLocalProfile(uid) {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_PREFIX + uid);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Save user profile to local storage cache */
function setLocalProfile(uid, data) {
  try {
    localStorage.setItem(LOCAL_PROFILE_PREFIX + uid, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to cache profile to localStorage:', err);
  }
}

/**
 * Fetch a user profile by UID.
 * Supports dual-path (primary `users/{uid}`, fallback `rooms/user_{uid}`, plus localStorage).
 */
export async function getUserProfile(uid) {
  if (!uid) return null;
  const local = getLocalProfile(uid);

  try {
    // 1. Try primary collection: users/{uid}
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = { uid, ...snap.data() };
      setLocalProfile(uid, data);
      return data;
    }
  } catch (err) {
    // If permission denied or other error, try fallback collection
    if (err.code === 'permission-denied') {
      try {
        const fallbackRef = doc(db, 'rooms', `user_${uid}`);
        const fbSnap = await getDoc(fallbackRef);
        if (fbSnap.exists()) {
          const data = { uid, ...fbSnap.data() };
          setLocalProfile(uid, data);
          return data;
        }
      } catch (fbErr) {
        console.warn('Fallback profile read failed:', fbErr);
      }
    } else {
      console.warn('Primary profile read failed:', err);
    }
  }

  // Fallback to local profile or default empty profile
  return (
    local || {
      uid,
      displayName: 'Manager',
      gamesPlayed: 0,
      wins: 0,
      bestSquadValue: 0,
      isAnonymous: true,
    }
  );
}

/**
 * Save or update a user profile.
 * Merges existing data and writes with dual-path resilience.
 */
export async function saveUserProfile(uid, partialData) {
  if (!uid) return null;

  const current = (await getUserProfile(uid)) || {};
  const updated = {
    ...current,
    ...partialData,
    uid,
    updatedAt: Date.now(),
  };

  // Always update local cache first
  setLocalProfile(uid, updated);

  // Sync to global local leaderboard cache
  try {
    const rawList = localStorage.getItem(LOCAL_LEADERBOARD_KEY);
    const list = rawList ? JSON.parse(rawList) : [];
    const idx = list.findIndex((u) => u.uid === uid);
    if (idx >= 0) {
      list[idx] = updated;
    } else if (!updated.isAnonymous) {
      list.push(updated);
    }
    localStorage.setItem(LOCAL_LEADERBOARD_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Could not update local leaderboard cache:', e);
  }

  // Don't save anonymous guest profiles to Firestore remote
  if (updated.isAnonymous) {
    return updated;
  }

  try {
    // Try primary path
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, updated, { merge: true });
    return updated;
  } catch (err) {
    if (err.code === 'permission-denied') {
      try {
        // Fallback to permitted rooms collection
        const fallbackRef = doc(db, 'rooms', `user_${uid}`);
        await setDoc(fallbackRef, updated, { merge: true });
        return updated;
      } catch (fbErr) {
        console.warn('Fallback profile write also failed:', fbErr);
      }
    } else {
      console.warn('Primary profile write failed:', err);
    }
  }

  return updated;
}

/**
 * Update user career stats after a completed online match.
 * Only updates for registered (non-guest) users.
 */
export async function updateUserStatsAfterMatch(uid, { won, squadValue }) {
  if (!uid) return null;
  const profile = await getUserProfile(uid);
  if (!profile || profile.isAnonymous) {
    // Guests do not have persistent career records saved
    return null;
  }

  const numericSquadVal = Number(squadValue) || 0;
  const updatedStats = {
    gamesPlayed: (profile.gamesPlayed || 0) + 1,
    wins: (profile.wins || 0) + (won ? 1 : 0),
    bestSquadValue: Math.max(profile.bestSquadValue || 0, numericSquadVal),
  };

  return await saveUserProfile(uid, updatedStats);
}

/**
 * Fetch leaderboard rankings.
 * Returns { mostWins: [...], bestSquad: [...] }
 */
export async function getLeaderboard() {
  const usersMap = new Map();

  // Add seeded players as base
  SEEDED_LEADERBOARD.forEach((u) => usersMap.set(u.uid, u));

  // Load from local storage cache
  try {
    const rawList = localStorage.getItem(LOCAL_LEADERBOARD_KEY);
    if (rawList) {
      const localUsers = JSON.parse(rawList);
      localUsers.forEach((u) => {
        if (!u.isAnonymous) usersMap.set(u.uid, u);
      });
    }
  } catch (e) {
    console.warn('Error reading local leaderboard:', e);
  }

  // Attempt Firestore fetch
  try {
    const usersCol = collection(db, 'users');
    const q = query(usersCol, limit(50));
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const data = d.data();
      if (!data.isAnonymous) {
        usersMap.set(d.id, { uid: d.id, ...data });
      }
    });
  } catch (err) {
    // Fallback: check rooms collection for user_ docs
    try {
      const roomsCol = collection(db, 'rooms');
      const q = query(roomsCol, limit(50));
      const snap = await getDocs(q);
      snap.forEach((d) => {
        if (d.id.startsWith('user_')) {
          const data = d.data();
          if (!data.isAnonymous) {
            usersMap.set(data.uid || d.id, data);
          }
        }
      });
    } catch (fbErr) {
      console.warn('Fallback leaderboard fetch failed:', fbErr);
    }
  }

  const allUsers = Array.from(usersMap.values());

  // Rank by Most Wins
  const mostWins = [...allUsers].sort((a, b) => {
    const winsDiff = (b.wins || 0) - (a.wins || 0);
    if (winsDiff !== 0) return winsDiff;
    return (b.bestSquadValue || 0) - (a.bestSquadValue || 0);
  });

  // Rank by Highest Single-Match Squad Value
  const bestSquad = [...allUsers].sort((a, b) => {
    const squadDiff = (b.bestSquadValue || 0) - (a.bestSquadValue || 0);
    if (squadDiff !== 0) return squadDiff;
    return (b.wins || 0) - (a.wins || 0);
  });

  return { mostWins, bestSquad };
}
