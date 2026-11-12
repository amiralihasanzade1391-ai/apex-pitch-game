import React from 'react';
import { useI18n } from '../i18n/strings';
import { FORMATION, freeSlotsInLine } from '../game/engine';
import PlayerCard from './PlayerCard';

// Tactical line labels
const LINE_LABEL_KEYS = {
  GK: 'lineGK',
  DEF: 'lineDEF',
  MID: 'lineMID',
  FWD: 'lineFWD',
};

// Tactical specific positions in 4-3-3
const FORMATION_433_SLOTS = {
  FWD: ['LW', 'ST', 'RW'],
  MID: ['LCM', 'CM', 'RCM'],
  DEF: ['LB', 'LCB', 'RCB', 'RB'],
  GK: ['GK'],
};

function TacticalSlot({ entry, posCode, line, showValue }) {
  const { t } = useI18n();

  if (!entry) {
    return (
      <div
        className="flex flex-col items-center justify-center transition-all duration-300"
        style={{
          width: '64px',
          height: '88px',
          borderRadius: '6px',
          border: '1.5px dashed rgba(212, 175, 55, 0.35)',
          background: 'radial-gradient(circle, rgba(26, 34, 56, 0.8) 0%, rgba(10, 14, 26, 0.9) 100%)',
          boxShadow: 'inset 0 0 12px rgba(0,0,0,0.6)',
        }}
      >
        <span
          className="font-display font-bold"
          style={{ fontSize: '13px', color: '#FFDF00', letterSpacing: '0.05em' }}
        >
          {posCode}
        </span>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center my-1"
          style={{
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#FFDF00',
            fontSize: '14px',
            lineHeight: 1,
          }}
        >
          +
        </div>
        <span
          className="font-body text-center"
          style={{ fontSize: '8px', color: 'rgba(255, 255, 255, 0.4)' }}
        >
          {t('slotEmpty')}
        </span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <PlayerCard
        player={entry.player}
        pricePaid={entry.pricePaid}
        showValue={showValue}
        size="sm"
        className="transform transition-transform group-hover:scale-105"
      />
    </div>
  );
}

export default function PitchBoard({ playerState, showValue = false, compact = false }) {
  const { t } = useI18n();
  const { squad } = playerState;

  // Attack upwards: FWD at top, then MID, DEF, GK at bottom
  const linesOrder = ['FWD', 'MID', 'DEF', 'GK'];

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{
        borderRadius: '12px',
        border: '1.5px solid rgba(16, 185, 129, 0.35)',
        background: 'linear-gradient(180deg, #09170f 0%, #0d2316 25%, #0a1c11 50%, #0d2316 75%, #09170f 100%)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.7), inset 0 0 40px rgba(16, 185, 129, 0.1)',
        padding: compact ? '12px 6px' : '16px 8px',
        minHeight: compact ? '320px' : '420px',
      }}
    >
      {/* Tactical Stadium Grass Mowing Stripes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.12) 0px,
            rgba(0, 0, 0, 0.12) 36px,
            transparent 36px,
            transparent 72px
          )`,
        }}
      />

      {/* Stadium Pitch Markings SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 300 400"
      >
        {/* Outer boundary */}
        <rect x="10" y="10" width="280" height="380" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Halfway line */}
        <line x1="10" y1="200" x2="290" y2="200" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Center circle & spot */}
        <circle cx="150" cy="200" r="45" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="150" cy="200" r="2.5" fill="#FFFFFF" />
        {/* Top penalty area (Opponent) */}
        <rect x="70" y="10" width="160" height="60" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="105" y="10" width="90" height="24" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
        <path d="M 120 70 A 35 35 0 0 0 180 70" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Bottom penalty area (Our GK) */}
        <rect x="70" y="330" width="160" height="60" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <rect x="105" y="366" width="90" height="24" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
        <path d="M 120 330 A 35 35 0 0 1 180 330" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        {/* Penalty spots */}
        <circle cx="150" cy="50" r="2.5" fill="#FFFFFF" />
        <circle cx="150" cy="350" r="2.5" fill="#FFFFFF" />
      </svg>

      {/* Floating Formation HUD Banner */}
      <div className="relative z-10 flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <span
            className="font-display tracking-widest px-2 py-0.5 rounded"
            style={{
              background: 'rgba(212, 175, 55, 0.2)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#FFDF00',
              fontSize: '11px',
              letterSpacing: '0.12em',
            }}
          >
            {t('formation')}
          </span>
          <span className="font-body text-on-surface-muted" style={{ fontSize: '11px' }}>
            {t('pitchTitle')}
          </span>
        </div>
        <div
          className="font-display"
          style={{ fontSize: '13px', color: '#17D3C2', letterSpacing: '0.05em' }}
        >
          {t('squadCount', Object.values(playerState.squad).flat().length, 11)}
        </div>
      </div>

      {/* Rows of 4-3-3: FWD (3), MID (3), DEF (4), GK (1) */}
      <div className="relative z-10 flex flex-col justify-between gap-4">
        {linesOrder.map((line) => {
          const slotCodes = FORMATION_433_SLOTS[line];
          const capacity = FORMATION[line];
          const entries = squad[line] || [];
          const freeCount = freeSlotsInLine(playerState, line);

          return (
            <div key={line} className="flex flex-col items-center">
              {/* Slots Row */}
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {slotCodes.map((posCode, idx) => (
                  <TacticalSlot
                    key={`${line}-${idx}`}
                    posCode={posCode}
                    line={line}
                    entry={entries[idx] || null}
                    showValue={showValue}
                  />
                ))}
              </div>

              {/* Line Meta Badge */}
              <div className="flex items-center gap-2 mt-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <span
                  className="font-body font-semibold text-on-surface-muted"
                  style={{ fontSize: '9px', letterSpacing: '0.05em' }}
                >
                  {t(LINE_LABEL_KEYS[line])}
                </span>
                {freeCount > 0 ? (
                  <span
                    className="font-body font-bold text-teal"
                    style={{ fontSize: '9px' }}
                  >
                    {t('freeSlots', freeCount)}
                  </span>
                ) : (
                  <span
                    className="font-body text-emerald-pitch font-bold"
                    style={{ fontSize: '9px' }}
                  >
                    ✓ {t('squadComplete')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
