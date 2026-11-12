import React, { useState } from 'react';
import { useI18n } from '../i18n/strings';
import { setTimerMode, startMatch, getSavedLocalSession } from '../firebase/rooms';

export default function OnlineLobby({ roomData, myRole, onLeave, onStartSuccess }) {
  const { t, isRTL } = useI18n();
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);

  // Extract room code robustly from live roomData or localStorage session
  const savedSession = getSavedLocalSession();
  const roomCode = (roomData?.code || roomData?.roomCode || savedSession?.roomCode || '').toUpperCase();

  const isHost = myRole === 'host';
  const now = Date.now();
  const isHostConnected = (now - (roomData?.hostSeenAt || 0)) < 15000;
  const isGuestConnected = !!roomData?.guestUid && ((now - (roomData?.guestSeenAt || 0)) < 15000);
  const canStart = isHost && roomData?.guestUid && isGuestConnected;

  const handleCopy = () => {
    if (!roomCode) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(roomCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        fallbackCopy(roomCode);
      });
    } else {
      fallbackCopy(roomCode);
    }
  };

  const fallbackCopy = (text) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
  };

  const handleTimerToggle = async (mode) => {
    if (!isHost || !roomCode) return;
    try {
      await setTimerMode(roomCode, mode);
    } catch (err) {
      console.error('Error setting timer mode:', err);
    }
  };

  const handleStart = async () => {
    if (!canStart || starting || !roomCode) return;
    setStarting(true);
    try {
      await startMatch(roomCode, roomData?.timerMode || 0);
      if (onStartSuccess) onStartSuccess();
    } catch (err) {
      console.error('Error starting match:', err);
      setStarting(false);
    }
  };

  return (
    <div
      className="w-full max-w-xl mx-auto px-4 py-6 flex flex-col gap-5 animate-fade-in"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Top Header */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2"
          style={{
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#FFDF00',
          }}
        >
          <span
            className="w-2 h-2 rounded-full inline-block animate-pulse"
            style={{ background: '#17D3C2', boxShadow: '0 0 8px #17D3C2' }}
          />
          <span>{t('roomLobby')}</span>
        </div>
        <h1
          className="font-display font-black tracking-wider uppercase text-on-surface leading-none m-0"
          style={{ fontSize: '26px' }}
        >
          {t('appName')} · <span style={{ color: '#FFDF00' }}>{t('edition')}</span>
        </h1>
      </div>

      {/* ─── Room Code Card (Apex Pitch Luxury Gold Display) ─────── */}
      <div
        className="glass-panel-gold relative p-6 text-center overflow-hidden flex flex-col items-center justify-center gap-1 rounded-2xl"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(26, 34, 56, 0.95) 0%, rgba(10, 14, 26, 0.98) 100%)',
          borderColor: 'rgba(212, 175, 55, 0.5)',
          boxShadow: '0 12px 35px -8px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.25)',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #FFDF00 50%, transparent 100%)',
          }}
        />

        <p
          className="font-body font-bold uppercase tracking-widest text-on-surface-muted m-0"
          style={{ fontSize: '11px', letterSpacing: '0.15em' }}
        >
          {t('roomCode')}
        </p>

        {/* LARGE GOLD 6-CHARACTER ROOM CODE */}
        <div className="flex items-center justify-center gap-4 my-2 flex-wrap">
          <span
            className="font-display font-black tracking-[0.25em] uppercase select-all"
            style={{
              fontSize: '52px',
              lineHeight: 1,
              color: '#FFDF00',
              textShadow: '0 0 25px rgba(255, 223, 0, 0.8), 0 4px 14px rgba(0, 0, 0, 0.9)',
              letterSpacing: '0.22em',
              fontWeight: 900,
            }}
          >
            {roomCode || '------'}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className="btn-gold flex items-center justify-center gap-2 px-4 touch-target active:scale-95 transition-all"
            style={{
              minHeight: '48px',
              borderRadius: '8px',
              fontSize: '13px',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
            }}
            title={t('copyCode')}
          >
            {copied ? (
              <>
                <span className="font-bold text-black text-base">✓</span>
                <span className="font-bold text-black">{t('codeCopied')}</span>
              </>
            ) : (
              <>
                <span className="text-base">📋</span>
                <span className="font-bold text-black">{t('copyCode')}</span>
              </>
            )}
          </button>
        </div>

        <p
          className="font-body text-on-surface-muted max-w-sm mx-auto m-0 mt-1"
          style={{ fontSize: '11px', lineHeight: 1.4 }}
        >
          {t('createOnlineRoomDesc')}
        </p>
      </div>

      {/* Players Lineup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Host Box */}
        <div
          className="glass-panel p-4 rounded-xl flex flex-col justify-between shadow-lg relative overflow-hidden"
          style={{
            borderColor: 'rgba(212, 175, 55, 0.4)',
            background: 'rgba(26, 34, 56, 0.85)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                color: '#FFDF00',
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
              }}
            >
              {t('host')}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{
                  background: isHostConnected ? '#10B981' : '#6B7280',
                  boxShadow: isHostConnected ? '0 0 8px #10B981' : 'none',
                }}
              />
              <span className="text-[10px] text-on-surface-muted">
                {isHostConnected ? t('statusConnected') : t('statusDisconnected')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-2xl font-black shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 223, 0, 0.25) 0%, transparent 100%)',
                border: '1.5px solid rgba(212, 175, 55, 0.45)',
                color: '#FFDF00',
              }}
            >
              1
            </div>
            <div className="min-w-0">
              <div className="font-body font-bold text-on-surface text-base truncate flex items-center gap-1.5">
                <span>{roomData?.hostName || t('placeholder1')}</span>
                {isHost && (
                  <span
                    className="text-[10px] font-normal px-1 rounded"
                    style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#FFDF00' }}
                  >
                    {t('youIndicator')}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-on-surface-muted">$250M · 4-3-3</div>
            </div>
          </div>
        </div>

        {/* Guest Box */}
        <div
          className="glass-panel p-4 rounded-xl flex flex-col justify-between shadow-lg relative overflow-hidden"
          style={{
            borderColor: roomData?.guestUid ? 'rgba(23, 211, 194, 0.4)' : 'rgba(255, 255, 255, 0.1)',
            background: roomData?.guestUid ? 'rgba(18, 24, 41, 0.85)' : 'rgba(18, 24, 41, 0.4)',
            borderStyle: roomData?.guestUid ? 'solid' : 'dashed',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{
                color: '#17D3C2',
                background: 'rgba(23, 211, 194, 0.15)',
                border: '1px solid rgba(23, 211, 194, 0.3)',
              }}
            >
              {t('guest')}
            </span>
            {roomData?.guestUid ? (
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{
                    background: isGuestConnected ? '#10B981' : '#6B7280',
                    boxShadow: isGuestConnected ? '0 0 8px #10B981' : 'none',
                  }}
                />
                <span className="text-[10px] text-on-surface-muted">
                  {isGuestConnected ? t('statusConnected') : t('statusDisconnected')}
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-amber-400 animate-pulse">● ● ●</span>
            )}
          </div>

          {roomData?.guestUid ? (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-2xl font-black shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(23, 211, 194, 0.25) 0%, transparent 100%)',
                  border: '1.5px solid rgba(23, 211, 194, 0.45)',
                  color: '#17D3C2',
                }}
              >
                2
              </div>
              <div className="min-w-0">
                <div className="font-body font-bold text-on-surface text-base truncate flex items-center gap-1.5">
                  <span>{roomData?.guestName || t('placeholder2')}</span>
                  {!isHost && (
                    <span
                      className="text-[10px] font-normal px-1 rounded"
                      style={{ background: 'rgba(23, 211, 194, 0.2)', color: '#17D3C2' }}
                    >
                      {t('youIndicator')}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-on-surface-muted">$250M · 4-3-3</div>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-on-surface-muted italic">
              {t('waitingForGuest')}
            </div>
          )}
        </div>
      </div>

      {/* Match Settings (Bid Timer) */}
      <div
        className="glass-panel p-4 rounded-xl flex flex-col gap-2.5"
        style={{ background: 'rgba(18, 24, 41, 0.65)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-on-surface">
            {t('timerSetting')}
          </span>
          {!isHost && (
            <span className="text-[11px] text-on-surface-muted">
              {roomData?.timerMode === 30 ? t('timer30s') : t('timerOff')}
            </span>
          )}
        </div>

        {isHost ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleTimerToggle(0)}
              className={`h-11 rounded-lg text-xs font-bold transition-all ${
                (roomData?.timerMode || 0) === 0
                  ? 'btn-gold shadow-md'
                  : 'btn-dark-glass text-on-surface-muted'
              }`}
            >
              {t('timerOff')}
            </button>
            <button
              type="button"
              onClick={() => handleTimerToggle(30)}
              className={`h-11 rounded-lg text-xs font-bold transition-all ${
                roomData?.timerMode === 30
                  ? 'btn-gold shadow-md'
                  : 'btn-dark-glass text-on-surface-muted'
              }`}
            >
              ⏱️ {t('timer30s')}
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-on-surface-muted italic m-0">
            {roomData?.timerMode === 30 ? `⏱️ ${t('timer30s')}` : t('timerOff')}
          </p>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex flex-col gap-3 pt-1">
        {isHost ? (
          <button
            type="button"
            onClick={handleStart}
            disabled={!canStart || starting}
            className="btn-gold w-full flex items-center justify-center touch-target"
            style={{
              minHeight: '56px',
              borderRadius: '8px',
              fontSize: '16px',
              letterSpacing: '0.08em',
              opacity: !canStart || starting ? 0.4 : 1,
              cursor: !canStart || starting ? 'not-allowed' : 'pointer',
            }}
          >
            {starting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              t('startMatch')
            )}
          </button>
        ) : (
          <div
            className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-xs font-bold animate-pulse"
            style={{
              background: 'rgba(23, 211, 194, 0.1)',
              border: '1px solid rgba(23, 211, 194, 0.3)',
              color: '#17D3C2',
              minHeight: '56px',
            }}
          >
            <span>⚽</span>
            <span>{t('waitingForHostToStart')}</span>
          </div>
        )}

        <button
          type="button"
          onClick={onLeave}
          className="btn-danger w-full flex items-center justify-center touch-target"
          style={{
            minHeight: '48px',
            borderRadius: '8px',
            fontSize: '13px',
          }}
        >
          {t('leaveRoom')}
        </button>
      </div>
    </div>
  );
}
