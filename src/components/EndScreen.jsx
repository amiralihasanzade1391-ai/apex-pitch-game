import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/strings';
import {
  squadTotalValue,
  squadTotalSpent,
  bestBargain,
  biggestOverpay,
  LINE_ORDER,
  FORMATION,
} from '../game/engine';
import { playWinSound } from '../audio/soundEngine';
import PlayerCard from './PlayerCard';
import ShareableCard from './ShareableCard';

function ConfettiEffect() {
  const particles = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: ['#FFDF00', '#17D3C2', '#D4AF37', '#10B981', '#E5484D', '#FFFFFF'][i % 6],
    duration: `${2.2 + Math.random() * 2}s`,
    delay: `${Math.random() * 1.5}s`,
    size: `${6 + Math.random() * 7}px`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            top: '-15px',
            background: p.color,
            width: p.size,
            height: p.size,
            '--duration': p.duration,
            '--delay': p.delay,
          }}
        />
      ))}
    </div>
  );
}

function StatRow({ label, value, highlightColor }) {
  return (
    <div
      className="flex justify-between items-baseline py-1.5 border-b border-white/5"
    >
      <span
        className="font-body text-on-surface-muted"
        style={{ fontSize: '11px', letterSpacing: '0.04em' }}
      >
        {label}
      </span>
      <span
        className="font-display font-bold"
        style={{ fontSize: '18px', color: highlightColor || '#FFFFFF' }}
      >
        {value}
      </span>
    </div>
  );
}

function SquadReport({ playerState, isWinner, accentColor }) {
  const { t } = useI18n();
  const totalVal = squadTotalValue(playerState);
  const totalSpent = squadTotalSpent(playerState);
  const bargain = bestBargain(playerState);
  const overpay = biggestOverpay(playerState);

  return (
    <div
      className="flex flex-col gap-3 flex-1 min-w-0 glass-panel p-3 rounded-lg"
      style={{
        border: `1.5px solid ${isWinner ? 'rgba(212, 175, 55, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`,
        background: isWinner
          ? 'radial-gradient(ellipse at 50% 0%, rgba(26, 34, 56, 0.95) 0%, rgba(18, 24, 41, 0.98) 100%)'
          : 'rgba(18, 24, 41, 0.85)',
      }}
    >
      {/* Manager Name & Status */}
      <div className="text-center pb-2 border-b border-white/10">
        <h3
          className="font-body font-bold text-on-surface break-words leading-tight"
          style={{ fontSize: '15px' }}
        >
          {playerState.name}
        </h3>
        <div
          className="font-display font-bold mt-0.5"
          style={{ fontSize: '24px', color: accentColor }}
        >
          {totalVal} <span style={{ fontSize: '13px', opacity: 0.7 }}>{t('pts')}</span>
        </div>
      </div>

      {/* Financials & Rating Reconciliation */}
      <div className="flex flex-col">
        <StatRow
          label={t('totalSquadValue')}
          value={`${totalVal} ${t('pts')}`}
          highlightColor="#17D3C2"
        />
        <StatRow
          label={t('totalMoneySpent')}
          value={`${totalSpent} ${t('currencyUnit')}`}
          highlightColor="#FFDF00"
        />
        <StatRow
          label={t('remainingBudget')}
          value={`${playerState.budget} ${t('currencyUnit')}`}
          highlightColor="#D4AF37"
        />
      </div>

      {/* Best Bargain Highlight Box */}
      <div
        className="p-2.5 rounded-md flex flex-col gap-1"
        style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
        }}
      >
        <span
          className="font-body uppercase font-bold text-emerald-pitch tracking-wider"
          style={{ fontSize: '9px', letterSpacing: '0.06em' }}
        >
          {t('bestBargain')}
        </span>
        {bargain ? (
          <div>
            <div
              className="player-name-en font-display font-bold text-on-surface"
              style={{ fontSize: '13px' }}
            >
              {bargain.player.name}
            </div>
            <div className="font-body text-emerald-pitch font-semibold mt-0.5" style={{ fontSize: '10px' }}>
              {t('value')}: {bargain.player.value} {t('pts')} · {t('pricePaid')}: {bargain.pricePaid} {t('currencyUnit')}
              <span className="block font-bold">
                ({t('bargainDiff', bargain.player.value - bargain.pricePaid)})
              </span>
            </div>
          </div>
        ) : (
          <span className="font-body text-on-surface-muted" style={{ fontSize: '10px' }}>
            {t('noBargainFound')}
          </span>
        )}
      </div>

      {/* Biggest Overpay Highlight Box */}
      <div
        className="p-2.5 rounded-md flex flex-col gap-1"
        style={{
          background: 'rgba(229, 72, 77, 0.12)',
          border: '1px solid rgba(229, 72, 77, 0.35)',
        }}
      >
        <span
          className="font-body uppercase font-bold text-danger tracking-wider"
          style={{ fontSize: '9px', letterSpacing: '0.06em' }}
        >
          {t('biggestOverpay')}
        </span>
        {overpay ? (
          <div>
            <div
              className="player-name-en font-display font-bold text-on-surface"
              style={{ fontSize: '13px' }}
            >
              {overpay.player.name}
            </div>
            <div className="font-body text-danger font-semibold mt-0.5" style={{ fontSize: '10px' }}>
              {t('value')}: {overpay.player.value} {t('pts')} · {t('pricePaid')}: {overpay.pricePaid} {t('currencyUnit')}
              <span className="block font-bold">
                ({t('overpayDiff', overpay.pricePaid - overpay.player.value)})
              </span>
            </div>
          </div>
        ) : (
          <span className="font-body text-on-surface-muted" style={{ fontSize: '10px' }}>
            {t('noOverpayFound')}
          </span>
        )}
      </div>

      {/* Squad Cards Grid (Revealing Hidden Values) */}
      <div className="flex flex-col gap-2 mt-1">
        <span
          className="font-body font-bold text-on-surface-muted uppercase"
          style={{ fontSize: '10px', letterSpacing: '0.08em' }}
        >
          {t('finalSquadTitle')}
        </span>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {LINE_ORDER.slice().reverse().flatMap((line) => {
            const list = playerState.squad[line] || [];
            return list.map((entry, idx) => (
              <PlayerCard
                key={`${line}-${idx}`}
                player={entry.player}
                pricePaid={entry.pricePaid}
                showValue={true}
                size="sm"
              />
            ));
          })}
        </div>
      </div>
    </div>
  );
}

