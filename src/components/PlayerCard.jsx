import React from 'react';
import { useI18n } from '../i18n/strings';
import { TEAMS_DATA, NATIONALITY_FLAGS } from '../data/teamsData';
import TeamCrest from './TeamCrest';

// Position styling badges
const POSITION_THEMES = {
  GK:  { badgeBg: '#B45309', border: '#FBBF24' },
  LB:  { badgeBg: '#1D4ED8', border: '#60A5FA' },
  CB:  { badgeBg: '#1E40AF', border: '#93C5FD' },
  RB:  { badgeBg: '#1D4ED8', border: '#60A5FA' },
  DEF: { badgeBg: '#1D4ED8', border: '#60A5FA' },
  CDM: { badgeBg: '#065F46', border: '#34D399' },
  CM:  { badgeBg: '#047857', border: '#6EE7B7' },
  CAM: { badgeBg: '#059669', border: '#A7F3D0' },
  MID: { badgeBg: '#047857', border: '#34D399' },
  LW:  { badgeBg: '#991B1B', border: '#F87171' },
  RW:  { badgeBg: '#991B1B', border: '#F87171' },
  ST:  { badgeBg: '#B91C1C', border: '#FCA5A5' },
  CF:  { badgeBg: '#B91C1C', border: '#FCA5A5' },
  FWD: { badgeBg: '#991B1B', border: '#F87171' },
};

// Deterministic FIFA/EA FC stats generator based on line & OVR/value
function getPlayerStats(player) {
  const v = player.ovr || player.value || 82;
  switch (player.line) {
    case 'FWD':
      return [
        { label: 'PAC', val: Math.min(99, v + 2) },
        { label: 'SHO', val: Math.min(99, v + 1) },
        { label: 'PAS', val: Math.max(65, v - 8) },
        { label: 'DRI', val: Math.min(99, v - 1) },
        { label: 'DEF', val: Math.max(35, v - 44) },
        { label: 'PHY', val: Math.max(68, v - 10) },
      ];
    case 'MID':
      return [
        { label: 'PAC', val: Math.max(70, v - 8) },
        { label: 'SHO', val: Math.max(72, v - 7) },
        { label: 'PAS', val: Math.min(99, v + 2) },
        { label: 'DRI', val: Math.min(99, v) },
        { label: 'DEF', val: Math.max(62, v - 16) },
        { label: 'PHY', val: Math.max(70, v - 12) },
      ];
    case 'DEF':
      return [
        { label: 'PAC', val: Math.max(72, v - 8) },
        { label: 'SHO', val: Math.max(45, v - 38) },
        { label: 'PAS', val: Math.max(70, v - 12) },
        { label: 'DRI', val: Math.max(68, v - 14) },
        { label: 'DEF', val: Math.min(99, v + 2) },
        { label: 'PHY', val: Math.min(99, v + 1) },
      ];
    case 'GK':
    default:
      return [
        { label: 'DIV', val: Math.min(99, v + 1) },
        { label: 'HAN', val: Math.min(99, v) },
        { label: 'KIC', val: Math.max(72, v - 6) },
        { label: 'REF', val: Math.min(99, v + 2) },
        { label: 'SPE', val: Math.max(45, v - 35) },
        { label: 'POS', val: Math.min(99, v - 1) },
      ];
  }
}

