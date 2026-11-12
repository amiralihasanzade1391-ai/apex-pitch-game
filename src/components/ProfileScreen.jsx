import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/strings';
import { getUserProfile } from '../firebase/userProfile';
import { getUserMatchHistory } from '../firebase/matches';
import { logOut } from '../firebase/authService';

export default function ProfileScreen({
  currentUser,
  onReturnHome,
  onOpenAuthModal,
}) {
  const { t, isRTL } = useI18n();

  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMatchId, setExpandedMatchId] = useState(null);

  const uid = currentUser?.uid;
  const isGuest = !currentUser || currentUser.isAnonymous;

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (!uid) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [profData, matchData] = await Promise.all([
          getUserProfile(uid),
          getUserMatchHistory(uid),
        ]);
        if (isMounted) {
          setProfile(profData);
          setMatches(matchData || []);
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [uid]);

  const displayName =
    profile?.displayName ||
    currentUser?.displayName ||
    currentUser?.email?.split('@')[0] ||
    (isGuest ? t('guestAccount') : 'Manager');

  const avatarInitial = (displayName || 'M')[0].toUpperCase();

  const gamesPlayed = profile?.gamesPlayed || 0;
  const wins = profile?.wins || 0;
  const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;
  const bestSquadValue = profile?.bestSquadValue || 0;

  async function handleSignOut() {
    try {
      await logOut();
      if (onReturnHome) onReturnHome();
    } catch (err) {
      console.error('Error logging out:', err);
    }
  }

  function toggleExpandMatch(matchId) {
    setExpandedMatchId((prev) => (prev === matchId ? null : matchId));
  }

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
            'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.12) 0%, rgba(23,211,194,0.05) 40%, transparent 65%)',
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
              {t('profile')}
            </h1>
            <span
              className="font-body text-on-surface-muted uppercase mt-0.5 block"
              style={{ fontSize: '9px', letterSpacing: '0.1em' }}
            >
              {t('appSubtitle')}
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
        {/* User Hero Identity Card */}
        <div
          className="glass-panel-gold p-4 rounded-2xl flex flex-col gap-3 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(26,34,56,0.95) 0%, rgba(18,24,41,0.98) 100%)',
            borderColor: 'rgba(212, 175, 55, 0.5)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.15)',
          }}
        >
          <div className="flex items-center gap-3.5">
            {/* Avatar Crest */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-display font-bold text-3xl shadow-xl shrink-0 relative"
              style={{
                background:
                  'linear-gradient(135deg, #FFDF00 0%, #D4AF37 50%, #997A15 100%)',
                color: '#0A0E1A',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 0 20px rgba(255, 223, 0, 0.5)',
              }}
            >
              {avatarInitial}
              {/* Online Indicator Dot */}
              <div
                className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-teal border-2 border-[#0A0E1A]"
                style={{ boxShadow: '0 0 8px #17D3C2' }}
              />
            </div>

            {/* User Meta */}
            <div className="flex-1 min-w-0">
              <h2
                className="font-display font-bold text-white text-2xl truncate leading-tight tracking-wide"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
              >
                {displayName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                {isGuest ? (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-body font-bold uppercase tracking-wider"
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#FBBF24',
                    }}
                  >
                    👤 {t('guestAccount')}
                  </span>
                ) : (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-body font-bold uppercase tracking-wider"
                    style={{
                      background: 'rgba(23, 211, 194, 0.2)',
                      border: '1px solid rgba(23, 211, 194, 0.5)',
                      color: '#17D3C2',
                    }}
                  >
                    ⭐ {t('verifiedAccount')}
                  </span>
                )}
              </div>
              {currentUser?.email && (
                <span className="font-body text-[11px] text-on-surface-muted block truncate mt-0.5">
                  {currentUser.email}
                </span>
              )}
            </div>
          </div>

          {/* Guest Upgrade Callout Banner */}
          {isGuest && (
            <div
              className="p-3 rounded-xl flex flex-col gap-2 mt-1"
              style={{
                background:
                  'linear-gradient(135deg, rgba(212,175,55,0.18) 0%, rgba(23,211,194,0.08) 100%)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">💎</span>
                <span className="font-body font-bold text-xs text-gold-bright">
                  {t('saveStatsNotice')}
                </span>
              </div>
              <p className="font-body text-[11px] text-gray-300 leading-snug">
                {t('upgradeProfilePrompt')}
              </p>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="btn-gold w-full flex items-center justify-center font-display font-bold uppercase text-xs py-2.5 rounded-lg shadow transition-all active:scale-95"
                style={{ minHeight: '44px' }}
              >
                🔐 {t('loginToSave')}
              </button>
            </div>
          )}
        </div>

        {/* Career Telemetry (4 Stats Cards Grid) */}
        <div className="flex flex-col gap-2">
          <span
            className="font-body font-bold text-on-surface-muted uppercase text-xs tracking-wider px-1"
          >
            📊 {t('careerOverview')}
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Matches Played */}
            <div
              className="glass-panel p-3.5 rounded-xl flex flex-col justify-between"
              style={{
                background: 'rgba(18, 24, 41, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '80px',
              }}
            >
              <span className="font-body text-on-surface-muted text-xs">
                {t('matchesPlayed')}
              </span>
              <span
                className="font-display font-bold text-white text-3xl leading-none mt-1"
              >
                {gamesPlayed}
              </span>
            </div>

            {/* Total Wins */}
            <div
              className="glass-panel p-3.5 rounded-xl flex flex-col justify-between"
              style={{
                background:
                  'radial-gradient(circle at 100% 0%, rgba(255,223,0,0.1) 0%, rgba(18,24,41,0.85) 70%)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                minHeight: '80px',
              }}
            >
              <span className="font-body text-gold-bright text-xs font-semibold">
                {t('totalWins')}
              </span>
              <span
                className="font-display font-bold text-gold-bright text-3xl leading-none mt-1"
                style={{ textShadow: '0 0 15px rgba(255, 223, 0, 0.4)' }}
              >
                {wins}
              </span>
            </div>

            {/* Win Rate */}
            <div
              className="glass-panel p-3.5 rounded-xl flex flex-col justify-between"
              style={{
                background: 'rgba(18, 24, 41, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                minHeight: '80px',
              }}
            >
              <span className="font-body text-on-surface-muted text-xs">
                {t('winRate')}
              </span>
              <span
                className="font-display font-bold text-teal text-3xl leading-none mt-1"
              >
                {winRate}%
              </span>
            </div>

            {/* Peak Squad Value */}
            <div
              className="glass-panel p-3.5 rounded-xl flex flex-col justify-between"
              style={{
                background:
                  'radial-gradient(circle at 100% 0%, rgba(23,211,194,0.12) 0%, rgba(18,24,41,0.85) 70%)',
                border: '1px solid rgba(23, 211, 194, 0.35)',
                minHeight: '80px',
              }}
            >
              <span className="font-body text-teal text-xs font-semibold">
                {t('bestSquadValue')}
              </span>
              <span
                className="font-display font-bold text-teal text-3xl leading-none mt-1"
                style={{ textShadow: '0 0 15px rgba(23, 211, 194, 0.4)' }}
              >
                {bestSquadValue} <span className="text-sm">{t('currencyUnit')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Match History Section */}
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center justify-between px-1">
            <span className="font-body font-bold text-on-surface-muted uppercase text-xs tracking-wider">
              📜 {t('matchHistory')}
            </span>
            <span className="font-body text-[11px] text-gray-400">
              {matches.length} {t('cardCount')}
            </span>
          </div>

          {loading ? (
            <div className="glass-panel p-6 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gold-bright border-t-transparent rounded-full animate-spin" />
            </div>
          ) : matches.length === 0 ? (
            /* Empty State */
            <div
              className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center gap-2"
              style={{
                background: 'rgba(18, 24, 41, 0.7)',
                border: '1px dashed rgba(255, 255, 255, 0.15)',
              }}
            >
              <span className="text-3xl opacity-60">🏟️</span>
              <h4 className="font-display font-bold text-gray-300 text-lg">
                {t('noMatchesYet')}
              </h4>
              <p className="font-body text-xs text-on-surface-muted max-w-xs leading-relaxed">
                {t('noMatchesDesc')}
              </p>
            </div>
          ) : (
            /* Match Records List */
            <div className="flex flex-col gap-2.5">
              {matches.map((m) => {
                const isP1 = m.player1?.uid === uid;
                const myData = isP1 ? m.player1 : m.player2;
                const oppData = isP1 ? m.player2 : m.player1;

                const isWinner =
                  (isP1 && m.winner === 0) || (!isP1 && m.winner === 1);
                const isTie = m.winner === 'tie';

                const resultText = isTie
                  ? t('matchDraw')
                  : isWinner
                  ? t('matchWin')
                  : t('matchLoss');

                const resultColor = isTie
                  ? '#D0C5AF'
                  : isWinner
                  ? '#FFDF00'
                  : '#E5484D';

                const formattedDate = m.createdAt
                  ? new Date(m.createdAt).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '';

                const isExpanded = expandedMatchId === m.matchId;

                return (
                  <div
                    key={m.matchId}
                    className="glass-panel p-3.5 rounded-xl flex flex-col gap-2.5 transition-all"
                    style={{
                      background: isWinner
                        ? 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(18,24,41,0.95) 80%)'
                        : 'rgba(18, 24, 41, 0.85)',
                      border: `1px solid ${
                        isWinner ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 255, 255, 0.1)'
                      }`,
                    }}
                  >
                    {/* Header Row: Result Badge & Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2.5 py-0.5 rounded font-display font-bold uppercase text-xs tracking-wider"
                          style={{
                            background: `${resultColor}25`,
                            color: resultColor,
                            border: `1px solid ${resultColor}60`,
                          }}
                        >
                          {isWinner ? '🏆 ' : ''}
                          {resultText}
                        </span>
                        <span className="font-mono text-[10px] text-gray-400">
                          #{m.roomCode}
                        </span>
                      </div>

                      <span className="font-body text-[11px] text-on-surface-muted">
                        {formattedDate}
                      </span>
                    </div>

                    {/* Head-to-Head Comparison */}
                    <div className="flex items-center justify-between py-1 border-t border-b border-white/5">
                      {/* You */}
                      <div className="flex flex-col">
                        <span className="font-body text-[11px] text-on-surface-muted">
                          {myData?.name || t('you')}
                        </span>
                        <span
                          className="font-display font-bold text-xl"
                          style={{ color: isWinner ? '#FFDF00' : '#FFFFFF' }}
                        >
                          {myData?.squadValue || 0} {t('pts')}
                        </span>
                      </div>

                      <div className="font-display font-bold text-gray-500 text-sm">
                        {t('vs')}
                      </div>

                      {/* Opponent */}
                      <div className="flex flex-col text-right">
                        <span className="font-body text-[11px] text-on-surface-muted">
                          {oppData?.name || t('opponent')}
                        </span>
                        <span
                          className="font-display font-bold text-xl"
                          style={{ color: !isWinner && !isTie ? '#FFDF00' : '#FFFFFF' }}
                        >
                          {oppData?.squadValue || 0} {t('pts')}
                        </span>
                      </div>
                    </div>

                    {/* Toggle Expand Squad Button */}
                    <button
                      type="button"
                      onClick={() => toggleExpandMatch(m.matchId)}
                      className="flex items-center justify-between w-full py-1 text-xs font-body text-teal hover:underline"
                    >
                      <span>
                        {isExpanded ? t('hideSquad') : t('viewSquad')}
                      </span>
                      <span>{isExpanded ? '▲' : '▼'}</span>
                    </button>

                    {/* Expandable Squad Preview */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-white/10 flex flex-col gap-2 animate-fade-in">
                        <span className="font-body text-[10px] text-on-surface-muted uppercase font-bold">
                          {t('squadHeader', myData?.name || t('you'))}:
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                          {myData?.squad && Object.keys(myData.squad).length > 0 ? (
                            Object.entries(myData.squad).flatMap(([line, cards]) =>
                              (cards || []).map((c, i) => (
                                <div
                                  key={`${line}-${i}`}
                                  className="p-1.5 rounded-lg flex items-center justify-between text-xs"
                                  style={{
                                    background: 'rgba(10, 14, 26, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                  }}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <span className="font-bold text-teal text-[10px]">
                                      {c.player?.line || line}
                                    </span>
                                    <span className="font-body text-white truncate text-[11px]">
                                      {c.player?.name}
                                    </span>
                                  </div>
                                  <span className="font-display font-bold text-gold-bright text-xs shrink-0">
                                    {c.pricePaid}M$
                                  </span>
                                </div>
                              ))
                            )
                          ) : (
                            <span className="font-body text-xs text-gray-500 col-span-2">
                              {t('noBargainFound')}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Actions: Sign Out / Switch User */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          {!isGuest ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="btn-danger w-full flex items-center justify-center font-body font-bold rounded-xl shadow transition-all active:scale-95"
              style={{ minHeight: '48px', fontSize: '13px' }}
            >
              🚪 {t('signOut')}
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="btn-gold w-full flex items-center justify-center font-display font-bold uppercase rounded-xl shadow transition-all active:scale-95"
              style={{ minHeight: '52px', fontSize: '15px' }}
            >
              🔐 {t('loginToSave')}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
