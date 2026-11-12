import React from 'react';
import { useI18n } from '../i18n/strings';
import { INITIAL_BUDGET, isSquadFull } from '../game/engine';

function BudgetBar({ budget }) {
  const pct = Math.max(0, Math.min(100, (budget / INITIAL_BUDGET) * 100));
  const color = pct > 50 ? '#17D3C2' : pct > 20 ? '#D4AF37' : '#E5484D';

  return (
    <div
      className="w-full h-2 rounded-full overflow-hidden p-0.5"
      style={{
        background: 'rgba(10, 14, 26, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color} 0%, #FFFFFF 100%)`,
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    </div>
  );
}

export default function PlayerPanel({ playerState, isActive, playerIndex }) {
  const { t } = useI18n();
  const isFull = isSquadFull(playerState);
  const squadCount = Object.values(playerState.squad).flat().length;

  const isGold = playerIndex === 0;
  const accentGradient = isGold
    ? 'linear-gradient(135deg, #FFDF00 0%, #D4AF37 50%, #B38F24 100%)'
    : 'linear-gradient(135deg, #17D3C2 0%, #00ccbb 50%, #00877a 100%)';
  const glowBorder = isActive
    ? isGold
      ? 'rgba(255, 223, 0, 0.6)'
      : 'rgba(23, 211, 194, 0.8)'
    : 'rgba(212, 175, 55, 0.2)';

  return (
    <div
      className={`relative flex flex-col justify-between p-3 rounded-lg transition-all duration-300 ${
        isActive ? 'shadow-lg' : ''
      }`}
      style={{
        background: isActive
          ? 'radial-gradient(ellipse at 50% 0%, rgba(26, 34, 56, 0.95) 0%, rgba(18, 24, 41, 0.98) 100%)'
          : 'rgba(18, 24, 41, 0.85)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${glowBorder}`,
        boxShadow: isActive
          ? `0 0 24px -4px ${isGold ? 'rgba(212,175,55,0.4)' : 'rgba(23,211,194,0.45)'}`
          : '0 4px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Active turn halo pin */}
      {isActive && (
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-center font-body font-bold text-black"
          style={{
            fontSize: '9px',
            background: isGold ? '#FFDF00' : '#17D3C2',
            letterSpacing: '0.08em',
            boxShadow: `0 0 12px ${isGold ? '#FFDF00' : '#17D3C2'}`,
          }}
        >
          {t('yourTurn')}
        </div>
      )}

      {/* Header row: Manager Avatar, Full Name (never truncated), Squad Fill */}
      <div className="flex items-center justify-between gap-2 mt-1">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Manager Badge Number */}
          <div
            className="shrink-0 rounded-md flex items-center justify-center font-display shadow"
            style={{
              width: '28px',
              height: '28px',
              background: accentGradient,
              color: '#0A0E1A',
              fontSize: '15px',
              fontWeight: 800,
            }}
          >
            {playerIndex + 1}
          </div>

          {/* Manager Name — renders IN FULL without truncating */}
          <div className="min-w-0 flex-1">
            <div
              className="font-body font-bold text-on-surface leading-snug break-words"
              style={{
                fontSize: playerState.name.length > 14 ? '11px' : '13px',
                letterSpacing: '0.01em',
              }}
            >
              {playerState.name}
            </div>
            <div
              className="font-body text-on-surface-muted"
              style={{ fontSize: '9px', letterSpacing: '0.04em' }}
            >
              {t('playersAcquired')}: {squadCount}/11
            </div>
          </div>
        </div>

        {/* Squad Counter Pill */}
        <div
          className="shrink-0 flex items-center justify-center px-2 py-1 rounded"
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span
            className="font-display leading-none"
            style={{
              fontSize: '18px',
              color: isFull ? '#17D3C2' : '#FFDF00',
              letterSpacing: '0.03em',
            }}
          >
            {squadCount}
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>/11</span>
          </span>
        </div>
      </div>

      {/* Budget Telemetry */}
      <div className="mt-2.5">
        <div className="flex justify-between items-baseline mb-1">
          <span
            className="font-body font-medium"
            style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}
          >
            {t('budget')}
          </span>
          <span
            className="font-display font-bold"
            style={{ fontSize: '18px', color: '#FFDF00', letterSpacing: '0.04em' }}
          >
            {playerState.budget}
            <span style={{ fontSize: '11px', color: 'rgba(255,215,0,0.7)', marginLeft: '2px', marginRight: '2px' }}>
              {t('currencyUnit')}
            </span>
          </span>
        </div>
        <BudgetBar budget={playerState.budget} />
      </div>

      {/* Squad Full Confirmation Banner */}
      {isFull && (
        <div
          className="text-center font-body font-bold rounded mt-2 py-0.5"
          style={{
            background: 'rgba(23, 211, 194, 0.15)',
            border: '1px solid rgba(23, 211, 194, 0.4)',
            color: '#17D3C2',
            fontSize: '10px',
            letterSpacing: '0.05em',
          }}
        >
          ✓ {t('squadComplete')}
        </div>
      )}
    </div>
  );
}
