import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/strings';
import { getLeaderboard } from '../firebase/userProfile';

export default function LeaderboardScreen({
  currentUser,
  onReturnHome,
}) {
  const { t, isRTL } = useI18n();

  // Tab: 'wins' | 'squad'
  const [activeTab, setActiveTab] = useState('wins');
  const [data, setData] = useState({ mostWins: [], bestSquad: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchBoard() {
      setLoading(true);
      try {
        const board = await getLeaderboard();
        if (isMounted) {
          setData(board);
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBoard();
    return () => {
      isMounted = false;
    };
  }, []);

  const list = activeTab === 'wins' ? data.mostWins : data.bestSquad;
  const top3 = list.slice(0, 3);
  const rest = list.slice(3);

  const myUid = currentUser?.uid;

  return (
    <div
      className="min-h-screen w-full flex flex-col relative pb-8"
      style={{
        background: 'var(--canvas-dark)',
        maxWidth: '500px',
        margin: '0 auto',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Stadium Ambient Floodlights */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.14) 0%, rgba(23,211,194,0.06) 45%, transparent 65%)',
        }}
      />

      {/* Global Header */}
      <header
        className="relative z-20 flex items-center justify-between px-3.5 py-3 shrink-0"
        style={{
          background: 'rgba(10, 14, 26, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full bg-gold-bright shadow"
            style={{ boxShadow: '0 0 10px #FFDF00' }}
          />
          <div>
            <h1
              className="font-display font-bold text-gold-bright tracking-wider leading-none text-xl"
            >
              {t('leaderboard')}
            </h1>
            <span
              className="font-body text-on-surface-muted uppercase mt-0.5 block"
              style={{ fontSize: '9px', letterSpacing: '0.1em' }}
            >
              {t('leaderboardSubtitle')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onReturnHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body font-bold text-on-surface transition-all active:scale-95"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '11px',
            minHeight: '36px',
          }}
        >
          <span>🏠</span>
          <span>{t('home')}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-3.5 py-4 flex flex-col gap-4 overflow-y-auto">
        {/* Tab Switcher: Most Wins vs Highest Squad Value */}
        <div
          className="grid grid-cols-2 p-1 rounded-xl"
          style={{
            background: 'rgba(18, 24, 41, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('wins')}
            className={`py-2.5 text-xs font-body font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'wins'
                ? 'bg-gradient-to-r from-amber-500/25 to-yellow-500/25 text-gold-bright border border-amber-500/50 shadow'
                : 'text-on-surface-muted hover:text-white'
            }`}
          >
            <span>🏆</span>
            <span>{t('tabMostWins')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('squad')}
            className={`py-2.5 text-xs font-body font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'squad'
                ? 'bg-gradient-to-r from-teal-500/25 to-emerald-500/25 text-teal border border-teal-500/50 shadow'
                : 'text-on-surface-muted hover:text-white'
            }`}
          >
            <span>💎</span>
            <span>{t('tabBestSquad')}</span>
          </button>
        </div>

        {loading ? (
          <div className="glass-panel p-8 rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-gold-bright border-t-transparent rounded-full animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-on-surface-muted font-body text-sm">
            {t('noLeaderboardData')}
          </div>
        ) : (
          <>
            {/* Top 3 Podium Showcase */}
            {top3.length > 0 && (
              <div className="grid grid-cols-3 gap-2 items-end pt-2">
                {/* #2 Rank (Silver) - Position 2nd on Left */}
                {top3[1] && (
                  <div
                    className="glass-panel p-2.5 rounded-xl flex flex-col items-center text-center relative order-1"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(208,197,175,0.15) 0%, rgba(18,24,41,0.95) 100%)',
                      border: '1px solid rgba(208, 197, 175, 0.4)',
                      minHeight: '135px',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg mb-1 shadow shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)',
                        color: '#0A0E1A',
                      }}
                    >
                      🥈
                    </div>
                    <span
                      className="font-display font-bold text-[#E2E8F0] text-xs truncate max-w-full block leading-tight"
                    >
                      {top3[1].displayName}
                    </span>
                    <span
                      className="font-display font-bold text-sm mt-1"
                      style={{ color: '#E2E8F0' }}
                    >
                      {activeTab === 'wins'
                        ? `${top3[1].wins} ${t('wins')}`
                        : `${top3[1].bestSquadValue} ${t('currencyUnit')}`}
                    </span>
                    <span className="font-body text-[9px] text-gray-400 mt-auto">
                      #2
                    </span>
                  </div>
                )}

                {/* #1 Rank (Gold Champion) - Tallest in Center */}
                {top3[0] && (
                  <div
                    className="glass-panel-gold p-3 rounded-2xl flex flex-col items-center text-center relative order-2 shadow-2xl -translate-y-2"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(255,223,0,0.25) 0%, rgba(26,34,56,0.98) 100%)',
                      borderColor: 'rgba(255, 223, 0, 0.65)',
                      boxShadow:
                        '0 10px 30px rgba(0,0,0,0.8), 0 0 25px rgba(255,223,0,0.3)',
                      minHeight: '160px',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-2xl mb-1 shadow-lg shrink-0 relative"
                      style={{
                        background:
                          'linear-gradient(135deg, #FFDF00 0%, #D4AF37 50%, #997A15 100%)',
                        color: '#0A0E1A',
                        boxShadow: '0 0 18px rgba(255,223,0,0.7)',
                      }}
                    >
                      👑
                    </div>
                    <span
                      className="font-display font-bold text-gold-bright text-sm truncate max-w-full block leading-tight"
                      style={{ textShadow: '0 0 10px rgba(255,223,0,0.5)' }}
                    >
                      {top3[0].displayName}
                    </span>
                    <span
                      className="font-display font-bold text-lg mt-1 text-gold-bright"
                    >
                      {activeTab === 'wins'
                        ? `${top3[0].wins} ${t('wins')}`
                        : `${top3[0].bestSquadValue} ${t('currencyUnit')}`}
                    </span>
                    <span className="font-body text-[10px] text-gold-bright/80 font-bold mt-auto">
                      🏆 CHAMPION #1
                    </span>
                  </div>
                )}

                {/* #3 Rank (Bronze) - Position 3rd on Right */}
                {top3[2] && (
                  <div
                    className="glass-panel p-2.5 rounded-xl flex flex-col items-center text-center relative order-3"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(201,150,46,0.15) 0%, rgba(18,24,41,0.95) 100%)',
                      border: '1px solid rgba(201, 150, 46, 0.4)',
                      minHeight: '125px',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg mb-1 shadow shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
                        color: '#0A0E1A',
                      }}
                    >
                      🥉
                    </div>
                    <span
                      className="font-display font-bold text-[#FBBF24] text-xs truncate max-w-full block leading-tight"
                    >
                      {top3[2].displayName}
                    </span>
                    <span
                      className="font-display font-bold text-sm mt-1"
                      style={{ color: '#FBBF24' }}
                    >
                      {activeTab === 'wins'
                        ? `${top3[2].wins} ${t('wins')}`
                        : `${top3[2].bestSquadValue} ${t('currencyUnit')}`}
                    </span>
                    <span className="font-body text-[9px] text-gray-400 mt-auto">
                      #3
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Remaining Ranked Table / Cards */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="font-body font-bold text-on-surface-muted uppercase text-xs tracking-wider px-1">
                ⭐ {t('leaderboardTitle')}
              </span>

              <div className="flex flex-col gap-1.5">
                {list.map((player, idx) => {
                  const rank = idx + 1;
                  const isMe = player.uid === myUid;

                  return (
                    <div
                      key={player.uid || idx}
                      className="glass-panel p-3 rounded-xl flex items-center justify-between transition-all"
                      style={{
                        background: isMe
                          ? 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(18,24,41,0.98) 80%)'
                          : 'rgba(18, 24, 41, 0.85)',
                        border: isMe
                          ? '1.5px solid rgba(255, 223, 0, 0.6)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: isMe ? '0 0 15px rgba(255, 223, 0, 0.25)' : 'none',
                      }}
                    >
                      {/* Left: Rank & Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Rank Badge */}
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-sm shrink-0"
                          style={{
                            background:
                              rank === 1
                                ? 'linear-gradient(135deg, #FFDF00 0%, #D4AF37 100%)'
                                : rank === 2
                                ? 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 100%)'
                                : rank === 3
                                ? 'linear-gradient(135deg, #D97706 0%, #92400E 100%)'
                                : 'rgba(255, 255, 255, 0.08)',
                            color: rank <= 3 ? '#0A0E1A' : '#94A3B8',
                          }}
                        >
                          {rank}
                        </span>

                        {/* Name + Chip */}
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="font-display font-bold text-sm truncate"
                            style={{
                              color: isMe ? '#FFDF00' : '#FFFFFF',
                              textShadow: isMe ? '0 0 10px rgba(255,223,0,0.5)' : 'none',
                            }}
                          >
                            {player.displayName}
                          </span>
                          {isMe && (
                            <span
                              className="px-1.5 py-0.2 rounded text-[9px] font-body font-bold text-gold-bright bg-gold-bright/20 border border-gold-bright/40 uppercase"
                            >
                              {t('you')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Telemetry Value */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span
                            className="font-display font-bold text-base block leading-none"
                            style={{
                              color:
                                activeTab === 'wins'
                                  ? rank <= 3
                                    ? '#FFDF00'
                                    : '#FFFFFF'
                                  : '#17D3C2',
                            }}
                          >
                            {activeTab === 'wins'
                              ? `${player.wins} ${t('wins')}`
                              : `${player.bestSquadValue} ${t('currencyUnit')}`}
                          </span>
                          <span className="font-body text-[10px] text-gray-400 block mt-0.5">
                            {player.gamesPlayed || 0} {t('matchesPlayed')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
