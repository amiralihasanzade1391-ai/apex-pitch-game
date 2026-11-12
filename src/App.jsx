import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useI18n } from './i18n/strings';
import SetupScreen from './components/SetupScreen';
import AuctionPanel from './components/AuctionPanel';
import PlayerPanel from './components/PlayerPanel';
import PitchBoard from './components/PitchBoard';
import BidLog from './components/BidLog';
import EndScreen from './components/EndScreen';
import ScoutSection from './components/ScoutSection';
import OnlineLobby from './components/OnlineLobby';
import JoinRoomModal from './components/JoinRoomModal';
import AuthModal from './components/AuthModal';
import ProfileScreen from './components/ProfileScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import {
  createInitialGameState,
  placeBid,
  pass,
  advanceToNextCard,
  squadTotalValue,
  squadTotalSpent,
} from './game/engine';
import { getPlayers } from './data/playersLoader';
import { isMuted, toggleMute } from './audio/soundEngine';
import {
  createRoom,
  joinRoom,
  subscribeToRoom,
  updatePresence,
  submitGameAction,
  submitRematchVote,
  leaveRoom,
  getSavedLocalSession,
  clearLocalSession,
} from './firebase/rooms';
import { subscribeToAuth } from './firebase/authService';
import { ensureAuth } from './firebase/config';
import { getUserProfile } from './firebase/userProfile';
import { saveMatchRecord } from './firebase/matches';

const SOLD_STAMP_DELAY_MS = 1400; // ms to display stamp before dealing next card

