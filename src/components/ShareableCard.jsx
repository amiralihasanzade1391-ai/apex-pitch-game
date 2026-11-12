import React, { useRef, useState, useCallback } from 'react';
import { useI18n } from '../i18n/strings';
import {
  squadTotalValue,
  squadTotalSpent,
  LINE_ORDER,
} from '../game/engine';

/**
 * ShareableCard: renders the match result as a 1080×1920 Instagram Story image.
 * Uses html2canvas to capture a hidden div, then offers download / native share.
 */
export default function ShareableCard({ players, result }) {
  const { t, locale } = useI18n();
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const winnerIndex = result.winner;
  const isTie = winnerIndex === 'tie';

  const generateImage = useCallback(async () => {
    if (!cardRef.current || generating) return;
    setGenerating(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        width: 1080,
        height: 1920,
        scale: 1,
        backgroundColor: '#0A0E1A',
        useCORS: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setGenerating(false);
          return;
        }

        const file = new File([blob], 'apex-pitch-result.png', { type: 'image/png' });

        // Try native share first
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              title: t('shareCardTitle'),
              files: [file],
            });
            setGenerated(true);
            setGenerating(false);
            return;
          } catch (shareErr) {
            // User cancelled share or share failed, fall through to download
          }
        }

        // Fallback: download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'apex-pitch-result.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setGenerated(true);
        setGenerating(false);
      }, 'image/png');
    } catch (err) {
      console.error('Error generating share card:', err);
      setGenerating(false);
    }
  }, [generating, t]);

  const dateStr = new Date().toLocaleDateString(locale === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const renderSquadList = (playerState, accentColor) => {
    const entries = LINE_ORDER.flatMap(line =>
      (playerState.squad[line] || []).map(e => ({
        ...e,
        line,
      }))
    );
    return entries.map((entry, idx) => (
      <div
        key={idx}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '28px',
            color: accentColor,
            width: '50px',
            textAlign: 'center',
          }}>
            {entry.player.value}
          </span>
          <div>
            <div style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              direction: 'ltr',
            }}>
              {entry.player.name}
            </div>
            <div style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.5)',
              direction: 'ltr',
            }}>
              {entry.player.team} · {entry.line}
            </div>
          </div>
        </div>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '24px',
          color: '#D4AF37',
        }}>
          {entry.pricePaid}M$
        </span>
      </div>
    ));
  };

  return (
    <>
      {/* Hidden render target — exactly 1080×1920 */}
      <div
        ref={cardRef}
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '1080px',
          height: '1920px',
          background: 'linear-gradient(180deg, #0A0E1A 0%, #121829 30%, #0A0E1A 100%)',
          overflow: 'hidden',
          fontFamily: "'Outfit', 'Vazirmatn', sans-serif",
          direction: 'ltr',
          zIndex: -1,
        }}
      >
        {/* Top Branding Bar */}
        <div style={{
          textAlign: 'center',
          padding: '60px 40px 30px',
          borderBottom: '2px solid rgba(212,175,55,0.3)',
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '72px',
            color: '#FFDF00',
            letterSpacing: '8px',
            lineHeight: 1,
          }}>
            APEX PITCH
          </div>
          <div style={{
            fontSize: '22px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '4px',
            marginTop: '8px',
            textTransform: 'uppercase',
          }}>
            Ultimate Player Auction · {dateStr}
          </div>
        </div>

        {/* Winner Banner */}
        <div style={{
          background: isTie
            ? 'linear-gradient(135deg, rgba(23,211,194,0.2) 0%, rgba(23,211,194,0.05) 100%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(255,223,0,0.2) 0%, rgba(212,175,55,0.05) 100%)',
          padding: '40px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(212,175,55,0.2)',
        }}>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '32px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '6px',
          }}>
            🏆 {isTie ? 'DRAW' : 'CHAMPION'}
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '64px',
            color: '#FFDF00',
            letterSpacing: '4px',
            textShadow: '0 4px 20px rgba(255,223,0,0.4)',
            lineHeight: 1.1,
          }}>
            {isTie ? 'TIE MATCH' : players[winnerIndex]?.name?.toUpperCase()}
          </div>
        </div>

        {/* Score Summary */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          padding: '30px 40px',
          background: 'rgba(18,24,41,0.8)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)' }}>{players[0].name}</div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '56px',
              color: '#FFDF00',
              lineHeight: 1,
            }}>
              {squadTotalValue(players[0])}
            </div>
            <div style={{ fontSize: '16px', color: '#D4AF37' }}>{squadTotalSpent(players[0])}M$ spent</div>
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px',
            color: 'rgba(255,255,255,0.3)',
          }}>
            VS
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)' }}>{players[1].name}</div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '56px',
              color: '#17D3C2',
              lineHeight: 1,
            }}>
              {squadTotalValue(players[1])}
            </div>
            <div style={{ fontSize: '16px', color: '#0FA89A' }}>{squadTotalSpent(players[1])}M$ spent</div>
          </div>
        </div>

        {/* Two-column squad lists */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '20px 20px',
          flex: 1,
        }}>
          {/* Player 1 Squad */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '26px',
              color: '#FFDF00',
              letterSpacing: '3px',
              padding: '8px 16px',
              borderBottom: '2px solid rgba(212,175,55,0.3)',
            }}>
              {players[0].name}
            </div>
            {renderSquadList(players[0], '#FFDF00')}
          </div>

          {/* Divider */}
          <div style={{
            width: '2px',
            background: 'linear-gradient(180deg, rgba(212,175,55,0.4) 0%, rgba(255,255,255,0.05) 100%)',
          }} />

          {/* Player 2 Squad */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '26px',
              color: '#17D3C2',
              letterSpacing: '3px',
              padding: '8px 16px',
              borderBottom: '2px solid rgba(23,211,194,0.3)',
            }}>
              {players[1].name}
            </div>
            {renderSquadList(players[1], '#17D3C2')}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: '20px',
          borderTop: '1px solid rgba(212,175,55,0.2)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}>
          <div style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '3px',
          }}>
            APEX PITCH · ULTIMATE PLAYER AUCTION
          </div>
        </div>
      </div>

      {/* Visible Share Button */}
      <button
        type="button"
        onClick={generateImage}
        disabled={generating}
        className="btn-gold w-full flex items-center justify-center touch-target"
        style={{
          minHeight: '56px',
          borderRadius: '8px',
          fontSize: '15px',
          letterSpacing: '0.08em',
          opacity: generating ? 0.6 : 1,
        }}
      >
        {generating ? '⏳ ...' : generated ? `✅ ${t('shareResult')}` : `📸 ${t('shareResult')}`}
      </button>
    </>
  );
}
