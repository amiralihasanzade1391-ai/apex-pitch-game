import React, { useState } from 'react';
import { useI18n } from '../i18n/strings';
import {
  signInWithGoogle,
  registerWithEmail,
  loginWithEmail,
  loginAsGuest,
  getAuthErrorMessageKey,
} from '../firebase/authService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const { t, isRTL } = useI18n();

  // Mode: 'signin' | 'signup'
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null); // { key, code, message }

  if (!isOpen) return null;

  async function handleGoogleLogin() {
    setLoading(true);
    setErrorInfo(null);
    try {
      const user = await signInWithGoogle();
      if (onAuthSuccess) onAuthSuccess(user);
      onClose();
    } catch (err) {
      console.error('Google Auth Failed:', err);
      const key = getAuthErrorMessageKey(err.code);
      setErrorInfo({
        key,
        code: err.code || 'auth/unknown',
        message: err.message || '',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailAuth(e) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorInfo(null);

    try {
      let user;
      if (mode === 'signup') {
        user = await registerWithEmail(email, password, displayName);
      } else {
        user = await loginWithEmail(email, password);
      }
      if (onAuthSuccess) onAuthSuccess(user);
      onClose();
    } catch (err) {
      console.error('Email Auth Failed:', err);
      const key = getAuthErrorMessageKey(err.code);
      setErrorInfo({
        key,
        code: err.code || 'auth/unknown',
        message: err.message || '',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestContinue() {
    setLoading(true);
    setErrorInfo(null);
    try {
      const user = await loginAsGuest();
      if (onAuthSuccess) onAuthSuccess(user);
      onClose();
    } catch (err) {
      console.error('Guest Auth Failed:', err);
      const key = getAuthErrorMessageKey(err.code);
      setErrorInfo({
        key,
        code: err.code || 'auth/unknown',
        message: err.message || '',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-5 relative overflow-hidden flex flex-col gap-4 animate-scale-up"
        style={{
          background: 'linear-gradient(180deg, #1A2238 0%, #121829 100%)',
          border: '1.5px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.9), 0 0 35px rgba(212,175,55,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Subtle top gold highlight beam */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #FFDF00 50%, transparent 100%)',
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <h2
                className="font-display font-bold text-gold-bright tracking-wider uppercase text-2xl"
                style={{ textShadow: '0 0 15px rgba(255, 223, 0, 0.4)' }}
              >
                {mode === 'signin' ? t('signIn') : t('signUp')}
              </h2>
            </div>
            <p className="font-body text-on-surface-muted text-xs mt-0.5">
              {t('appSubtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-muted hover:text-white hover:bg-white/10 transition-all font-bold"
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div
          className="grid grid-cols-2 p-1 rounded-xl"
          style={{
            background: 'rgba(10, 14, 26, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorInfo(null);
            }}
            className={`py-2 text-xs font-body font-bold rounded-lg transition-all ${
              mode === 'signin'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-gold-bright border border-amber-500/40 shadow'
                : 'text-on-surface-muted hover:text-white'
            }`}
          >
            {t('signIn')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorInfo(null);
            }}
            className={`py-2 text-xs font-body font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-gold-bright border border-amber-500/40 shadow'
                : 'text-on-surface-muted hover:text-white'
            }`}
          >
            {t('signUp')}
          </button>
        </div>

        {/* Error Alert Box */}
        {errorInfo && (
          <div
            className="p-3 rounded-xl border border-pitch-danger/50 bg-pitch-danger/15 text-xs text-gray-200 flex flex-col gap-1.5 animate-shake"
          >
            <div className="flex items-center gap-1.5 font-bold text-pitch-danger">
              <span>⚠️</span>
              <span>{t(errorInfo.key)}</span>
            </div>
            {errorInfo.code && (
              <span className="font-mono text-[10px] text-gray-400 opacity-80 break-all select-all">
                [{errorInfo.code}] {errorInfo.message}
              </span>
            )}
          </div>
        )}

        {/* Google Sign-In Button (Primary OAuth) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 rounded-xl font-body font-bold text-white transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
          style={{
            minHeight: '52px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1.5px solid rgba(255, 255, 255, 0.2)',
            fontSize: '14px',
          }}
        >
          {/* Google G Logo SVG */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t('googleSignIn')}</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-0.5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] font-body text-on-surface-muted uppercase tracking-wider">
            {t('orWithEmail')}
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-body text-on-surface-muted font-semibold">
                {t('managerName')}
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t('enterManagerName')}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-body text-white placeholder-gray-500 focus:outline-none transition-all"
                style={{
                  minHeight: '48px',
                  background: 'rgba(10, 14, 26, 0.85)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                }}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-body text-on-surface-muted font-semibold">
              {t('email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('enterEmail')}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-body text-white placeholder-gray-500 focus:outline-none transition-all"
              style={{
                minHeight: '48px',
                background: 'rgba(10, 14, 26, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-body text-on-surface-muted font-semibold">
              {t('password')}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('enterPassword')}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm font-body text-white placeholder-gray-500 focus:outline-none transition-all"
              style={{
                minHeight: '48px',
                background: 'rgba(10, 14, 26, 0.85)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            />
          </div>

          {/* Submit Action Button (Touch Target >= 56px) */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full flex items-center justify-center font-display font-bold tracking-wider uppercase text-base rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 mt-1"
            style={{ minHeight: '56px' }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : mode === 'signin' ? (
              t('signIn')
            ) : (
              t('signUp')
            )}
          </button>
        </form>

        {/* Continue as Guest Button */}
        <div className="pt-1 border-t border-white/10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleGuestContinue}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-body font-semibold text-teal hover:bg-teal/10 border border-teal/30 transition-all"
            style={{ minHeight: '44px' }}
          >
            <span>👤</span>
            <span>{t('playAsGuest')}</span>
          </button>

          <p className="font-body text-[10px] text-gray-400 text-center leading-tight">
            {t('guestWarningBanner')}
          </p>
        </div>
      </div>
    </div>
  );
}
