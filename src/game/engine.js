import { getPlayersSync } from '../data/playersLoader';

// ─── Constants ────────────────────────────────────────────────
export const INITIAL_BUDGET = 250; // million $
export const FORMATION = { GK: 1, DEF: 4, MID: 3, FWD: 3 };
export const TOTAL_PLAYERS = 11;
export const LINE_ORDER = ['GK', 'DEF', 'MID', 'FWD'];

// ─── Helpers ──────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createDeck(customPlayers = null) {
  const players = customPlayers || getPlayersSync() || [];
  return shuffleArray(players);
}

export function createPlayerState(name) {
  return {
    name,
    budget: INITIAL_BUDGET,
    squad: { GK: [], DEF: [], MID: [], FWD: [] }, // array of { player, pricePaid }
  };
}

/** Returns how many free slots player has in a given line */
export function freeSlotsInLine(playerState, line) {
  const capacity = FORMATION[line] ?? 0;
  const filled = (playerState.squad[line] || []).length;
  return capacity - filled;
}

/** Returns true if the player has at least one free slot in `line` */
export function canBidForLine(playerState, line) {
  return freeSlotsInLine(playerState, line) > 0;
}

/** Returns true if squad is full (all 11 slots filled) */
export function isSquadFull(playerState) {
  return LINE_ORDER.every(
    (line) => (playerState.squad[line] || []).length >= FORMATION[line]
  );
}

/** Deduct price, add player to squad */
export function buyPlayer(playerState, player, pricePaid) {
  return {
    ...playerState,
    budget: playerState.budget - pricePaid,
    squad: {
      ...playerState.squad,
      [player.line]: [
        ...(playerState.squad[player.line] || []),
        { player, pricePaid },
      ],
    },
  };
}

/** Sum of all pricePaid in a squad */
export function squadTotalSpent(playerState) {
  return LINE_ORDER.reduce((sum, line) => {
    return sum + (playerState.squad[line] || []).reduce((s, e) => s + e.pricePaid, 0);
  }, 0);
}

/** Sum of all player value fields in a squad */
export function squadTotalValue(playerState) {
  return LINE_ORDER.reduce((sum, line) => {
    return sum + (playerState.squad[line] || []).reduce((s, e) => s + e.player.value, 0);
  }, 0);
}

/** All entries flattened */
export function squadEntries(playerState) {
  return LINE_ORDER.flatMap((line) => playerState.squad[line] || []);
}

/** Best bargain: biggest (value - pricePaid) where value > pricePaid */
export function bestBargain(playerState) {
  const entries = squadEntries(playerState);
  if (!entries.length) return null;
  const bargains = entries.filter((e) => e.player.value > e.pricePaid);
  if (!bargains.length) return null;
  return bargains.reduce((best, e) => {
    const diff = e.player.value - e.pricePaid;
    return diff > (best.player.value - best.pricePaid) ? e : best;
  });
}

/** Biggest overpay: biggest (pricePaid - value) */
export function biggestOverpay(playerState) {
  const entries = squadEntries(playerState);
  if (!entries.length) return null;
  const overpays = entries.filter((e) => e.pricePaid > e.player.value);
  if (!overpays.length) return null;
  return overpays.reduce((worst, e) => {
    return e.pricePaid - e.player.value > worst.pricePaid - worst.player.value ? e : worst;
  });
}

/**
 * Determine winner.
 * Returns { winner: 0|1|'tie', reason: 'value'|'budget' }
 * 0 = player1, 1 = player2
 */
export function determineWinner(p1, p2) {
  const v1 = squadTotalValue(p1);
  const v2 = squadTotalValue(p2);
  if (v1 > v2) return { winner: 0, reason: 'value' };
  if (v2 > v1) return { winner: 1, reason: 'value' };
  // Tie on value → more budget left wins
  if (p1.budget > p2.budget) return { winner: 0, reason: 'budget' };
  if (p2.budget > p1.budget) return { winner: 1, reason: 'budget' };
  return { winner: 'tie', reason: 'budget' };
}

