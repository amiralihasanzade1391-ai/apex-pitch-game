import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db, ensureAuth, auth } from './config';
import {
  createInitialGameState,
  placeBid,
  pass,
  advanceToNextCard,
} from '../game/engine';
import { getPlayers } from '../data/playersLoader';

// ─── Room Code Generation ───────────────────────────────────────
// 6 uppercase characters: letters + digits, excluding confusing 'O', 'I', '0', '1'
const ROOM_CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateRoomCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    const idx = Math.floor(Math.random() * ROOM_CODE_CHARS.length);
    code += ROOM_CODE_CHARS[idx];
  }
  return code;
}

const STORAGE_KEY = 'apex_pitch_online_session';

/** Save current room credentials to localStorage for automatic rejoin */
export function saveLocalSession(roomCode, role, playerName) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        roomCode,
        role,
        playerName,
        savedAt: Date.now(),
      })
    );
  } catch (err) {
    console.error('Failed to save session to localStorage', err);
  }
}

/** Get saved room credentials from localStorage */
export function getSavedLocalSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Clear saved session */
export function clearLocalSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear session', err);
  }
}

// ─── Room Operations ────────────────────────────────────────────

/**
 * Creates an online room as host.
 * @param {string} hostName
 * @param {number} timerMode - 0 (off) or 30 (30 seconds per turn)
 * @returns {Promise<{ roomCode: string, user: Object }>}
 */
export async function createRoom(hostName, timerMode = 0) {
  try {
    const user = await ensureAuth();
    if (!user || !user.uid) {
      const err = new Error('No user returned from Firebase Auth');
      err.code = 'auth/no-user';
      throw err;
    }

    const roomCode = generateRoomCode();
    const roomRef = doc(db, 'rooms', roomCode);

    const initialDoc = {
      code: roomCode,
      createdAt: Date.now(),
      hostUid: user.uid,
      hostName: hostName?.trim() || 'مدیر ۱',
      hostSeenAt: Date.now(),
      guestUid: null,
      guestName: null,
      guestSeenAt: null,
      status: 'lobby', // 'lobby' | 'playing' | 'finished'
      timerMode: Number(timerMode) || 0,
      turnDeadline: null,
      rematchVotes: { host: false, guest: false },
      gameState: null,
    };

    await setDoc(roomRef, initialDoc);
    saveLocalSession(roomCode, 'host', initialDoc.hostName);

    return { roomCode, user, roomData: initialDoc };
  } catch (err) {
    console.error('createRoom execution error:', err);
    throw err;
  }
}

/**
 * Joins an existing online room as guest (or rejoins as host/guest).
 * @param {string} rawCode - 6-char room code
 * @param {string} guestName - Display name
 * @returns {Promise<{ roomCode: string, role: 'host'|'guest' }>}
 */
export async function joinRoom(rawCode, guestName) {
  const user = await ensureAuth();
  const roomCode = rawCode.trim().toUpperCase();
  const roomRef = doc(db, 'rooms', roomCode);

  const role = await runTransaction(db, async (transaction) => {
    const roomSnap = await transaction.get(roomRef);
    if (!roomSnap.exists()) {
      throw new Error('ROOM_NOT_FOUND');
    }

    const data = roomSnap.data();

    // If current user is already host
    if (data.hostUid === user.uid) {
      transaction.update(roomRef, {
        hostSeenAt: Date.now(),
        ...(guestName?.trim() ? { hostName: guestName.trim() } : {}),
      });
      return 'host';
    }

    // If current user is already guest rejoining
    if (data.guestUid === user.uid) {
      transaction.update(roomRef, {
        guestSeenAt: Date.now(),
        ...(guestName?.trim() ? { guestName: guestName.trim() } : {}),
      });
      return 'guest';
    }

    // New guest trying to join:
    // Check if match already started
    if (data.status !== 'lobby') {
      throw new Error('MATCH_ALREADY_STARTED');
    }

    // Check if another guest is already present and active (seen in past 45s)
    if (data.guestUid && data.guestUid !== user.uid) {
      const guestLastSeen = data.guestSeenAt || 0;
      if (Date.now() - guestLastSeen < 45000) {
        throw new Error('ROOM_FULL');
      }
    }

    // Slot is free, assign as guest
    const finalGuestName = guestName?.trim() || 'مدیر ۲';
    transaction.update(roomRef, {
      guestUid: user.uid,
      guestName: finalGuestName,
      guestSeenAt: Date.now(),
    });

    return 'guest';
  });

  saveLocalSession(roomCode, role, guestName?.trim() || (role === 'host' ? 'مدیر ۱' : 'مدیر ۲'));
  return { roomCode, role };
}

