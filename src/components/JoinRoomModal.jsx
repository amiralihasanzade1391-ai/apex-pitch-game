import React, { useState } from 'react';
import { useI18n } from '../i18n/strings';
import { joinRoom } from '../firebase/rooms';

export default function JoinRoomModal({ isOpen, onClose, onJoined }) {
  const { t, isRTL } = useI18n();
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [errorInfo, setErrorInfo] = useState(null); // { key, code, message }
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCodeChange = (e) => {
    // Uppercase, remove spaces, keep only alphanumeric
    const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setRoomCode(cleaned);
    setErrorInfo(null);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!roomCode || roomCode.length < 6) return;

    setLoading(true);
    setErrorInfo(null);

    try {
      const result = await joinRoom(roomCode, playerName);
      onJoined(result);
    } catch (err) {
      console.error('Failed to join room:', err);
      let key = 'errorJoining';
      if (err.message === 'ROOM_NOT_FOUND') key = 'roomNotFound';
      else if (err.message === 'ROOM_FULL') key = 'roomFull';
      else if (err.message === 'MATCH_ALREADY_STARTED') key = 'matchAlreadyStarted';

      setErrorInfo({
        key,
        code: err?.code || (key !== 'errorJoining' ? key : 'unknown'),
        message: err?.message || String(err),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-md bg-pitch-surface/95 border border-pitch-gold/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-pitch-gold to-transparent" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pitch-teal shadow-glow-teal" />
            <h2 className="text-xl font-bold tracking-wide text-pitch-gold uppercase font-display">
              {t('joinOnlineRoom')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-300 mb-6 leading-relaxed">
          {t('joinOnlineRoomDesc')}
        </p>

        {errorInfo && (
          <div className="mb-5 p-3 rounded-xl bg-pitch-danger/20 border border-pitch-danger/50 text-pitch-danger text-xs flex flex-col gap-1 animate-shake">
            <div className="flex items-center gap-2 font-bold">
              <span className="text-base">⚠️</span>
              <span>{t(errorInfo.key)}</span>
            </div>
            {errorInfo.key === 'errorJoining' && errorInfo.code && (
              <div className="font-mono text-[10px] text-gray-300 mt-1 select-all break-all bg-black/40 p-1.5 rounded">
                [{errorInfo.code}] {errorInfo.message}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              {t('enterRoomCode')}
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={handleCodeChange}
              placeholder="E.G. 7K4X9B"
              maxLength={6}
              autoFocus
              className="w-full h-14 bg-pitch-bg/90 border border-pitch-gold/40 rounded-xl px-4 text-center font-display text-2xl tracking-[0.3em] text-pitch-gold placeholder-gray-600 focus:outline-none focus:border-pitch-gold focus:ring-2 focus:ring-pitch-gold/20 uppercase transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              {t('enterYourName')}
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t('placeholder2')}
              maxLength={20}
              className="w-full h-12 bg-pitch-bg/80 border border-gray-700 rounded-xl px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pitch-teal focus:ring-2 focus:ring-pitch-teal/20 transition-all"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || roomCode.length < 6}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-pitch-gold-dark via-pitch-gold to-pitch-gold-light text-pitch-bg font-bold font-display text-base tracking-wider uppercase shadow-gold-subtle hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-pitch-bg border-t-transparent rounded-full animate-spin" />
              ) : (
                t('joinRoomBtn')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