/** Create the initial full game state */
export function createInitialGameState(player1Name, player2Name, customPlayers = null) {
  const deck = createDeck(customPlayers);
  return {
    // Players
    players: [
      createPlayerState(player1Name || 'بازیکن ۱'),
      createPlayerState(player2Name || 'بازیکن ۲'),
    ],

    // Deck
    deck,
    deckIndex: 0,

    // Current auction
    currentCard: deck[0] || null,
    currentBid: 0,
    currentBidder: null,  // index 0 or 1 — who placed the last bid
    auctionTurn: 0,       // index 0 or 1 — whose turn it is to act

    // Phase: 'setup' | 'auction' | 'gameover'
    phase: 'auction',

    // Bid log entries
    bidLog: [],

    // Result (populated when phase === 'gameover')
    result: null,

    // UI state helpers
    soldStamp: null,     // null | 'sold' | 'discarded'
  };
}

/** Place a bid. Returns new state or throws string error key. */
export function placeBid(state, playerIndex, amount) {
  const player = state.players[playerIndex];
  const card = state.currentCard;

  if (!card) throw 'noCard';
  if (!canBidForLine(player, card.line)) throw 'noSlot';
  if (amount <= state.currentBid) throw 'bidTooLow';
  if (amount > player.budget) throw 'bidTooHigh';

  const entry = {
    type: 'bid',
    playerIndex,
    playerName: player.name,
    amount,
    cardName: card.name,
  };

  return {
    ...state,
    currentBid: amount,
    currentBidder: playerIndex,
    auctionTurn: playerIndex === 0 ? 1 : 0,
    bidLog: [entry, ...state.bidLog],
  };
}

/** Pass. If currentBidder exists → they must buy. If nobody bid → discard. */
export function pass(state, playerIndex) {
  const card = state.currentCard;
  if (!card) return advanceToNextCard(state, false);

  const passEntry = {
    type: 'pass',
    playerIndex,
    playerName: state.players[playerIndex].name,
    cardName: card.name,
  };

  if (state.currentBidder === null) {
    // Nobody bid → discard card
    const discardEntry = {
      type: 'discard',
      cardName: card.name,
    };
    const newState = {
      ...state,
      bidLog: [discardEntry, passEntry, ...state.bidLog],
      soldStamp: 'discarded',
    };
    return newState;
  }

  // Last bidder must buy
  const buyerIndex = state.currentBidder;
  const buyer = state.players[buyerIndex];
  const pricePaid = state.currentBid;

  const updatedBuyer = buyPlayer(buyer, card, pricePaid);
  const newPlayers = state.players.map((p, i) =>
    i === buyerIndex ? updatedBuyer : p
  );

  const buyEntry = {
    type: 'buy',
    playerIndex: buyerIndex,
    playerName: buyer.name,
    cardName: card.name,
    amount: pricePaid,
  };

  return {
    ...state,
    players: newPlayers,
    bidLog: [buyEntry, passEntry, ...state.bidLog],
    soldStamp: 'sold',
  };
}

/** After stamp animation, advance to the next card or end game */
export function advanceToNextCard(state) {
  const nextIndex = state.deckIndex + 1;
  const nextCard = state.deck[nextIndex] ?? null;

  const bothFull =
    isSquadFull(state.players[0]) && isSquadFull(state.players[1]);

  if (!nextCard || bothFull) {
    // Game over
    const result = determineWinner(state.players[0], state.players[1]);
    return {
      ...state,
      currentCard: null,
      deckIndex: nextIndex,
      currentBid: 0,
      currentBidder: null,
      auctionTurn: 0,
      soldStamp: null,
      phase: 'gameover',
      result,
    };
  }

  // Determine who starts bidding the next card:
  // If last bidder won → opponent starts next
  // If discarded → alternate from who just passed
  const nextTurn =
    state.currentBidder !== null
      ? (state.currentBidder === 0 ? 1 : 0)
      : (state.auctionTurn === 0 ? 1 : 0);

  return {
    ...state,
    currentCard: nextCard,
    deckIndex: nextIndex,
    currentBid: 0,
    currentBidder: null,
    auctionTurn: nextTurn,
    soldStamp: null,
  };
}
