import React from 'react';
import { useI18n } from '../i18n/strings';

export default function BidLog({ entries, maxEntries = 25 }) {
  const { t } = useI18n();
  const displayEntries = entries.slice(0, maxEntries);

  function getBadgeConfig(type) {
    switch (type) {
      case 'bid':
        return {
          icon: '▲',
          color: '#FFDF00',
          bg: 'rgba(255, 223, 0, 0.12)',
          border: 'rgba(255, 223, 0, 0.3)',
        };
      case 'buy':
        return {
          icon: '✓',
          color: '#17D3C2',
          bg: 'rgba(23, 211, 194, 0.15)',
          border: 'rgba(23, 211, 194, 0.4)',
        };
      case 'pass':
        return {
          icon: '✕',
          color: '#E5484D',
          bg: 'rgba(229, 72, 77, 0.15)',
          border: 'rgba(229, 72, 77, 0.4)',
        };
      case 'discard':
      default:
        return {
          icon: '—',
          color: 'rgba(255, 255, 255, 0.4)',
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        };
    }
  }

  function renderMessage(entry) {
    switch (entry.type) {
      case 'bid':
        return t('logBid', entry.playerName, entry.amount);
      case 'pass':
        return t('logPass', entry.playerName);
      case 'buy':
        return t('logBought', entry.playerName, entry.cardName, entry.amount);
      case 'discard':
        return t('logDiscarded', entry.cardName);
      default:
        return '';
    }
  }

  return (
    <div
      className="glass-panel w-full flex flex-col rounded-lg overflow-hidden"
      style={{
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(18, 24, 41, 0.85)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 shrink-0"
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(10, 14, 26, 0.6)',
        }}
      >
        <span
          className="font-body font-bold uppercase tracking-wider text-on-surface-muted"
          style={{ fontSize: '10px', letterSpacing: '0.08em' }}
        >
          {t('bidHistory')}
        </span>
        <span
          className="font-display font-bold text-gold-bright"
          style={{ fontSize: '13px' }}
        >
          {entries.length}
        </span>
      </div>

      {/* Scrollable Feed List */}
      <div
        className="flex flex-col overflow-y-auto divide-y divide-white/5"
        style={{ maxHeight: '150px' }}
      >
        {displayEntries.length === 0 ? (
          <div
            className="flex items-center justify-center p-4 font-body text-on-surface-muted opacity-50"
            style={{ fontSize: '11px' }}
          >
            {t('logEmpty')}
          </div>
        ) : (
          displayEntries.map((entry, idx) => {
            const badge = getBadgeConfig(entry.type);
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 px-3 py-2 bid-log-entry"
                style={{
                  animation: idx === 0 ? 'slideIn 0.25s ease-out' : 'none',
                }}
              >
                <span
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-display font-bold"
                  style={{
                    fontSize: '11px',
                    color: badge.color,
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                  }}
                >
                  {badge.icon}
                </span>

                <span
                  className="font-body text-on-surface leading-tight break-words flex-1"
                  style={{ fontSize: '11px' }}
                >
                  {renderMessage(entry)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
