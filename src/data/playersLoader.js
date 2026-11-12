// Lazy player database loader for fast first-paint performance

let _players = null;
let _loadPromise = null;

export async function getPlayers() {
  if (_players) return _players;
  if (!_loadPromise) {
    _loadPromise = import('./players.json').then((module) => {
      _players = module.default;
      return _players;
    });
  }
  return _loadPromise;
}

export function getPlayersSync() {
  return _players;
}

// Background preload on idle
if (typeof window !== 'undefined') {
  const schedulePreload = window.requestIdleCallback || ((cb) => setTimeout(cb, 1000));
  schedulePreload(() => {
    getPlayers().catch((err) => console.warn('Failed background player preload:', err));
  });
}