export default function App() {
  const { t, toggleLocale, locale } = useI18n();
  const [muted, setMuted] = useState(isMuted);

  function handleToggleSound() {
    const next = toggleMute();
    setMuted(next);
  }

  // Mode: 'offline' (Pass & Play) | 'online' (Firebase Room)
  const [gameMode, setGameMode] = useState('offline');

  // Phases: 'setup' | 'lobby' | 'auction' | 'gameover' | 'scout'
  const [phase, setPhase] = useState('setup');
  const [activeTab, setActiveTab] = useState('auction'); // 'auction' | 'squad0' | 'squad1' | 'scout'

  // Offline game state
  const [offlineState, setOfflineState] = useState(null);

  // Accounts & Profile State (Phase 4)
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const recordedMatchRef = useRef(null);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      setCurrentUser(user);
      if (user) {
        const prof = await getUserProfile(user.uid);
        setUserProfile(prof);
      } else {
        setUserProfile(null);
        ensureAuth().catch((e) => console.warn('Background guest sign-in:', e));
      }
    });

    return () => unsubscribe();
  }, []);

  // Online multiplayer state
  const [onlineRoom, setOnlineRoom] = useState(null);
  const [myRole, setMyRole] = useState('host'); // 'host' | 'guest'
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [opponentConnected, setOpponentConnected] = useState(true);

  const mySeatIndex = myRole === 'host' ? 0 : 1;

  // Active game state depends on mode
  const currentGameState = gameMode === 'online' ? onlineRoom?.gameState : offlineState;

  // ─── Reconnection / Resume from localStorage on Mount ──────────
  useEffect(() => {
    const saved = getSavedLocalSession();
    if (saved && saved.roomCode) {
      setMyRole(saved.role || 'host');
      setGameMode('online');
      // Subscribe will handle populating onlineRoom
    }
  }, []);

  // ─── Real-time Online Room Subscription ────────────────────────
  useEffect(() => {
    if (gameMode !== 'online') return;

    const saved = getSavedLocalSession();
    const code = onlineRoom?.code || saved?.roomCode;
    if (!code) return;

    const unsubscribe = subscribeToRoom(
      code,
      (data) => {
        if (!data) {
          // Room was deleted or not found
          clearLocalSession();
          setOnlineRoom(null);
          setGameMode('offline');
          setPhase('setup');
          return;
        }

        // If a rematch vote created a brand new room code, redirect seamlessly
        if (data.rematchRoomCode) {
          clearLocalSession();
          const roleName = myRole === 'host' ? data.hostName : data.guestName;
          saveLocalSession(data.rematchRoomCode, myRole, roleName);
          recordedMatchRef.current = null;
          setOnlineRoom({ code: data.rematchRoomCode, status: 'playing' });
          setPhase('auction');
          return;
        }

        setOnlineRoom(data);

        // Update phase based on room status
        if (data.status === 'lobby') {
          setPhase('lobby');
        } else if (data.status === 'playing') {
          setPhase('auction');
        } else if (data.status === 'finished' || data.gameState?.phase === 'gameover') {
          setPhase('gameover');

          // Idempotent Match Recording (Phase 4)
          if (recordedMatchRef.current !== data.code && data.gameState?.result) {
            recordedMatchRef.current = data.code;
            const p1 = data.gameState.players?.[0];
            const p2 = data.gameState.players?.[1];

            if (p1 && p2) {
              const hostIsGuest =
                data.hostUid === currentUser?.uid
                  ? !!currentUser?.isAnonymous
                  : !data.hostUid || data.hostUid.startsWith('guest_');
              const guestIsGuest =
                data.guestUid === currentUser?.uid
                  ? !!currentUser?.isAnonymous
                  : !data.guestUid || data.guestUid.startsWith('guest_');

              saveMatchRecord({
                roomCode: data.code,
                player1: {
                  uid: data.hostUid,
                  name: data.hostName || p1.name,
                  isGuest: hostIsGuest,
                  squadValue: squadTotalValue(p1),
                  budgetSpent: squadTotalSpent(p1),
                  squad: p1.squad,
                },
                player2: {
                  uid: data.guestUid,
                  name: data.guestName || p2.name,
                  isGuest: guestIsGuest,
                  squadValue: squadTotalValue(p2),
                  budgetSpent: squadTotalSpent(p2),
                  squad: p2.squad,
                },
                winner: data.gameState.result.winner,
                winnerName:
                  data.gameState.result.winner === 0
                    ? data.hostName || p1.name
                    : data.gameState.result.winner === 1
                    ? data.guestName || p2.name
                    : 'Tie',
              })
                .then(() => {
                  if (currentUser?.uid) {
                    getUserProfile(currentUser.uid).then((p) => setUserProfile(p));
                  }
                })
                .catch((err) => {
                  console.warn('Error saving match record:', err);
                });
            }
          }
        }
      },
      (err) => {
        console.error('Subscription error:', err);
      }
    );

    return () => unsubscribe();
  }, [gameMode, onlineRoom?.code]);

  // ─── Online Presence Heartbeat (Every 5s) ───────────────────────
  useEffect(() => {
    if (gameMode !== 'online' || !onlineRoom?.code) return;

    // Send initial presence ping
    updatePresence(onlineRoom.code, myRole);

    const interval = setInterval(() => {
      updatePresence(onlineRoom.code, myRole);
    }, 5000);

    return () => clearInterval(interval);
  }, [gameMode, onlineRoom?.code, myRole]);

  // ─── Monitor Opponent Connection (unseen > 30s) ────────────────
  useEffect(() => {
    if (gameMode !== 'online' || !onlineRoom) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const oppSeenAt =
        myRole === 'host'
          ? onlineRoom.guestSeenAt || 0
          : onlineRoom.hostSeenAt || 0;

      // Only check if opponent has joined at least once
      const oppJoined = myRole === 'host' ? !!onlineRoom.guestUid : true;
      if (oppJoined) {
        const isConnected = (now - oppSeenAt) < 30000;
        setOpponentConnected(isConnected);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [gameMode, onlineRoom, myRole]);

  // ─── Offline Card Stamp Advance ────────────────────────────────
  useEffect(() => {
    if (gameMode !== 'offline' || !offlineState?.soldStamp) return;

    const timer = setTimeout(() => {
      setOfflineState((prev) => {
        if (!prev) return prev;
        const nextState = advanceToNextCard(prev);
        if (nextState.phase === 'gameover') {
          setPhase('gameover');
        }
        return nextState;
      });
    }, SOLD_STAMP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [gameMode, offlineState?.soldStamp, offlineState?.deckIndex]);

  // ─── Online Card Stamp Advance ─────────────────────────────────
  // When card is sold/discarded, host triggers atomic advance transaction
  useEffect(() => {
    if (
      gameMode !== 'online' ||
      myRole !== 'host' ||
      !onlineRoom?.gameState?.soldStamp ||
      onlineRoom?.status !== 'playing'
    ) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await submitGameAction(onlineRoom.code, 'advance');
      } catch (err) {
        console.error('Error advancing card online:', err);
      }
    }, SOLD_STAMP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [
    gameMode,
    myRole,
    onlineRoom?.code,
    onlineRoom?.gameState?.soldStamp,
    onlineRoom?.gameState?.deckIndex,
    onlineRoom?.status,
  ]);

  // ─── Handlers: Offline Mode ────────────────────────────────────
  async function handleStartOfflineGame(name1, name2) {
    const playersList = await getPlayers();
    const freshState = createInitialGameState(name1, name2, playersList);
    setGameMode('offline');
    setOfflineState(freshState);
    setPhase('auction');
    setActiveTab('auction');
  }

  function handleRestartOfflineGame() {
    recordedMatchRef.current = null;
    setOfflineState(null);
    setPhase('setup');
    setActiveTab('auction');
  }

  // ─── Handlers: Online Mode ─────────────────────────────────────
  async function handleCreateOnlineRoom(hostName, timerMode = 0) {
    try {
      const { roomCode, roomData } = await createRoom(hostName, timerMode);
      setMyRole('host');
      setOnlineRoom(roomData);
      setGameMode('online');
      setPhase('lobby');
      setActiveTab('auction');
      return { roomCode, roomData };
    } catch (err) {
      console.error('Failed to create online room in App.jsx:', err);
      throw err;
    }
  }

  function handleJoinedOnlineRoom(result) {
    setMyRole(result.role);
    setGameMode('online');
    setPhase('lobby');
    setActiveTab('auction');
    setIsJoinModalOpen(false);
  }

  async function handleLeaveOnlineRoom() {
    const code = onlineRoom?.code;
    if (code) {
      await leaveRoom(code, myRole);
    }
    clearLocalSession();
    recordedMatchRef.current = null;
    setOnlineRoom(null);
    setGameMode('offline');
    setPhase('setup');
    setActiveTab('auction');
  }

  async function handleRematchVote() {
    if (!onlineRoom?.code) return;
    try {
      await submitRematchVote(onlineRoom.code, myRole);
    } catch (err) {
      console.error('Error voting for rematch:', err);
    }
  }

  // ─── Game Action Handlers (Unified offline & online) ───────────
  const handleBid = useCallback(
    async (playerIndex, amount) => {
      if (gameMode === 'online') {
        try {
          await submitGameAction(onlineRoom.code, 'bid', { playerIndex, amount });
          return {};
        } catch (err) {
          return { error: 'mustBeatPrice' };
        }
      } else {
        try {
          setOfflineState((prev) => placeBid(prev, playerIndex, amount));
          return {};
        } catch (errKey) {
          return { error: errKey };
        }
      }
    },
    [gameMode, onlineRoom?.code]
  );

  const handlePass = useCallback(
    async (playerIndex) => {
      if (gameMode === 'online') {
        try {
          await submitGameAction(onlineRoom.code, 'pass', { playerIndex });
        } catch (err) {
          console.error('Error passing online:', err);
        }
      } else {
        setOfflineState((prev) => pass(prev, playerIndex));
      }
    },
    [gameMode, onlineRoom?.code]
  );

  const handleTimeout = useCallback(async () => {
    if (gameMode === 'online' && onlineRoom?.code) {
      try {
        await submitGameAction(onlineRoom.code, 'timeout');
      } catch (err) {
        console.error('Error submitting timeout pass:', err);
      }
    }
  }, [gameMode, onlineRoom?.code]);

  // ─── Phase: Manager Profile & Match History ───────────────────
  if (phase === 'profile') {
    return (
      <>
        <ProfileScreen
          currentUser={currentUser}
          onReturnHome={() => setPhase('setup')}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={async (user) => {
            setCurrentUser(user);
            const prof = await getUserProfile(user.uid);
            setUserProfile(prof);
          }}
        />
      </>
    );
  }

  // ─── Phase: Global Leaderboard & Hall of Fame ────────────────
  if (phase === 'leaderboard') {
    return (
      <LeaderboardScreen
        currentUser={currentUser}
        onReturnHome={() => setPhase('setup')}
      />
    );
  }

  // ─── Phase 1: Home / Setup Screen ────────────────────────────
  if (phase === 'setup') {
    return (
      <>
        <SetupScreen
          onStart={handleStartOfflineGame}
          onOpenScout={() => setPhase('scout')}
          onCreateOnline={handleCreateOnlineRoom}
          onOpenJoinModal={() => setIsJoinModalOpen(true)}
          currentUser={currentUser}
          userProfile={userProfile}
          onOpenProfile={() => setPhase('profile')}
          onOpenLeaderboard={() => setPhase('leaderboard')}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
        <JoinRoomModal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          onJoined={handleJoinedOnlineRoom}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={async (user) => {
            setCurrentUser(user);
            const prof = await getUserProfile(user.uid);
            setUserProfile(prof);
          }}
        />
      </>
    );
  }

  // ─── Phase: Online Lobby Screen ──────────────────────────────
  if (phase === 'lobby' && onlineRoom) {
    return (
      <div
        className="min-h-screen w-full flex flex-col justify-center items-center p-4 relative"
        style={{
          background: 'var(--canvas-dark)',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        <OnlineLobby
          roomData={onlineRoom}
          myRole={myRole}
          onLeave={handleLeaveOnlineRoom}
          onStartSuccess={() => setPhase('auction')}
        />
      </div>
    );
  }

  // ─── Phase: Scout Section Standalone Mode ────────────────────
  if (phase === 'scout') {
    return (
      <div
        className="min-h-screen w-full flex flex-col relative"
        style={{
          background: 'var(--canvas-dark)',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {/* Stadium Ambient Floodlights */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(23,211,194,0.08) 0%, rgba(212,175,55,0.04) 35%, transparent 65%)',
          }}
        />

        {/* Global Broadcast Header */}
        <header
          className="relative z-20 flex items-center justify-between px-3 py-2.5 shrink-0"
          style={{
            background: 'rgba(10, 14, 26, 0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full bg-teal shadow"
              style={{ boxShadow: '0 0 10px #17D3C2' }}
            />
            <div>
              <div
                className="font-display font-bold text-gold-bright tracking-wider leading-none"
                style={{ fontSize: '20px' }}
              >
                {t('appName')}
              </div>
              <div
                className="font-body text-on-surface-muted uppercase mt-0.5"
                style={{ fontSize: '8px', letterSpacing: '0.1em' }}
              >
                {t('scoutTitle')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSound}
              className="flex items-center justify-center px-2 py-1 rounded font-body transition-all"
              style={{
                background: muted ? 'rgba(229, 72, 77, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                border: muted ? '1px solid rgba(229, 72, 77, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '11px',
              }}
              title={muted ? t('soundOff') : t('soundOn')}
            >
              {muted ? '🔇' : '🔊'}
            </button>

            <button
              type="button"
              onClick={() => setPhase(gameMode === 'online' ? (onlineRoom?.status === 'lobby' ? 'lobby' : 'auction') : 'setup')}
              className="flex items-center gap-1 px-2.5 py-1 rounded font-body font-bold text-on-surface transition-all"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '11px',
              }}
            >
              <span>🏠</span>
              <span>{t('home')}</span>
            </button>

            <button
              type="button"
              onClick={toggleLocale}
              className="flex items-center justify-center px-2 py-1 rounded font-body font-bold transition-all"
              style={{
                background: 'rgba(23, 211, 194, 0.15)',
                border: '1px solid rgba(23, 211, 194, 0.4)',
                color: '#17D3C2',
                fontSize: '10px',
              }}
            >
              {t('langToggle')}
            </button>
          </div>
        </header>

        <main className="relative z-10 flex-1 overflow-y-auto px-3 py-3">
          <ScoutSection onReturnHome={() => setPhase('setup')} />
        </main>
      </div>
    );
  }

  // ─── Phase: Game Over Screen ─────────────────────────────────
  if (phase === 'gameover' && currentGameState) {
    return (
      <EndScreen
        players={currentGameState.players}
        result={currentGameState.result}
        onRestart={handleRestartOfflineGame}
        isOnline={gameMode === 'online'}
        myRole={myRole}
        rematchVotes={onlineRoom?.rematchVotes}
        onRematch={handleRematchVote}
        onLeave={handleLeaveOnlineRoom}
      />
    );
  }

  if (!currentGameState) return null;

  const {
    players,
    currentCard,
    currentBid,
    currentBidder,
    auctionTurn,
    bidLog,
    deck,
    deckIndex,
    soldStamp,
  } = currentGameState;

  return (
    <div
      className="min-h-screen w-full flex flex-col relative"
      style={{
        background: 'var(--canvas-dark)',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Stadium Ambient Floodlights */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(23,211,194,0.06) 0%, rgba(212,175,55,0.04) 35%, transparent 60%)',
        }}
      />

      {/* ─── Top Global Broadcast Header ────────────────────────── */}
      <header
        className="relative z-20 flex items-center justify-between px-3 py-2.5 shrink-0"
        style={{
          background: 'rgba(10, 14, 26, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full bg-teal shadow"
            style={{ boxShadow: '0 0 10px #17D3C2' }}
          />
          <div>
            <div
              className="font-display font-bold text-gold-bright tracking-wider leading-none"
              style={{ fontSize: '20px' }}
            >
              {t('appName')}
            </div>
            <div
              className="font-body text-on-surface-muted uppercase mt-0.5 flex items-center gap-1.5"
              style={{ fontSize: '8px', letterSpacing: '0.1em' }}
            >
              <span>{t('appSubtitle')}</span>
              {gameMode === 'online' && (
                <span className="text-pitch-gold font-bold">
                  [{onlineRoom?.code}]
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Deck Counter, Scout Shortcut & Language Switcher */}
        <div className="flex items-center gap-2">
          {/* Deck remaining pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded"
            style={{
              background: 'rgba(18, 24, 41, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
            }}
          >
            <span
              className="font-body uppercase font-bold text-on-surface-muted"
              style={{ fontSize: '9px', letterSpacing: '0.04em' }}
            >
              {t('cardCount')}
            </span>
            <span
              className="font-display font-bold text-gold-bright"
              style={{ fontSize: '15px' }}
            >
              {Math.max(0, deck.length - deckIndex)}
            </span>
          </div>

          {/* Scout Database Shortcut */}
          <button
            type="button"
            onClick={() => setActiveTab('scout')}
            className={`flex items-center gap-1 px-2 py-1 rounded font-body font-bold transition-all ${
              activeTab === 'scout'
                ? 'bg-teal text-black'
                : 'bg-white/10 text-teal hover:bg-white/20'
            }`}
            style={{ fontSize: '10px' }}
            title={t('tabScout')}
          >
            <span>🔍</span>
            <span className="hidden sm:inline">{t('tabScout')}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="flex items-center justify-center px-2 py-1 rounded font-body transition-all"
            style={{
              background: muted ? 'rgba(229, 72, 77, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: muted ? '1px solid rgba(229, 72, 77, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: '11px',
            }}
            title={muted ? t('soundOff') : t('soundOn')}
          >
            {muted ? '🔇' : '🔊'}
          </button>

          {/* Quick Language Toggle Pill */}
          <button
            type="button"
            onClick={toggleLocale}
            className="flex items-center justify-center px-2 py-1 rounded font-body font-bold transition-all"
            style={{
              background: 'rgba(23, 211, 194, 0.15)',
              border: '1px solid rgba(23, 211, 194, 0.4)',
              color: '#17D3C2',
              fontSize: '10px',
            }}
            title="Toggle Language"
          >
            {t('langToggle')}
          </button>
        </div>
      </header>

      {/* ─── Manager HUD Section (Player 1 & Player 2 Panels) ───── */}
      <div className="relative z-10 grid grid-cols-2 gap-2 px-3 pt-2.5 shrink-0">
        <PlayerPanel
          playerState={players[0]}
          isActive={auctionTurn === 0}
          playerIndex={0}
        />
        <PlayerPanel
          playerState={players[1]}
          isActive={auctionTurn === 1}
          playerIndex={1}
        />
      </div>

      {/* ─── Navigation Tabs (Auction | Player 1 Pitch | Player 2 Pitch | Scout) ─ */}
      <nav
        className="relative z-10 flex shrink-0 mx-3 mt-2.5 rounded-lg overflow-hidden"
        style={{
          background: 'rgba(10, 14, 26, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2px',
        }}
      >
        {[
          { key: 'auction', label: t('tabAuction') },
          { key: 'squad0', label: t('tabSquad', players[0].name) },
          { key: 'squad1', label: t('tabSquad', players[1].name) },
          { key: 'scout', label: `🔍 ${t('tabScout')}` },
        ].map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 px-1 rounded-md font-body font-bold transition-all text-center leading-tight break-words"
              style={{
                fontSize: '11px',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(26,34,56,0.8) 100%)'
                  : 'transparent',
                color: isSelected ? '#FFDF00' : 'rgba(255, 255, 255, 0.45)',
                border: isSelected ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid transparent',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* ─── Scrollable Main Content Area ───────────────────────── */}
      <main
        className="relative z-10 flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {activeTab === 'auction' && (
          <>
            <AuctionPanel
              currentCard={currentCard}
              currentBid={currentBid}
              currentBidder={currentBidder}
              auctionTurn={auctionTurn}
              players={players}
              deckIndex={deckIndex}
              deckTotal={deck.length}
              onBid={handleBid}
              onPass={handlePass}
              soldStamp={soldStamp}
              isOnline={gameMode === 'online'}
              mySeatIndex={mySeatIndex}
              opponentConnected={opponentConnected}
              turnDeadline={onlineRoom?.turnDeadline}
              timerMode={onlineRoom?.timerMode || 0}
              onTimeout={handleTimeout}
            />
            <BidLog entries={bidLog} />
          </>
        )}

        {activeTab === 'squad0' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="font-display text-gold-bright" style={{ fontSize: '20px' }}>
                {players[0].name}
              </span>
              <span className="font-body text-on-surface-muted" style={{ fontSize: '11px' }}>
                {t('budget')}: <strong className="text-gold-bright">{players[0].budget} {t('currencyUnit')}</strong>
              </span>
            </div>
            <PitchBoard playerState={players[0]} showValue={false} />
          </div>
        )}

        {activeTab === 'squad1' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="font-display text-teal" style={{ fontSize: '20px' }}>
                {players[1].name}
              </span>
              <span className="font-body text-on-surface-muted" style={{ fontSize: '11px' }}>
                {t('budget')}: <strong className="text-teal">{players[1].budget} {t('currencyUnit')}</strong>
              </span>
            </div>
            <PitchBoard playerState={players[1]} showValue={false} />
          </div>
        )}

        {activeTab === 'scout' && (
          <ScoutSection onReturnHome={() => setActiveTab('auction')} />
        )}
      </main>
    </div>
  );
}