/**
 * Real-time listener for the room document.
 */
export function subscribeToRoom(roomCode, onData, onError) {
  const roomRef = doc(db, 'rooms', roomCode);
  return onSnapshot(
    roomRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onData(snapshot.data());
      } else {
        onData(null);
      }
    },
    (err) => {
      console.error('Room subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Heartbeat presence updater (called every 5s).
 */
export async function updatePresence(roomCode, role) {
  if (!roomCode || !role) return;
  const roomRef = doc(db, 'rooms', roomCode);
  const field = role === 'host' ? 'hostSeenAt' : 'guestSeenAt';
  try {
    await updateDoc(roomRef, {
      [field]: Date.now(),
    });
  } catch (err) {
    // Non-fatal presence ping failure
  }
}

/**
 * Host updates bid timer mode in lobby (0 = Off, 30 = 30 seconds).
 */
export async function setTimerMode(roomCode, timerMode) {
  const roomRef = doc(db, 'rooms', roomCode);
  await updateDoc(roomRef, {
    timerMode: Number(timerMode),
  });
}

/**
 * Host starts the match. Initializes game state using pure engine reducer.
 */
export async function startMatch(roomCode, timerMode = 0) {
  const user = await ensureAuth();
  const roomRef = doc(db, 'rooms', roomCode);

  await runTransaction(db, async (transaction) => {
    const roomSnap = await transaction.get(roomRef);
    if (!roomSnap.exists()) throw new Error('ROOM_NOT_FOUND');

    const data = roomSnap.data();
    if (data.hostUid !== user.uid) throw new Error('NOT_HOST');
    if (!data.guestUid) throw new Error('WAITING_FOR_GUEST');

    const playersList = await getPlayers();
    const initialGameState = createInitialGameState(data.hostName, data.guestName, playersList);
    const deadline = timerMode === 30 ? Date.now() + 30000 : null;

    transaction.update(roomRef, {
      status: 'playing',
      timerMode: Number(timerMode),
      turnDeadline: deadline,
      rematchVotes: { host: false, guest: false },
      gameState: initialGameState,
    });
  });
}

/**
 * Submit an action to the room document inside a Firestore transaction.
 * Calls engine reducers directly to guarantee identical game rules.
 *
 * @param {string} roomCode
 * @param {'bid' | 'pass' | 'advance' | 'timeout'} actionType
 * @param {Object} payload - { playerIndex, amount }
 */
export async function submitGameAction(roomCode, actionType, payload = {}) {
  const roomRef = doc(db, 'rooms', roomCode);

  await runTransaction(db, async (transaction) => {
    const roomSnap = await transaction.get(roomRef);
    if (!roomSnap.exists()) throw new Error('ROOM_NOT_FOUND');

    const roomData = roomSnap.data();
    if (roomData.status !== 'playing' || !roomData.gameState) {
      throw new Error('INVALID_ROOM_STATUS');
    }

    const state = roomData.gameState;
    let nextState = state;
    let nextDeadline = roomData.turnDeadline;
    const isTimerActive = Number(roomData.timerMode) === 30;

    if (actionType === 'bid') {
      const { playerIndex, amount } = payload;
      // Must be player's turn
      if (state.auctionTurn !== playerIndex) {
        throw new Error('NOT_YOUR_TURN');
      }
      nextState = placeBid(state, playerIndex, amount);
      nextDeadline = isTimerActive ? Date.now() + 30000 : null;
    } else if (actionType === 'pass') {
      const { playerIndex } = payload;
      if (state.auctionTurn !== playerIndex) {
        throw new Error('NOT_YOUR_TURN');
      }
      nextState = pass(state, playerIndex);
      // If card was resolved (sold or discarded), wait for stamp / advance
      if (nextState.soldStamp) {
        nextDeadline = null;
      } else {
        // Turn switched to other player
        nextDeadline = isTimerActive ? Date.now() + 30000 : null;
      }
    } else if (actionType === 'advance') {
      // Advance to next card or gameover
      nextState = advanceToNextCard(state);
      if (nextState.phase === 'gameover') {
        transaction.update(roomRef, {
          status: 'finished',
          turnDeadline: null,
          gameState: nextState,
        });
        return;
      } else {
        nextDeadline = isTimerActive ? Date.now() + 30000 : null;
      }
    } else if (actionType === 'timeout') {
      // Only execute if turnDeadline actually passed
      if (!roomData.turnDeadline || Date.now() < roomData.turnDeadline - 1000) {
        return; // Deadline not reached yet
      }
      // Auto-pass for the current turn player
      nextState = pass(state, state.auctionTurn);
      if (nextState.soldStamp) {
        nextDeadline = null;
      } else {
        nextDeadline = isTimerActive ? Date.now() + 30000 : null;
      }
    }

    transaction.update(roomRef, {
      gameState: nextState,
      turnDeadline: nextDeadline,
    });
  });
}

/**
 * Rematch vote handler.
 * If both players have voted, a new game state is initialized.
 */
export async function submitRematchVote(roomCode, role) {
  const roomRef = doc(db, 'rooms', roomCode);

  await runTransaction(db, async (transaction) => {
    const roomSnap = await transaction.get(roomRef);
    if (!roomSnap.exists()) throw new Error('ROOM_NOT_FOUND');

    const data = roomSnap.data();
    const currentVotes = data.rematchVotes || { host: false, guest: false };
    const updatedVotes = {
      ...currentVotes,
      [role]: true,
    };

    if (updatedVotes.host && updatedVotes.guest) {
      // Both want a rematch! Create a brand new room and redirect both players
      const nextRoomCode = generateRoomCode();
      const nextRoomRef = doc(db, 'rooms', nextRoomCode);
      const playersList = await getPlayers();
      const initialGameState = createInitialGameState(data.hostName, data.guestName, playersList);
      const isTimerActive = Number(data.timerMode) === 30;
      const deadline = isTimerActive ? Date.now() + 30000 : null;

      const nextRoomDoc = {
        code: nextRoomCode,
        createdAt: Date.now(),
        hostUid: data.hostUid,
        hostName: data.hostName,
        hostSeenAt: Date.now(),
        guestUid: data.guestUid,
        guestName: data.guestName,
        guestSeenAt: Date.now(),
        status: 'playing',
        timerMode: data.timerMode || 0,
        turnDeadline: deadline,
        gameState: initialGameState,
        rematchVotes: { host: false, guest: false },
      };

      transaction.set(nextRoomRef, nextRoomDoc);

      // Signal the old room to redirect to the new room
      transaction.update(roomRef, {
        rematchVotes: updatedVotes,
        rematchRoomCode: nextRoomCode,
      });
    } else {
      transaction.update(roomRef, {
        rematchVotes: updatedVotes,
      });
    }
  });
}

/**
 * Leave room.
 * If host leaves while in lobby, deletes room doc.
 * If guest leaves while in lobby, clears guest slot.
 */
export async function leaveRoom(roomCode, role) {
  clearLocalSession();
  if (!roomCode) return;

  const roomRef = doc(db, 'rooms', roomCode);
  try {
    const snap = await getDoc(roomRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.status === 'lobby') {
        if (role === 'host') {
          await deleteDoc(roomRef);
        } else if (role === 'guest') {
          await updateDoc(roomRef, {
            guestUid: null,
            guestName: null,
            guestSeenAt: null,
          });
        }
      }
    }
  } catch (err) {
    console.error('Error leaving room:', err);
  }
}
