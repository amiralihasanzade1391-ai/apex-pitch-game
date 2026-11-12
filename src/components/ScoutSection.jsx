import React, { useState, useMemo, useEffect } from 'react';
import { useI18n } from '../i18n/strings';
import { LEAGUES_DATA, TEAMS_DATA, NATIONALITY_FLAGS } from '../data/teamsData';
import { getPlayers, getPlayersSync } from '../data/playersLoader';
import TeamCrest from './TeamCrest';
import PlayerCard from './PlayerCard';

export default function ScoutSection({ onReturnHome }) {
  const { t, isRTL } = useI18n();

  const [allPlayersData, setAllPlayersData] = useState(() => getPlayersSync() || []);

  useEffect(() => {
    if (!allPlayersData.length) {
      getPlayers().then((data) => setAllPlayersData(data || []));
    }
  }, [allPlayersData.length]);

  // Navigation states:
  // selectedLeague: null | league object
  // selectedTeam: null | team name string
  // selectedPlayer: null | player object
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Filter players by team if selected
  const teamPlayers = useMemo(() => {
    if (!selectedTeam) return [];
    return allPlayersData.filter((p) => p.team === selectedTeam);
  }, [selectedTeam]);

  // Live search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allPlayersData.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.nationality.toLowerCase().includes(q) ||
        p.specific_position.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [searchQuery]);

  // Handle Breadcrumb navigation steps
  function goToLeagues() {
    setSelectedLeague(null);
    setSelectedTeam(null);
    setSelectedPlayer(null);
    setSearchQuery('');
  }

  function goToTeams(league) {
    setSelectedLeague(league);
    setSelectedTeam(null);
    setSelectedPlayer(null);
    setSearchQuery('');
  }

  function goToPlayers(teamName) {
    const teamMeta = TEAMS_DATA[teamName];
    if (teamMeta) {
      const parentLeague = LEAGUES_DATA.find((l) => l.name === teamMeta.league);
      if (parentLeague) setSelectedLeague(parentLeague);
    }
    setSelectedTeam(teamName);
    setSelectedPlayer(null);
    setSearchQuery('');
  }

  function openPlayerCard(player) {
    // Also ensure parent league and team are set for seamless breadcrumb trail
    const teamMeta = TEAMS_DATA[player.team];
    if (teamMeta) {
      const parentLeague = LEAGUES_DATA.find((l) => l.name === teamMeta.league);
      if (parentLeague) setSelectedLeague(parentLeague);
    }
    setSelectedTeam(player.team);
    setSelectedPlayer(player);
    setSearchQuery('');
  }

  function handleBackStep() {
    if (selectedPlayer) {
      setSelectedPlayer(null);
    } else if (selectedTeam) {
      setSelectedTeam(null);
    } else if (selectedLeague) {
      setSelectedLeague(null);
    } else if (onReturnHome) {
      onReturnHome();
    }
  }

  return (
    <div className="w-full flex flex-col gap-3 min-h-[500px]">
      {/* ─── Top Control: Back button, Title & Return Home ──────── */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={handleBackStep}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded font-body font-bold text-on-surface transition-all"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            fontSize: '12px',
          }}
        >
          <span>{isRTL ? '→' : '←'}</span>
          <span>{t('back')}</span>
        </button>

        <div className="text-center min-w-0 flex-1">
          <h2
            className="font-display font-bold text-gold-bright uppercase tracking-wider truncate"
            style={{ fontSize: '18px' }}
          >
            {t('scoutTitle')}
          </h2>
        </div>

        {onReturnHome && (
          <button
            type="button"
            onClick={onReturnHome}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded font-body font-bold text-teal transition-all"
            style={{
              background: 'rgba(23, 211, 194, 0.12)',
              border: '1px solid rgba(23, 211, 194, 0.35)',
              fontSize: '11px',
            }}
          >
            <span>🏠</span>
            <span className="hidden sm:inline">{t('home')}</span>
          </button>
        )}
      </div>

      {/* ─── Breadcrumb Navigation Bar ──────────────────────────── */}
      <div
        className="glass-panel flex items-center gap-1.5 px-3 py-2 rounded-md overflow-x-auto text-xs font-body font-semibold"
        style={{
          border: '1px solid rgba(212, 175, 55, 0.25)',
          background: 'rgba(10, 14, 26, 0.85)',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Step 1: Leagues */}
        <button
          type="button"
          onClick={goToLeagues}
          className={`hover:text-gold-bright transition-colors ${
            !selectedLeague ? 'text-gold-bright font-bold' : 'text-on-surface-muted'
          }`}
        >
          {t('breadcrumbLeagues')}
        </button>

        {selectedLeague && (
          <>
            <span className="text-white/30">{isRTL ? '‹' : '›'}</span>
            <button
              type="button"
              onClick={() => goToTeams(selectedLeague)}
              className={`hover:text-gold-bright transition-colors ${
                selectedLeague && !selectedTeam ? 'text-gold-bright font-bold' : 'text-on-surface-muted'
              }`}
            >
              {selectedLeague.flag} {selectedLeague.name}
            </button>
          </>
        )}

        {selectedTeam && (
          <>
            <span className="text-white/30">{isRTL ? '‹' : '›'}</span>
            <button
              type="button"
              onClick={() => goToPlayers(selectedTeam)}
              className={`hover:text-gold-bright transition-colors ${
                selectedTeam && !selectedPlayer ? 'text-gold-bright font-bold' : 'text-on-surface-muted'
              }`}
            >
              {selectedTeam}
            </button>
          </>
        )}

        {selectedPlayer && (
          <>
            <span className="text-white/30">{isRTL ? '‹' : '›'}</span>
            <span className="text-teal font-bold player-name-en">
              {selectedPlayer.name}
            </span>
          </>
        )}
      </div>

      {/* ─── Global Name Search Bar ─────────────────────────────── */}
      <div className="relative w-full">
        <div
          className="flex items-center rounded-md overflow-hidden"
          style={{
            background: '#0A0E1A',
            border: '1.5px solid rgba(212, 175, 55, 0.35)',
            minHeight: '48px',
          }}
        >
          <span className="px-3 text-gold-bright font-bold">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlayerPlaceholder')}
            className="w-full h-full py-2.5 bg-transparent font-body text-on-surface font-semibold outline-none"
            style={{ fontSize: '13px' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-3 text-on-surface-muted hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Search Instant Results Dropdown */}
        {searchQuery.trim() && (
          <div
            className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-lg overflow-hidden glass-panel-gold divide-y divide-white/10 shadow-2xl"
            style={{
              background: 'rgba(18, 24, 41, 0.98)',
              border: '1.5px solid rgba(212, 175, 55, 0.5)',
              maxHeight: '340px',
              overflowY: 'auto',
            }}
          >
            <div className="px-3 py-1.5 bg-black/40 text-on-surface-muted font-body text-xs font-semibold flex justify-between">
              <span>{t('searchResultsCount', searchResults.length)}</span>
              <span className="text-gold-bright">Top Matches</span>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-4 text-center font-body text-on-surface-muted text-xs">
                {t('noSearchResults')}
              </div>
            ) : (
              searchResults.map((p) => {
                const natFlag = NATIONALITY_FLAGS[p.nationality] || '🌍';
                return (
                  <div
                    key={p.id}
                    onClick={() => openPlayerCard(p)}
                    className="flex items-center justify-between p-2.5 hover:bg-gold/15 active:bg-gold/25 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* OVR Pill */}
                      <span
                        className="font-display font-bold text-gold-bright px-2 py-0.5 rounded text-center shrink-0"
                        style={{
                          background: 'rgba(212, 175, 55, 0.2)',
                          border: '1px solid rgba(212, 175, 55, 0.4)',
                          fontSize: '16px',
                          minWidth: '34px',
                        }}
                      >
                        {p.ovr}
                      </span>

                      {/* Position */}
                      <span
                        className="font-display font-bold text-white px-1.5 py-0.5 rounded text-xs shrink-0 bg-blue-700/80"
                      >
                        {p.specific_position}
                      </span>

                      {/* Name & Club */}
                      <div className="min-w-0">
                        <div className="player-name-en font-display font-bold text-on-surface text-sm uppercase leading-none truncate">
                          {p.name}
                        </div>
                        <div className="font-body text-on-surface-muted text-xs flex items-center gap-1.5 mt-0.5">
                          <span>{p.team}</span>
                          <span>•</span>
                          <span>{natFlag} {p.nationality}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-display font-bold text-teal text-sm">
                        ${p.value}M
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ─── LEVEL 4: Selected Player Big Luxury FUT Shield Card ─ */}
      {selectedPlayer && (
        <div
          className="glass-panel-gold p-4 rounded-xl flex flex-col items-center gap-4 relative animate-fade-in"
          style={{
            background: 'radial-gradient(circle at 50% 15%, rgba(26, 34, 56, 0.98) 0%, rgba(10, 14, 26, 0.98) 100%)',
            border: '1.5px solid rgba(212, 175, 55, 0.6)',
            boxShadow: '0 0 35px -5px rgba(212, 175, 55, 0.4)',
          }}
        >
          {/* Header Bar of Player Card Modal */}
          <div className="w-full flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <TeamCrest teamName={selectedPlayer.team} size="sm" />
              <div>
                <span className="font-body font-bold text-xs text-on-surface">
                  {selectedPlayer.team}
                </span>
                <span className="font-body text-xs text-on-surface-muted block" style={{ fontSize: '10px' }}>
                  {selectedPlayer.league}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPlayer(null)}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-on-surface font-body font-bold text-xs"
            >
              ✕ {t('close')}
            </button>
          </div>

          {/* Big Luxury FUT Shield Card (size="xl") */}
          <PlayerCard
            player={selectedPlayer}
            showValue={true}
            size="xl"
            className="my-1"
          />

          {/* Dossier Meta Grid (Nationality, Age, Specific Pos, Market Value) */}
          <div className="w-full grid grid-cols-2 gap-2 mt-1">
            <div className="glass-panel p-2.5 rounded flex flex-col">
              <span className="font-body text-on-surface-muted text-xs uppercase font-semibold">
                {t('nationality')}
              </span>
              <span className="font-body font-bold text-on-surface text-sm mt-0.5 flex items-center gap-1.5">
                <span>{NATIONALITY_FLAGS[selectedPlayer.nationality] || '🌍'}</span>
                <span>{selectedPlayer.nationality}</span>
              </span>
            </div>

            <div className="glass-panel p-2.5 rounded flex flex-col">
              <span className="font-body text-on-surface-muted text-xs uppercase font-semibold">
                {t('age')}
              </span>
              <span className="font-body font-bold text-on-surface text-sm mt-0.5">
                {t('ageYears', selectedPlayer.age)}
              </span>
            </div>

            <div className="glass-panel p-2.5 rounded flex flex-col">
              <span className="font-body text-on-surface-muted text-xs uppercase font-semibold">
                {t('position')}
              </span>
              <span className="font-display font-bold text-gold-bright text-base mt-0.5">
                {selectedPlayer.specific_position} ({selectedPlayer.line})
              </span>
            </div>

            <div className="glass-panel p-2.5 rounded flex flex-col">
              <span className="font-body text-on-surface-muted text-xs uppercase font-semibold">
                {t('marketValue')}
              </span>
              <span className="font-display font-bold text-teal text-base mt-0.5">
                ${selectedPlayer.value}M
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── LEVEL 3: Team Roster of 13 Players ─────────────────── */}
      {!selectedPlayer && selectedTeam && (
        <div className="flex flex-col gap-3">
          {/* Team Header Banner */}
          <div
            className="glass-panel-gold p-3.5 rounded-xl flex items-center justify-between"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(26, 34, 56, 0.95) 0%, rgba(10, 14, 26, 0.95) 100%)',
              borderColor: 'rgba(212, 175, 55, 0.4)',
            }}
          >
            <div className="flex items-center gap-3">
              <TeamCrest teamName={selectedTeam} size="md" />
              <div>
                <h3 className="font-display font-bold text-gold-bright text-xl uppercase leading-none">
                  {selectedTeam}
                </h3>
                <span className="font-body text-on-surface-muted text-xs mt-0.5 block">
                  {TEAMS_DATA[selectedTeam]?.stadium} • {selectedLeague?.name}
                </span>
              </div>
            </div>

            <span
              className="font-display font-bold text-teal px-2.5 py-1 rounded bg-teal/15 border border-teal/30"
              style={{ fontSize: '13px' }}
            >
              {t('playersCount', teamPlayers.length)}
            </span>
          </div>

          {/* Roster of 13 Gold Mini-Cards (Level 3 requirement) */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 justify-items-center">
            {teamPlayers.map((player) => (
              <div
                key={player.id}
                onClick={() => openPlayerCard(player)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <PlayerCard
                  player={player}
                  showValue={true}
                  size="sm"
                  className="transition-transform group-hover:scale-105 shadow-md"
                />
                <span
                  className="font-body font-bold text-on-surface-muted text-center mt-1 text-[10px] group-hover:text-gold-bright transition-colors truncate max-w-[72px]"
                >
                  {player.name.split(' ').slice(-1)[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── LEVEL 2: 7 Teams of Chosen League ──────────────────── */}
      {!selectedPlayer && !selectedTeam && selectedLeague && (
        <div className="flex flex-col gap-3">
          {/* League Header */}
          <div
            className="glass-panel p-3.5 rounded-xl flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${selectedLeague.color}40 0%, rgba(18, 24, 41, 0.9) 100%)`,
              border: `1.5px solid ${selectedLeague.accentColor}50`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl filter drop-shadow">{selectedLeague.flag}</span>
              <div>
                <h3 className="font-display font-bold text-white text-xl uppercase leading-none">
                  {selectedLeague.name}
                </h3>
                <span className="font-body text-on-surface-muted text-xs mt-0.5 block">
                  {t('chooseTeam')}
                </span>
              </div>
            </div>

            <span
              className="font-display font-bold text-gold-bright px-2 py-0.5 rounded bg-black/40 border border-gold/30 text-xs"
            >
              {t('teamsCount', selectedLeague.teams.length)}
            </span>
          </div>

          {/* 7 Teams Tiles with Monogram Crests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedLeague.teams.map((teamName) => {
              const meta = TEAMS_DATA[teamName] || {};
              return (
                <div
                  key={teamName}
                  onClick={() => goToPlayers(teamName)}
                  className="glass-panel p-3 rounded-lg flex items-center justify-between cursor-pointer hover:border-gold-bright transition-all group hover:scale-[1.01]"
                  style={{
                    background: 'rgba(18, 24, 41, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <TeamCrest teamName={teamName} size="md" />
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-on-surface text-lg leading-tight uppercase group-hover:text-gold-bright transition-colors truncate">
                        {teamName}
                      </h4>
                      <p className="font-body text-on-surface-muted text-xs truncate">
                        {meta.stadium}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-1.5">
                    <span className="font-body text-xs font-bold text-teal">
                      13 {t('posFWD')}/{t('posMID')}
                    </span>
                    <span className="text-on-surface-muted group-hover:text-gold-bright transition-colors">
                      {isRTL ? '‹' : '›'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── LEVEL 1: The 5 Major Leagues Glossy Tiles ──────────── */}
      {!selectedPlayer && !selectedTeam && !selectedLeague && (
        <div className="flex flex-col gap-3">
          <div className="px-1">
            <h3 className="font-body font-bold text-sm text-on-surface">
              {t('allLeagues')}
            </h3>
            <p className="font-body text-xs text-on-surface-muted mt-0.5">
              {t('chooseLeague')}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {LEAGUES_DATA.map((league) => (
              <div
                key={league.id}
                onClick={() => goToTeams(league)}
                className="relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] group shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${league.color}70 0%, rgba(18, 24, 41, 0.95) 100%)`,
                  border: `1.5px solid ${league.accentColor}50`,
                  boxShadow: `0 8px 24px -6px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.15)`,
                  minHeight: '84px',
                }}
              >
                {/* Diagonal Specular Sheen */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity"
                  style={{
                    backgroundImage: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
                    backgroundSize: '200% 100%',
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl filter drop-shadow">{league.flag}</span>
                    <div>
                      <h4 className="font-display font-bold text-white text-2xl uppercase tracking-wider leading-none group-hover:text-gold-bright transition-colors">
                        {league.name}
                      </h4>
                      <p className="font-body text-on-surface-muted text-xs mt-1">
                        {league.country} • {t('teamsCount', league.teamCount)} • {t('playersCount', league.playerCount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="font-display font-bold px-2.5 py-1 rounded-md text-xs uppercase"
                      style={{
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: league.accentColor,
                      }}
                    >
                      {league.country.toUpperCase()}
                    </span>
                    <span className="text-xl text-on-surface-muted group-hover:text-gold-bright transition-colors font-bold">
                      {isRTL ? '‹' : '›'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