export default function EndScreen({
  players,
  result,
  onRestart,
  // Online Multiplayer props (Phase 3)
  isOnline = false,
  myRole = 'host',
  rematchVotes = { host: false, guest: false },
  onRematch = null,
  onLeave = null,
}) {
  const { t } = useI18n();
  const [showConfetti] = useState(true);

  const winnerIndex = result.winner;
  const isTie = winnerIndex === 'tie';
  const winnerPlayer = !isTie ? players[winnerIndex] : null;

  useEffect(() => {
    playWinSound();
  }, []);

  return (
    <div
      className="min-h-screen w-full flex flex-col p-4 relative"
      style={{
        background: 'var(--canvas-dark)',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      {!isTie && showConfetti && <ConfettiEffect />}

      {/* Atmospheric Arena Radial Floodlights */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 10%, rgba(212,175,55,0.12) 0%, rgba(23,211,194,0.06) 45%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Title Header */}
        <div className="text-center pt-2">
          <div
            className="font-display font-bold tracking-widest text-gold-bright uppercase"
            style={{ fontSize: '38px', lineHeight: 1 }}
          >
            {t('gameOver')}
          </div>
          <div
            className="font-body text-on-surface-muted uppercase mt-1 font-semibold"
            style={{ fontSize: '11px', letterSpacing: '0.12em' }}
          >
            {t('appSubtitle')}
          </div>
        </div>

        {/* Champion Showcase Banner */}
        <div
          className="glass-panel-gold p-4 text-center rounded-xl flex flex-col items-center justify-center gap-1.5"
          style={{
            background: 'radial-gradient(circle at 50% 20%, rgba(255,223,0,0.18) 0%, rgba(26,34,56,0.95) 75%)',
            borderColor: 'rgba(212, 175, 55, 0.6)',
            boxShadow: '0 0 35px -4px rgba(212, 175, 55, 0.4), inset 0 1px 0 rgba(255,223,0,0.4)',
          }}
        >
          {isTie ? (
            <>
              <div
                className="font-display font-bold text-teal"
                style={{ fontSize: '34px', letterSpacing: '0.04em' }}
              >
                {t('tieAnnouncement')}
              </div>
            </>
          ) : (
            <>
              <div
                className="font-body uppercase font-bold text-gold-bright tracking-widest"
                style={{ fontSize: '11px', letterSpacing: '0.15em' }}
              >
                🏆 {t('champion')}
              </div>
              <h1
                className="font-display font-bold text-gold-bright leading-tight break-words max-w-full px-2"
                style={{
                  fontSize: '36px',
                  letterSpacing: '0.04em',
                  textShadow: '0 2px 10px rgba(0,0,0,0.8), 0 0 20px rgba(255,223,0,0.5)',
                }}
              >
                {winnerPlayer?.name}
              </h1>
              <p
                className="font-body text-on-surface font-semibold"
                style={{ fontSize: '13px', color: '#17D3C2' }}
              >
                {t('winnerAnnouncement', winnerPlayer?.name)}
              </p>
            </>
          )}

          {/* Quick Head-to-Head Telemetry */}
          <div className="flex items-center justify-center gap-4 mt-2 pt-2 border-t border-white/10 w-full">
            <div className="text-center flex-1">
              <span className="font-body text-on-surface-muted block" style={{ fontSize: '11px' }}>
                {players[0].name}
              </span>
              <span className="font-display font-bold text-gold-bright" style={{ fontSize: '26px' }}>
                {squadTotalValue(players[0])} {t('pts')}
              </span>
            </div>

            <div
              className="font-display font-bold text-on-surface-muted opacity-40"
              style={{ fontSize: '16px' }}
            >
              {t('vsText')}
            </div>

            <div className="text-center flex-1">
              <span className="font-body text-on-surface-muted block" style={{ fontSize: '11px' }}>
                {players[1].name}
              </span>
              <span className="font-display font-bold text-teal" style={{ fontSize: '26px' }}>
                {squadTotalValue(players[1])} {t('pts')}
              </span>
            </div>
          </div>
        </div>

        {/* Comparative Squad Reports */}
        <div className="flex gap-2.5">
          <SquadReport
            playerState={players[0]}
            isWinner={winnerIndex === 0}
            accentColor="#FFDF00"
          />
          <SquadReport
            playerState={players[1]}
            isWinner={winnerIndex === 1}
            accentColor="#17D3C2"
          />
        </div>

        {/* Instagram Story Shareable Result Card (1080×1920) */}
        <div className="mt-1">
          <ShareableCard players={players} result={result} />
        </div>

        {/* Action Buttons: Online Rematch vs Offline Restart */}
        {isOnline ? (
          <div className="flex flex-col gap-2.5 mt-2">
            {/* Rematch Button */}
            {(() => {
              const myVoted = myRole === 'host' ? rematchVotes?.host : rematchVotes?.guest;
              const oppRole = myRole === 'host' ? 'guest' : 'host';
              const oppVoted = rematchVotes?.[oppRole];

              let label = t('rematch');
              let btnClass = 'btn-gold';
              let disabled = false;

              if (myVoted && oppVoted) {
                label = t('rematchBoth');
                disabled = true;
              } else if (myVoted) {
                label = t('rematchVoted');
                btnClass = 'btn-dark-glass text-pitch-gold';
                disabled = true;
              } else if (oppVoted) {
                label = t('rematchOpponentVoted');
                btnClass = 'btn-gold animate-bounce';
              }

              return (
                <button
                  type="button"
                  onClick={onRematch}
                  disabled={disabled}
                  className={`${btnClass} w-full flex items-center justify-center touch-target`}
                  style={{
                    minHeight: '56px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    letterSpacing: '0.08em',
                  }}
                >
                  ⚡ {label}
                </button>
              );
            })()}

            {/* Leave Room Button */}
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
              🚪 {t('leaveRoom')}
            </button>
          </div>
        ) : (
          /* Offline Restart Action Button (Touch Target >= 56px) */
          <button
            type="button"
            onClick={onRestart}
            className="btn-gold w-full flex items-center justify-center touch-target mt-2"
            style={{
              minHeight: '56px',
              borderRadius: '8px',
              fontSize: '15px',
              letterSpacing: '0.08em',
            }}
          >
            🔄 {t('playAgain')}
          </button>
        )}
      </div>
    </div>
  );
}
