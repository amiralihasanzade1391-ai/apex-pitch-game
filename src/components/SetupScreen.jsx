import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/strings';
import { INITIAL_BUDGET } from '../game/engine';

export default function SetupScreen({
  onStart,
  onOpenScout,
  onCreateOnline,
  onOpenJoinModal,
  currentUser,
  userProfile,
  onOpenProfile,
  onOpenLeaderboard,
  onOpenAuthModal,
}) {
  const { t, toggleLocale, isRTL } = useI18n();
  const [screenMode, setScreenMode] = useState('menu'); // 'menu' | 'pass_and_play'
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstallApp() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice?.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  }
  
  // Pass & Play offline state
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');

  // Online Room Creation State & Error Toast
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [createError, setCreateError] = useState(null); // { code, message }

  function handlePassAndPlaySubmit(e) {
    e.preventDefault();
    onStart(
      name1.trim() || t('placeholder1'),
      name2.trim() || t('placeholder2')
    );
  }

  async function handleCreateOnline() {
    if (creatingRoom) return;
    setCreatingRoom(true);
    setCreateError(null);
    try {
      if (onCreateOnline) {
        await onCreateOnline(t('placeholder1'), 0);
      }
    } catch (err) {
      console.error('Error creating online room:', err);
      setCreateError({
        code: err?.code || 'error/unknown',
        message: err?.message || String(err),
      });
    } finally {
      setCreatingRoom(false);
    }
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center p-4 relative"
      style={{
        background: 'var(--canvas-dark)',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      {/* Stadium Ambient Floodlights */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, rgba(212,175,55,0.14) 0%, rgba(23,211,194,0.06) 45%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full flex flex-col gap-4">
        {/* Top Bar: Edition, Account Status & Language Switcher */}
        <div className="flex items-center justify-between px-1">
          <span
            className="font-display tracking-widest text-gold-bright"
            style={{ fontSize: '11px', letterSpacing: '0.15em' }}
          >
            {t('edition')}
          </span>

          <div className="flex items-center gap-2">
            {/* PWA Install Button (if available) */}
            {installPrompt && (
              <button
                type="button"
                onClick={handleInstallApp}
                className="flex items-center gap-1 px-2 py-1 rounded-full font-body font-bold transition-all shadow active:scale-95 animate-pulse"
                style={{
                  background: 'rgba(23, 211, 194, 0.2)',
                  border: '1px solid #17D3C2',
                  color: '#17D3C2',
                  fontSize: '10px',
                }}
              >
                <span>📲</span>
                <span>{t('installApp')}</span>
              </button>
            )}

            {/* Account / Profile Button */}
            {currentUser && !currentUser.isAnonymous ? (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body font-bold transition-all shadow active:scale-95"
                style={{
                  background: 'rgba(23, 211, 194, 0.15)',
                  border: '1px solid rgba(23, 211, 194, 0.45)',
                  color: '#17D3C2',
                  fontSize: '11px',
                }}
              >
                <span className="w-4 h-4 rounded-full bg-teal text-[#0A0E1A] flex items-center justify-center font-display text-[10px] font-bold">
                  {(userProfile?.displayName || currentUser?.displayName || 'M')[0].toUpperCase()}
                </span>
                <span className="truncate max-w-[85px]">
                  {userProfile?.displayName || currentUser?.displayName || t('profile')}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full font-body font-bold transition-all shadow active:scale-95"
                style={{
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  color: '#FFDF00',
                  fontSize: '10px',
                }}
              >
                <span>👤</span>
                <span>{t('signIn')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full font-body font-bold transition-all shadow active:scale-95"
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#FFDF00',
                fontSize: '11px',
              }}
            >
              <span>🌐</span>
              <span>{t('langToggle')}</span>
            </button>
          </div>
        </div>

        {/* Brand Title Banner */}
        <div className="text-center">
          <h1
            className="font-display font-bold leading-none tracking-wider text-gold-bright uppercase"
            style={{
              fontSize: '48px',
              textShadow: '0 4px 18px rgba(0,0,0,0.9), 0 0 25px rgba(255,223,0,0.5)',
            }}
          >
            {t('appName')}
          </h1>
          <p
            className="font-body text-on-surface-muted uppercase mt-1 font-semibold"
            style={{ fontSize: '12px', letterSpacing: '0.12em' }}
          >
            {t('appSubtitle')}
          </p>
          <div
            className="w-24 h-0.5 mx-auto mt-2"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
            }}
          />
        </div>

        {/* Quick Stats Pill Banner */}
        <div
          className="glass-panel text-center px-3 py-2 rounded-lg text-xs font-body font-bold text-teal flex items-center justify-center gap-1.5"
          style={{
            border: '1px solid rgba(23, 211, 194, 0.35)',
            background: 'rgba(23, 211, 194, 0.08)',
          }}
        >
          <span>⭐</span>
          <span>{t('quickStatsBanner')}</span>
        </div>

        {/* ─── High-Visibility Error Toast Banner ────────────── */}
        {createError && (
          <div
            className="p-4 rounded-xl bg-pitch-danger/25 border-2 border-pitch-danger text-pitch-danger shadow-2xl backdrop-blur-xl animate-shake flex flex-col gap-2"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase flex items-center gap-1.5 tracking-wider">
                <span className="text-base">⚠️</span>
                <span>{t('authFailed')} / {t('firestoreFailed')}</span>
              </span>
              <button
                type="button"
                onClick={() => setCreateError(null)}
                className="text-gray-300 hover:text-white font-bold px-1.5 py-0.5 rounded"
                aria-label={t('dismiss')}
              >
                ✕
              </button>
            </div>

            <div className="text-xs font-mono bg-black/60 p-2.5 rounded-lg border border-pitch-danger/40 text-gray-200 select-all leading-relaxed break-all">
              <span className="text-pitch-danger font-bold">[{createError.code}]</span> {createError.message}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCreateOnline}
                className="px-3.5 py-1.5 rounded-lg bg-pitch-danger text-white text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow"
              >
                🔄 {t('retry')}
              </button>
              <button
                type="button"
                onClick={() => setCreateError(null)}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 text-xs font-semibold hover:bg-white/20 transition-all"
              >
                {t('dismiss')}
              </button>
            </div>
          </div>
        )}

        {/* ─── Level 0 Home Choices: Menu View ────────────── */}
        {screenMode === 'menu' && (
          <div className="flex flex-col gap-3">
            {/* Entry 1: Pass & Play (Offline) */}
            <div
              onClick={() => setScreenMode('pass_and_play')}
              className="glass-panel-gold p-4 rounded-xl flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group shadow-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,223,0,0.15) 0%, rgba(26,34,56,0.95) 75%)',
                borderColor: 'rgba(212, 175, 55, 0.5)',
                minHeight: '80px',
              }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold shrink-0 shadow"
                  style={{
                    background: 'linear-gradient(135deg, #FFDF00 0%, #D4AF37 100%)',
                    color: '#0A0E1A',
                  }}
                >
                  ⚽
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-gold-bright text-xl sm:text-2xl uppercase leading-none group-hover:text-white transition-colors">
                    {t('entryPlayAuction')}
                  </h3>
                  <p className="font-body text-on-surface-muted text-xs mt-1 leading-snug">
                    {t('entryPlayAuctionDesc')}
                  </p>
                </div>
              </div>

              <span className="text-2xl text-gold-bright font-bold px-1">
                {isRTL ? '‹' : '›'}
              </span>
            </div>

            {/* Entry 2: Online Multiplayer (Create / Join Grid) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Create Online Room (1-click direct creation with spinner) */}
              <button
                type="button"
                onClick={handleCreateOnline}
                disabled={creatingRoom}
                className="glass-panel p-3.5 rounded-xl flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-lg text-left disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.14) 0%, rgba(18,24,41,0.95) 80%)',
                  borderColor: 'rgba(212, 175, 55, 0.45)',
                  minHeight: '100px',
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">🏆</span>
                  {creatingRoom ? (
                    <div className="w-4 h-4 border-2 border-pitch-gold border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-[10px] font-bold text-pitch-gold bg-pitch-gold/15 px-1.5 py-0.5 rounded border border-pitch-gold/30 uppercase tracking-wider">
                      ONLINE
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-display font-bold text-gold-bright text-lg uppercase leading-tight group-hover:text-white transition-colors">
                    {creatingRoom ? '...' : t('createOnlineRoom')}
                  </h4>
                  <p className="font-body text-gray-400 text-[10px] mt-0.5 line-clamp-2">
                    {t('createOnlineRoomDesc')}
                  </p>
                </div>
              </button>

              {/* Join Online Room */}
              <button
                type="button"
                onClick={onOpenJoinModal}
                className="glass-panel p-3.5 rounded-xl flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-lg text-left"
                style={{
                  background: 'linear-gradient(135deg, rgba(23,211,194,0.14) 0%, rgba(18,24,41,0.95) 80%)',
                  borderColor: 'rgba(23, 211, 194, 0.45)',
                  minHeight: '100px',
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">🔑</span>
                  <span className="text-[10px] font-bold text-pitch-teal bg-pitch-teal/15 px-1.5 py-0.5 rounded border border-pitch-teal/30 uppercase tracking-wider">
                    CODE
                  </span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-pitch-teal text-lg uppercase leading-tight group-hover:text-white transition-colors">
                    {t('joinOnlineRoom')}
                  </h4>
                  <p className="font-body text-gray-400 text-[10px] mt-0.5 line-clamp-2">
                    {t('joinOnlineRoomDesc')}
                  </p>
                </div>
              </button>
            </div>

            {/* Entry 3: Player Database (Scout) */}
            <div
              onClick={onOpenScout}
              className="glass-panel p-4 rounded-xl flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group shadow-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(23,211,194,0.12) 0%, rgba(18,24,41,0.95) 75%)',
                borderColor: 'rgba(23, 211, 194, 0.4)',
                minHeight: '76px',
              }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold shrink-0 shadow"
                  style={{
                    background: 'linear-gradient(135deg, #17D3C2 0%, #00a896 100%)',
                    color: '#0A0E1A',
                  }}
                >
                  🔍
                </div>
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-teal text-xl uppercase leading-none group-hover:text-white transition-colors">
                    {t('entryScout')}
                  </h3>
                  <p className="font-body text-on-surface-muted text-xs mt-1 leading-snug">
                    {t('entryScoutDesc')}
                  </p>
                </div>
              </div>

              <span className="text-2xl text-teal font-bold px-1">
                {isRTL ? '‹' : '›'}
              </span>
            </div>

            {/* Entry 4 & 5 Grid: Leaderboard & Profile */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Entry 4: Leaderboard */}
              <div
                onClick={onOpenLeaderboard}
                className="glass-panel p-3.5 rounded-xl flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,223,0,0.12) 0%, rgba(18,24,41,0.95) 80%)',
                  borderColor: 'rgba(212, 175, 55, 0.4)',
                  minHeight: '84px',
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">🏆</span>
                  <span className="text-xl text-gold-bright font-bold">
                    {isRTL ? '‹' : '›'}
                  </span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-gold-bright text-base uppercase leading-tight group-hover:text-white transition-colors">
                    {t('leaderboard')}
                  </h4>
                  <p className="font-body text-gray-400 text-[10px] mt-0.5 line-clamp-1">
                    {t('tabMostWins')} · {t('tabBestSquad')}
                  </p>
                </div>
              </div>

              {/* Entry 5: Profile & History */}
              <div
                onClick={onOpenProfile}
                className="glass-panel p-3.5 rounded-xl flex flex-col justify-between cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(23,211,194,0.12) 0%, rgba(18,24,41,0.95) 80%)',
                  borderColor: 'rgba(23, 211, 194, 0.4)',
                  minHeight: '84px',
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">🛡️</span>
                  <span className="text-xl text-teal font-bold">
                    {isRTL ? '‹' : '›'}
                  </span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-teal text-base uppercase leading-tight group-hover:text-white transition-colors">
                    {t('profile')}
                  </h4>
                  <p className="font-body text-gray-400 text-[10px] mt-0.5 line-clamp-1">
                    {t('careerOverview')} · {t('matchHistory')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── Level 1: Pass & Play Offline Setup Form ─────────────────────── */}
        {screenMode === 'pass_and_play' && (
          <form
            onSubmit={handlePassAndPlaySubmit}
            className="glass-panel-gold p-4 rounded-xl flex flex-col gap-4 animate-fade-in"
            style={{
              background: 'radial-gradient(circle at 50% 10%, rgba(26, 34, 56, 0.95) 0%, rgba(18, 24, 41, 0.95) 100%)',
              borderColor: 'rgba(212, 175, 55, 0.4)',
              boxShadow: '0 12px 35px -8px rgba(0,0,0,0.8), 0 0 24px -4px rgba(212,175,55,0.25)',
            }}
          >
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div>
                <h2
                  className="font-body font-bold text-on-surface"
                  style={{ fontSize: '15px' }}
                >
                  {t('setupTitle')}
                </h2>
                <p
                  className="font-body text-on-surface-muted mt-0.5"
                  style={{ fontSize: '11px' }}
                >
                  {t('passAndPlay')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setScreenMode('menu')}
                className="px-2.5 py-1 rounded bg-white/10 text-xs font-body font-bold text-on-surface hover:bg-white/20 transition-colors"
              >
                ✕ {t('back')}
              </button>
            </div>

            {/* Manager 1 Input */}
            <div className="flex flex-col gap-1.5">
              <label
                className="font-body font-bold uppercase text-gold-bright flex items-center gap-1.5"
                style={{ fontSize: '11px', letterSpacing: '0.06em' }}
              >
                <span className="w-2 h-2 rounded-full bg-gold-bright inline-block" />
                {t('manager1')}
              </label>
              <div
                className="flex items-center rounded-md overflow-hidden"
                style={{
                  background: '#0A0E1A',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  minHeight: '56px',
                }}
              >
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  placeholder={t('placeholder1')}
                  maxLength={24}
                  className="w-full h-full px-3.5 bg-transparent font-body text-on-surface font-semibold outline-none"
                  style={{ fontSize: '14px' }}
                />
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex items-center gap-3 my-0.5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="font-display font-bold text-on-surface-muted opacity-50" style={{ fontSize: '15px' }}>
                {t('vsText')}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Manager 2 Input */}
            <div className="flex flex-col gap-1.5">
              <label
                className="font-body font-bold uppercase text-teal flex items-center gap-1.5"
                style={{ fontSize: '11px', letterSpacing: '0.06em' }}
              >
                <span className="w-2 h-2 rounded-full bg-teal inline-block" />
                {t('manager2')}
              </label>
              <div
                className="flex items-center rounded-md overflow-hidden"
                style={{
                  background: '#0A0E1A',
                  border: '1.5px solid rgba(23, 211, 194, 0.4)',
                  minHeight: '56px',
                }}
              >
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  placeholder={t('placeholder2')}
                  maxLength={24}
                  className="w-full h-full px-3.5 bg-transparent font-body text-on-surface font-semibold outline-none"
                  style={{ fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Budget Info Badge */}
            <div
              className="flex items-center justify-between p-2.5 rounded-md"
              style={{
                background: 'rgba(10, 14, 26, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span className="font-body text-on-surface-muted" style={{ fontSize: '11px' }}>
                {t('budgetInitial')}
              </span>
              <span className="font-display font-bold text-gold-bright" style={{ fontSize: '20px' }}>
                {INITIAL_BUDGET} {t('currencyUnit')}
              </span>
            </div>

            {/* Start Action Button (Touch Target >= 56px) */}
            <button
              type="submit"
              className="btn-gold w-full flex items-center justify-center touch-target mt-1"
              style={{
                minHeight: '56px',
                borderRadius: '8px',
                fontSize: '15px',
                letterSpacing: '0.08em',
              }}
            >
              ⚽ {t('startAuction')}
            </button>
          </form>
        )}

        {/* Tactical Rules Card */}
        <div
          className="glass-panel p-3.5 rounded-lg flex flex-col gap-2"
          style={{
            background: 'rgba(18, 24, 41, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div
            className="font-body font-bold uppercase text-gold-bright"
            style={{ fontSize: '10px', letterSpacing: '0.08em' }}
          >
            📋 {t('rulesTitle')}
          </div>
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            {[t('rule1'), t('rule2'), t('rule3'), t('rule4')].map((rule, idx) => (
              <li
                key={idx}
                className="font-body text-on-surface-muted leading-snug flex items-start gap-1.5"
                style={{ fontSize: '11px' }}
              >
                <span className="text-teal font-bold shrink-0 mt-0.5">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
