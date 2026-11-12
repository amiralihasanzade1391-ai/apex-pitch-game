import React from 'react';
import { TEAMS_DATA } from '../data/teamsData';

export default function TeamCrest({ teamName, size = 'md', className = '' }) {
  const team = TEAMS_DATA[teamName] || {
    primaryColor: '#D4AF37',
    secondaryColor: '#121829',
    accentColor: '#FFFFFF',
    monogram: teamName ? teamName.slice(0, 3).toUpperCase() : 'FC',
    symbol: '⚽'
  };

  const dims = {
    sm: { w: 26, h: 30, font: 9, symbol: 8 },
    md: { w: 46, h: 54, font: 14, symbol: 13 },
    lg: { w: 68, h: 78, font: 20, symbol: 18 },
    xl: { w: 90, h: 104, font: 26, symbol: 24 }
  }[size] || { w: 46, h: 54, font: 14, symbol: 13 };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: `${dims.w}px`,
        height: `${dims.h}px`,
      }}
      title={teamName}
    >
      {/* Outer Shield Frame with Gold/Metallic Edge */}
      <div
        className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden"
        style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 74%, 50% 100%, 0% 74%)',
          background: `linear-gradient(145deg, #FFE885 0%, ${team.primaryColor} 30%, ${team.secondaryColor} 100%)`,
          padding: size === 'sm' ? '1px' : '2px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        }}
      >
        {/* Inner Shield Body */}
        <div
          className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden"
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 74%, 50% 100%, 0% 74%)',
            background: `radial-gradient(ellipse at 50% 25%, ${team.primaryColor} 0%, ${team.secondaryColor} 90%)`,
          }}
        >
          {/* Subtle Diagonal Mesh Stripes */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0, rgba(255,255,255,0.2) 1px, transparent 0, transparent 4px)',
            }}
          />

          {/* Top Symbol Mascot */}
          {size !== 'sm' && (
            <span
              className="leading-none select-none -mt-1 opacity-90 filter drop-shadow"
              style={{ fontSize: `${dims.symbol}px` }}
            >
              {team.symbol}
            </span>
          )}

          {/* Bold Monogram */}
          <span
            className="font-display font-bold leading-none tracking-wider text-center uppercase"
            style={{
              fontSize: `${dims.font}px`,
              color: team.accentColor || '#FFFFFF',
              textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 6px rgba(255,255,255,0.3)',
              marginTop: size === 'sm' ? 0 : '1px',
            }}
          >
            {team.monogram}
          </span>
        </div>
      </div>
    </div>
  );
}
