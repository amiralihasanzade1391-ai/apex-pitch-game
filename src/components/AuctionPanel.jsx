import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/strings';
import { canBidForLine } from '../game/engine';
import {
  playBidSound,
  playPassSound,
  playSoldSound,
  playCardFlipSound,
} from '../audio/soundEngine';
import PlayerCard from './PlayerCard';

const QUICK_BID_INCREMENTS = [1, 5, 10, 25];

export default function AuctionPanel({
  currentCard,
  currentBid,
  currentBidder,
  auctionTurn,
  players,
  deckIndex,
  deckTotal,
  onBid,
  onPass,
  soldStamp,
  // Online Multiplayer props (Phase 3)
  isOnline = false,
  mySeatIndex = 0,
  opponentConnected = true,
  turnDeadline = null,
  timerMode = 0,
  onTimeout = null,
}) {
  const { t } = useI18n();
  const [customInput, setCustomInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);

  const activePlayer = players[auctionTurn];
  const lastBidderName = currentBidder !== null ? players[currentBidder]?.name : null;
  const minBid = currentBid + 1;
  const isCardActionable = !!currentCard && !soldStamp;

  // In online mode, you can only act when it is YOUR turn
  const isMyTurn = !isOnline || mySeatIndex === auctionTurn;

  const hasSlotInLine = activePlayer ? canBidForLine(activePlayer, currentCard?.line) : false;
  const canAffordMinBid = activePlayer ? activePlayer.budget >= minBid : false;

  // Turn timer countdown effect
  useEffect(() => {
    if (!isOnline || timerMode !== 30 || !turnDeadline || soldStamp) {
      setTimeLeft(null);
      return;
    }

    const interval = setInterval(() => {
      const remainingMs = turnDeadline - Date.now();
      const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
      setTimeLeft(seconds);

      if (seconds <= 0) {
        clearInterval(interval);
        if (isMyTurn && onTimeout) {
          onTimeout();
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isOnline, timerMode, turnDeadline, soldStamp, isMyTurn, onTimeout]);

  // Audio: trigger card flip sound on new card
  useEffect(() => {
    if (currentCard?.name) {
      playCardFlipSound();
    }
  }, [currentCard?.name, deckIndex]);

  // Audio: trigger sold / discarded thud on stamp
  useEffect(() => {
    if (soldStamp) {
      playSoldSound();
    }
  }, [soldStamp]);

  async function handleQuickBid(increment) {
    if (!isMyTurn) return;
    setErrorMessage('');
    const amount = currentBid + increment;
    const result = await onBid(auctionTurn, amount);
    if (result?.error) {
      setErrorMessage(t(result.error));
    } else {
      playBidSound();
    }
  }

  async function handleCustomBid(e) {
    if (e) e.preventDefault();
    if (!isMyTurn) return;
    setErrorMessage('');
    const amount = parseInt(customInput, 10);
    if (isNaN(amount) || amount <= currentBid) {
      setErrorMessage(t('mustBeatPrice'));
      return;
    }
    if (amount > (activePlayer?.budget ?? 0)) {
      setErrorMessage(t('insufficientBudget'));
      return;
    }
    const result = await onBid(auctionTurn, amount);
    if (result?.error) {
      setErrorMessage(t(result.error));
    } else {
      playBidSound();
      setCustomInput('');
    }
  }

  function handlePass() {
    if (!isMyTurn) return;
    setErrorMessage('');
    playPassSound();
    onPass(auctionTurn);
  }

  if (!currentCard) {
    return (
      <div
        className="glass-panel-gold p-8 text-center flex flex-col items-center justify-center gap-3"
        style={{ minHeight: '260px' }}
      >
        <div className="font-display text-gold-bright" style={{ fontSize: '32px' }}>
          {t('gameOver')}
        </div>
        <p className="font-body text-on-surface-muted" style={{ fontSize: '13px' }}>
          {t('deckEmpty')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* ─── Opponent Disconnected Banner (Online Mode) ─────────── */}
      {isOnline && !opponentConnected && (
        <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-body font-bold flex items-center justify-center gap-2 animate-pulse shadow-lg">
          <span>⚠️</span>
          <span>{t('opponentWaitingBanner')}</span>
        </div>
      )}

      {/* ─── Hero Auction Stage ───────────────────────────────────── */}
      <div
        className="glass-panel-gold relative p-3 flex gap-3 items-stretch overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 10%, rgba(26, 34, 56, 0.95) 0%, rgba(10, 14, 26, 0.95) 100%)',
          borderColor: 'rgba(212, 175, 55, 0.35)',
        }}
      >
        {/* SOLD / DISCARDED Stamp Slam */}
        {soldStamp === 'sold' && (
          <div className="sold-stamp animate-sold-stamp">
            {t('soldStamp')}
          </div>
        )}
        {soldStamp === 'discarded' && (
          <div
            className="sold-stamp animate-sold-stamp"
            style={{
              color: '#E5484D',
              borderColor: '#E5484D',
              textShadow: '0 0 25px rgba(229, 72, 77, 0.9)',
              boxShadow: '0 0 30px rgba(229, 72, 77, 0.6)',
            }}
          >
            {t('discardedStamp')}
          </div>
        )}

        {/* Dynamic FUT Card Centerstage with 3D Flip on Draw */}
        <div
          key={currentCard?.name || deckIndex}
          className="card-flip-container card-flip-enter shrink-0 flex items-center justify-center"
        >
          <PlayerCard
            player={currentCard}
            size="md"
            isNew={true}
            showValue={false}
          />
        </div>

        {/* Card Telemetry & Live Bidding Board */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          {/* Top Live Badge + Deck Progress */}
          <div className="flex items-center justify-between gap-1">
            <span className="badge-live">{t('liveAuction')}</span>
            <span
              className="font-body font-bold text-on-surface-muted"
              style={{ fontSize: '11px', letterSpacing: '0.04em' }}
            >
              {t('cardCount')} {deckIndex + 1} {t('of')} {deckTotal}
            </span>
          </div>

          {/* Player Bio — No truncated labels! */}
          <div className="my-1">
            <h2
              className="player-name-en font-display text-on-surface uppercase leading-tight font-bold"
              style={{
                fontSize: currentCard.name.length > 18 ? '16px' : '20px',
                letterSpacing: '0.03em',
                color: '#FFFFFF',
              }}
            >
              {currentCard.name}
            </h2>
            <div
              className="font-body text-on-surface-muted flex items-center gap-1.5 flex-wrap mt-0.5"
              style={{ fontSize: '11px' }}
            >
              <span className="player-name-en font-semibold text-gold-bright">{currentCard.team}</span>
              <span style={{ opacity: 0.4 }}>•</span>
              <span className="player-name-en">{currentCard.league}</span>
            </div>
          </div>

          {/* Current Bid Display Trench */}
          <div
            className="p-2.5 rounded-md flex flex-col justify-center"
            style={{
              background: 'rgba(10, 14, 26, 0.9)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            <div
              className="font-body text-on-surface-muted uppercase font-semibold"
              style={{ fontSize: '9px', letterSpacing: '0.08em' }}
            >
              {currentBid > 0 ? t('currentPrice') : t('noBidsYet')}
            </div>

            <div className="flex items-baseline justify-between gap-1 mt-0.5">
              <div className="flex items-baseline gap-1">
                <span
                  key={currentBid}
                  className="price-counter font-display font-bold leading-none"
                  style={{
                    fontSize: '32px',
                    color: '#FFDF00',
                    textShadow: '0 0 16px rgba(255, 223, 0, 0.5)',
                  }}
                >
                  {currentBid}
                </span>
                <span
                  className="font-body font-bold text-gold-bright"
                  style={{ fontSize: '12px' }}
                >
                  {t('currencyUnit')}
                </span>
              </div>

              {/* Min next bid tag */}
              <div
                className="font-body font-bold px-1.5 py-0.5 rounded text-right shrink-0"
                style={{
                  background: 'rgba(23, 211, 194, 0.15)',
                  color: '#17D3C2',
                  fontSize: '9px',
                }}
              >
                {t('minNextBid')}: {minBid}M$
              </div>
            </div>

            {/* Last bidder attribution */}
            <div
              className="font-body text-on-surface-muted truncate mt-1 pt-1 border-t border-white/5"
              style={{ fontSize: '10px' }}
            >
              {t('lastBidder')}:{' '}
              <span
                className="font-bold"
                style={{
                  color: currentBidder === 0 ? '#FFDF00' : currentBidder === 1 ? '#17D3C2' : '#8A94A6',
                }}
              >
                {lastBidderName ?? t('none')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Turn Indicator & Timer Bar ─────────────────────────────── */}
      <div
        className="glass-panel p-2.5 rounded-lg flex items-center justify-between gap-2 shadow"
        style={{
          border: isMyTurn
            ? (auctionTurn === 0 ? '1px solid rgba(212, 175, 55, 0.6)' : '1px solid rgba(23, 211, 194, 0.6)')
            : '1px solid rgba(255, 255, 255, 0.1)',
          background: isMyTurn
            ? (auctionTurn === 0 ? 'rgba(212, 175, 55, 0.08)' : 'rgba(23, 211, 194, 0.08)')
            : 'rgba(10, 14, 26, 0.7)',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center font-display font-bold shrink-0"
            style={{
              background: auctionTurn === 0
                ? 'linear-gradient(135deg, #FFDF00 0%, #D4AF37 100%)'
                : 'linear-gradient(135deg, #17D3C2 0%, #00ccbb 100%)',
              color: '#0A0E1A',
              fontSize: '14px',
            }}
          >
            {auctionTurn + 1}
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="font-body font-bold text-on-surface leading-tight break-words flex items-center gap-1.5"
              style={{ fontSize: '12px' }}
            >
              <span>{t('turnIndicator', activePlayer?.name)}</span>
              {isOnline && isMyTurn && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-pitch-gold/20 text-pitch-gold border border-pitch-gold/40">
                  {t('yourTurn')}
                </span>
              )}
            </div>
            <div
              className="font-body text-on-surface-muted"
              style={{ fontSize: '10px' }}
            >
              {t('budget')}: <span className="font-bold text-gold-bright">{activePlayer?.budget} {t('currencyUnit')}</span>
            </div>
          </div>
        </div>

        {/* Turn Timer Badge (if active) */}
        {timeLeft !== null && (
          <div className="shrink-0 flex items-center gap-1 px-2 py-1 rounded bg-black/40 border border-pitch-gold/30">
            <span className="text-xs">⏱️</span>
            <span
              className={`font-display font-black text-sm ${
                timeLeft <= 5 ? 'text-pitch-danger animate-ping' : 'text-pitch-gold'
              }`}
            >
              {timeLeft}s
            </span>
          </div>
        )}

        {/* Slot Availability Alert */}
        {!hasSlotInLine && (
          <span
            className="shrink-0 font-body font-bold text-danger bg-danger/10 border border-danger/30 px-2 py-0.5 rounded text-center"
            style={{ fontSize: '9px' }}
          >
            {t('lineFull')}
          </span>
        )}
      </div>

      {/* Online Mode: Waiting for Opponent Turn Banner */}
      {isOnline && !isMyTurn && (
        <div className="p-3 rounded-xl bg-pitch-surface/60 border border-white/10 text-center font-body text-xs text-gray-300 backdrop-blur-md animate-pulse">
          ⚽ {t('onlineTurnWait', activePlayer?.name)}
        </div>
      )}

      {/* ─── Quick Bid Increments (Touch Target >= 56px) ─────────── */}
      <div className="flex flex-col gap-1.5">
        <div
          className="font-body uppercase text-on-surface-muted font-bold px-1"
          style={{ fontSize: '10px', letterSpacing: '0.08em' }}
        >
          {t('quickBid')}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_BID_INCREMENTS.map((inc) => {
            const bidVal = currentBid + inc;
            const canAfford = (activePlayer?.budget ?? 0) >= bidVal;
            const isEligible = isCardActionable && hasSlotInLine && canAfford && isMyTurn;

            return (
              <button
                key={inc}
                type="button"
                className="btn-dark-glass flex flex-col items-center justify-center touch-target"
                style={{
                  minHeight: '56px',
                  borderRadius: '6px',
                }}
                onClick={() => handleQuickBid(inc)}
                disabled={!isEligible}
              >
                <span className="font-display font-bold leading-none" style={{ fontSize: '20px' }}>
                  +{inc}
                </span>
                <span
                  className="font-body font-semibold opacity-60 leading-none mt-1"
                  style={{ fontSize: '9px' }}
                >
                  {bidVal} {t('currencyUnit')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Custom Bid Input Form (Touch Target >= 56px) ────────── */}
      <form onSubmit={handleCustomBid} className="flex gap-2 items-stretch">
        <div
          className="flex-1 relative flex items-center rounded-md overflow-hidden"
          style={{
            background: '#0A0E1A',
            border: '1.5px solid rgba(212, 175, 55, 0.35)',
            minHeight: '56px',
          }}
        >
          <input
            type="number"
            min={minBid}
            max={activePlayer?.budget}
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              setErrorMessage('');
            }}
            placeholder={
              !isMyTurn
                ? `${t('notYourTurn')}`
                : `${t('enterAmount')} (≥ ${minBid})`
            }
            disabled={!isCardActionable || !hasSlotInLine || !canAffordMinBid || !isMyTurn}
            className="w-full h-full px-3 bg-transparent text-center font-display font-bold outline-none text-gold-bright"
            style={{
              fontSize: '22px',
              letterSpacing: '0.04em',
              direction: 'ltr',
            }}
          />
        </div>

        <button
          type="submit"
          className="btn-gold flex items-center justify-center touch-target px-4"
          style={{
            minHeight: '56px',
            minWidth: '88px',
            borderRadius: '6px',
            fontSize: '12px',
          }}
          disabled={!isCardActionable || !hasSlotInLine || !customInput || !isMyTurn}
        >
          {t('confirmBid')}
        </button>
      </form>

      {/* ─── Error / Warning Notice ───────────────────────────────── */}
      {errorMessage && (
        <div
          className="font-body text-center px-3 py-2 rounded-md font-semibold"
          style={{
            background: 'rgba(229, 72, 77, 0.15)',
            border: '1px solid rgba(229, 72, 77, 0.4)',
            color: '#E5484D',
            fontSize: '11px',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* ─── PASS Button (Danger styling, Touch Target >= 56px) ───── */}
      <button
        type="button"
        className="btn-danger w-full flex flex-col items-center justify-center touch-target"
        style={{
          minHeight: '56px',
          borderRadius: '6px',
          padding: '8px 12px',
        }}
        onClick={handlePass}
        disabled={!isCardActionable || !isMyTurn}
      >
        <span className="font-body font-bold text-base leading-tight">
          {currentBidder !== null
            ? `✗ ${t('pass')} — ${t('mustBuyAlert', lastBidderName)}`
            : `✗ ${t('pass')}`}
        </span>
      </button>
    </div>
  );
}
