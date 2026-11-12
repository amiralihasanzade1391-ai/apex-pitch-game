import {
  createInitialGameState,
  placeBid,
  pass,
  advanceToNextCard,
  squadTotalSpent,
  squadTotalValue,
  isSquadFull,
  determineWinner,
} from '../src/game/engine.js';
import playersData from '../src/data/players.json' with { type: 'json' };

console.log('--- TESTING AUCTION ENGINE WITH 455 PLAYERS ---');

console.log('Total players in JSON:', playersData.length);
if (playersData.length !== 455) {
  throw new Error(`Expected 455 players, got ${playersData.length}`);
}

// 1. Create Initial State
let state = createInitialGameState('Player Gold', 'Player Teal');
console.log('Deck size in state:', state.deck.length);
console.log('Initial Card:', state.currentCard.name, `(${state.currentCard.line}, ${state.currentCard.specific_position}, ${state.currentCard.team})`);

if (state.deck.length !== 455) {
  throw new Error(`Deck should have 455 cards, got ${state.deck.length}`);
}

// 2. Simulate Bidding War on First Card
// Turn 0: Player Gold bids 10
state = placeBid(state, 0, 10);
console.log(`P0 bid 10. Current bid: ${state.currentBid}, Current bidder: ${state.currentBidder}, Next turn: ${state.auctionTurn}`);

// Turn 1: Player Teal bids 25
state = placeBid(state, 1, 25);
console.log(`P1 bid 25. Current bid: ${state.currentBid}, Current bidder: ${state.currentBidder}, Next turn: ${state.auctionTurn}`);

// Turn 0: Player Gold passes -> Player Teal must buy at 25
state = pass(state, 0);
console.log(`P0 passes. Sold stamp: ${state.soldStamp}, P1 budget: ${state.players[1].budget}`);
if (state.players[1].budget !== 225) {
  throw new Error(`Expected P1 budget 225, got ${state.players[1].budget}`);
}
if (state.soldStamp !== 'sold') {
  throw new Error(`Expected stamp 'sold', got ${state.soldStamp}`);
}

// Advance to Card 2
state = advanceToNextCard(state);
console.log('Next Card drawn:', state.currentCard.name, `(${state.currentCard.line})`);

// 3. Test Discard (P0 passes immediately with no bids)
state = pass(state, state.auctionTurn);
console.log(`Immediate pass -> Sold stamp: ${state.soldStamp}`);
if (state.soldStamp !== 'discarded') {
  throw new Error(`Expected stamp 'discarded', got ${state.soldStamp}`);
}

// 4. Simulate complete rapid game until game ends
let rounds = 0;
while (state.phase !== 'gameover' && rounds < 1000) {
  rounds++;
  const card = state.currentCard;
  if (!card) break;

  const currentTurn = state.auctionTurn;
  const otherTurn = currentTurn === 0 ? 1 : 0;

  // Let player bid 5 if they can, otherwise pass
  const p = state.players[currentTurn];
  try {
    state = placeBid(state, currentTurn, state.currentBid + 5);
    // Then other player passes
    state = pass(state, otherTurn);
  } catch (err) {
    // Can't bid, pass
    state = pass(state, currentTurn);
  }

  state = advanceToNextCard(state);
}

console.log(`Simulated game ended after ${rounds} rounds with phase: ${state.phase}`);
console.log('Result:', state.result);
console.log('P0 Squad size:', Object.values(state.players[0].squad).flat().length, 'Spent:', squadTotalSpent(state.players[0]), 'Value:', squadTotalValue(state.players[0]));
console.log('P1 Squad size:', Object.values(state.players[1].squad).flat().length, 'Spent:', squadTotalSpent(state.players[1]), 'Value:', squadTotalValue(state.players[1]));

console.log('--- ALL AUCTION ENGINE TESTS PASSED PERFECTLY! ---');
