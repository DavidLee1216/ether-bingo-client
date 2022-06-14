import * as BingoActionTypes from "./types";

export const setRoom = (room) => ({
  type: BingoActionTypes.SET_ROOM,
  room: room,
});

export const setGamePrice = (price) => ({
  type: BingoActionTypes.SET_GAME_PRICE,
  game_price: price,
});

export const setTotalCardsCount = (count) => ({
  type: BingoActionTypes.SET_TOTAL_CARDS_COUNT,
  total_card_count: count,
});

export const setCalledNumbers = (calledNumbers) => ({
  type: BingoActionTypes.SET_CALLED_NUMBERS,
  called_numbers: calledNumbers,
});

export const setLastNumber = (lastNumber) => ({
  type: BingoActionTypes.SET_LAST_NUMBER,
  last_number: lastNumber,
});

export const setWinners = (winners) => ({
  type: BingoActionTypes.SET_WINNERS,
  winners: winners,
});

export const setWinnerEarning = (earning) => ({
  type: BingoActionTypes.SET_WINNER_EARNING,
  winner_earning: earning,
});

export { BingoActionTypes };