export default function PlayerCard({
  player,
  pricePaid,
  showValue = false,
  size = 'md',
  isNew = false,
  onClick,
  className = '',
}) {
  const { t } = useI18n();

  if (!player) return null;

  const displayPos = player.specific_position || player.line;
  const posTheme = POSITION_THEMES[displayPos] || POSITION_THEMES[player.line] || POSITION_THEMES.MID;
  const teamMeta = TEAMS_DATA[player.team] || { primaryColor: '#D4AF37', secondaryColor: '#121829' };
  const natFlag = NATIONALITY_FLAGS[player.nationality] || '🌍';
  const stats = getPlayerStats(player);

  const isXl = size === 'xl'; // Hero luxury shield for Level 4
  const isLg = size === 'lg';
  const isSm = size === 'sm'; // Small gold mini-card for Level 3

  // Prominent rating: player.ovr or player.value
  const ratingNumber = player.ovr || player.value;

  // Last name extraction
  const nameParts = player.name.split(' ');
  const lastName = nameParts[nameParts.length - 1];
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : '';

  // Shield dimensions
  const dims = isSm
    ? { w: 68, h: 96 }
    : isXl
    ? { w: 220, h: 310 }
    : isLg
    ? { w: 180, h: 250 }
    : { w: 132, h: 184 };

  return (
    <div
      onClick={onClick}
      className={`relative select-none ${isNew ? 'card-flip-enter' : ''} ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
      } ${className}`}
      style={{
        width: `${dims.w}px`,
        height: `${dims.h}px`,
        perspective: '1000px',
      }}
    >
      {/* Outer FUT Shield Container with gold gradient clip */}
      <div
        className="w-full h-full relative overflow-hidden flex flex-col justify-between"
        style={{
          clipPath: 'polygon(8% 0%, 92% 0%, 100% 7%, 100% 86%, 50% 100%, 0% 86%, 0% 7%)',
          background: 'linear-gradient(145deg, #FFF0A4 0%, #D4AF37 25%, #926E17 55%, #F6C453 85%, #583F06 100%)',
          padding: isSm ? '1.5px' : isXl ? '3px' : '2px',
          boxShadow: isXl || isLg
            ? '0 16px 40px -8px rgba(0,0,0,0.85), 0 0 30px rgba(212,175,55,0.5)'
            : '0 4px 14px rgba(0,0,0,0.6)',
        }}
      >
        {/* Inner Card Body */}
        <div
          className="w-full h-full relative flex flex-col justify-between overflow-hidden"
          style={{
            clipPath: 'polygon(8% 0%, 92% 0%, 100% 7%, 100% 86%, 50% 100%, 0% 86%, 0% 7%)',
            background: 'radial-gradient(ellipse at 50% 20%, #2a2211 0%, #16171f 65%, #0a0d17 100%)',
          }}
        >
          {/* Carbon Fiber Mesh & Diagonal Shimmer Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, rgba(212,175,55,0.18) 0, rgba(212,175,55,0.18) 1px, transparent 0, transparent 6px)`,
            }}
          />

          {/* Top Stadium Floodlight Beam */}
          <div
            className="absolute -top-12 left-1/2 -translate-x-1/2 w-36 h-32 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,238,160,0.35) 0%, rgba(212,175,55,0.12) 45%, transparent 75%)',
            }}
          />

          {/* Top Section: Left Master Badge + Right Club Crest / Nation */}
          <div
            className="relative z-10 flex justify-between items-start"
            style={{
              padding: isSm
                ? '4px 4px 0 4px'
                : isXl
                ? '10px 12px 0 12px'
                : isLg
                ? '8px 10px 0 10px'
                : '6px 8px 0 8px',
            }}
          >
            {/* Master Rating & Specific Position Stack */}
            <div className="flex flex-col items-center">
              <span
                className="font-display leading-none font-bold"
                style={{
                  fontSize: isSm ? '20px' : isXl ? '52px' : isLg ? '44px' : '30px',
                  color: '#FFF2A8',
                  textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 14px rgba(246,196,83,0.6)',
                  letterSpacing: '0.02em',
                }}
              >
                {showValue ? ratingNumber : t('hiddenRating')}
              </span>

              {/* Specific Position Badge (e.g. ST, CB, CAM, GK) */}
              <span
                className="font-display uppercase tracking-widest rounded px-1 mt-0.5"
                style={{
                  fontSize: isSm ? '8px' : isXl ? '14px' : isLg ? '12px' : '10px',
                  background: posTheme.badgeBg,
                  color: '#FFFFFF',
                  border: `1px solid ${posTheme.border}`,
                  lineHeight: '1.2',
                }}
              >
                {displayPos}
              </span>

              {/* Nationality Flag */}
              {!isSm && (
                <span
                  className="mt-1 leading-none filter drop-shadow"
                  style={{ fontSize: isXl ? '15px' : '12px' }}
                  title={player.nationality}
                >
                  {natFlag}
                </span>
              )}
            </div>

            {/* Club Crest Visual (Monogram Shield in Club Colors) */}
            <div className="flex flex-col items-center gap-1">
              <TeamCrest
                teamName={player.team}
                size={isSm ? 'sm' : isXl ? 'md' : 'sm'}
              />
              {isXl && player.age && (
                <span
                  className="font-body font-bold text-on-surface-muted bg-black/40 px-1.5 py-0.5 rounded text-center"
                  style={{ fontSize: '9px' }}
                >
                  {t('ageYears', player.age)}
                </span>
              )}
            </div>
          </div>

          {/* Center: Dynamic Athlete Cutout Artwork */}
          <div className="relative flex-1 flex items-center justify-center -mt-2">
            {/* Club Color Ambient Aura */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: isSm ? '32px' : isXl ? '90px' : isLg ? '75px' : '52px',
                height: isSm ? '32px' : isXl ? '90px' : isLg ? '75px' : '52px',
                background: teamMeta.primaryColor,
                filter: 'blur(16px)',
                opacity: 0.4,
              }}
            />

            {/* Stylized Illustrated Player Silhouette */}
            <div
              className="relative flex flex-col items-center"
              style={{
                width: isSm ? '28px' : isXl ? '80px' : isLg ? '68px' : '48px',
                height: isSm ? '36px' : isXl ? '106px' : isLg ? '90px' : '64px',
              }}
            >
              {/* Head / Face */}
              <div
                className="rounded-full relative"
                style={{
                  width: isSm ? '11px' : isXl ? '28px' : isLg ? '24px' : '17px',
                  height: isSm ? '11px' : isXl ? '28px' : isLg ? '24px' : '17px',
                  background: 'linear-gradient(135deg, #FFE8B6 0%, #D4A362 100%)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}
              />
              {/* Jersey Body with Club Accent Collar */}
              <div
                className="rounded-t-md relative -mt-0.5"
                style={{
                  width: isSm ? '20px' : isXl ? '56px' : isLg ? '48px' : '34px',
                  height: isSm ? '18px' : isXl ? '50px' : isLg ? '42px' : '32px',
                  background: `linear-gradient(180deg, ${teamMeta.primaryColor} 0%, #0F131F 100%)`,
                  border: '1px solid rgba(255,255,255,0.25)',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)',
                }}
              >
                {/* Gold Jersey Number */}
                <div
                  className="w-full text-center font-display text-gold-bright opacity-85"
                  style={{
                    fontSize: isSm ? '8px' : isXl ? '18px' : isLg ? '16px' : '11px',
                    lineHeight: isSm ? '16px' : isXl ? '44px' : isLg ? '36px' : '28px',
                  }}
                >
                  {player.id}
                </div>
              </div>
              {/* Shorts */}
              <div
                className="flex gap-0.5"
                style={{
                  width: isSm ? '16px' : isXl ? '44px' : isLg ? '38px' : '28px',
                  height: isSm ? '7px' : isXl ? '22px' : isLg ? '18px' : '13px',
                }}
              >
                <div className="flex-1 rounded-b-sm bg-surface-high border-t border-black/30" />
                <div className="flex-1 rounded-b-sm bg-surface-high border-t border-black/30" />
              </div>
            </div>
          </div>

          {/* Lower Section: Gold Ribbon, Name & Attributes */}
          <div
            className="relative z-10 flex flex-col justify-center"
            style={{
              background: 'linear-gradient(to top, rgba(10,14,26,0.98) 0%, rgba(18,24,41,0.92) 80%, rgba(212,175,55,0.15) 100%)',
              borderTop: '1px solid rgba(212,175,55,0.35)',
              padding: isSm
                ? '3px 4px 8px 4px'
                : isXl
                ? '8px 10px 16px 10px'
                : isLg
                ? '6px 8px 14px 8px'
                : '4px 6px 10px 6px',
            }}
          >
            {/* Player Name Banner */}
            <div className="text-center w-full">
              {!isSm && firstName && (
                <div
                  className="player-name-en font-body uppercase text-on-surface-muted truncate"
                  style={{ fontSize: isXl ? '10px' : isLg ? '9px' : '7px', letterSpacing: '0.08em', lineHeight: 1 }}
                >
                  {firstName}
                </div>
              )}
              <div
                className="player-name-en font-display font-bold text-on-surface uppercase"
                style={{
                  fontSize: isSm ? '10px' : isXl ? '20px' : isLg ? '17px' : '13px',
                  letterSpacing: '0.04em',
                  lineHeight: 1.1,
                  color: '#FFFFFF',
                  textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                  whiteSpace: isSm ? 'nowrap' : 'normal',
                }}
                title={player.name}
              >
                {isSm ? lastName : player.name}
              </div>
            </div>

            {/* EA FC 6-Stats Grid (Visible on md, lg, xl cards) */}
            {!isSm && (
              <div
                className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1 pt-1 border-t border-white/10"
                style={{ fontSize: isXl ? '11px' : isLg ? '9px' : '7.5px' }}
              >
                <div className="flex flex-col gap-0.5">
                  {stats.slice(0, 3).map((s) => (
                    <div key={s.label} className="flex justify-between items-center px-1">
                      <span className="font-display font-bold text-gold-bright">{s.val}</span>
                      <span className="font-body text-on-surface-muted font-semibold">{s.label}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-0.5">
                  {stats.slice(3, 6).map((s) => (
                    <div key={s.label} className="flex justify-between items-center px-1">
                      <span className="font-display font-bold text-gold-bright">{s.val}</span>
                      <span className="font-body text-on-surface-muted font-semibold">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Market Value Tag (Level 4 Scout / End Screen) */}
            {showValue && player.value && (
              <div
                className="text-center font-display rounded mt-1"
                style={{
                  fontSize: isSm ? '9px' : isXl ? '14px' : '11px',
                  color: '#17D3C2',
                  background: 'rgba(23, 211, 194, 0.12)',
                  border: '1px solid rgba(23, 211, 194, 0.35)',
                  letterSpacing: '0.04em',
                  padding: '1px 4px',
                }}
              >
                {t('marketValue')}: ${player.value}M
              </div>
            )}

            {/* Price Paid Badge (In squad view) */}
            {pricePaid !== undefined && (
              <div
                className="text-center font-display rounded mt-0.5"
                style={{
                  fontSize: isSm ? '8px' : isXl ? '14px' : isLg ? '13px' : '10px',
                  color: '#FFDF00',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  letterSpacing: '0.05em',
                  padding: '1px 3px',
                }}
              >
                {pricePaid} {t('currencyUnit')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
