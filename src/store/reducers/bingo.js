import { BingoActionTypes } from "../actions/bingoActions";

const BINGO_INITIAL_STATE = {
  room: 0,
  game_price: 0,
  total_card_count: 0,
  called_numbers: [],
  last_number: 0,
  winners: [],
  winner_earning: 0,
};

export const BingoReducer = (states = BINGO_INITIAL_STATE, action) => {
  switch (action.type) {
    case BingoActionTypes.SET_ROOM:
      return {
        ...states,
        room: action.room,
      };
    case BingoActionTypes.SET_GAME_PRICE:
      return {
        ...states,
        game_price: action.game_price,
      };
    case BingoActionTypes.SET_TOTAL_CARDS_COUNT:
      return {
        ...states,
        total_card_count: action.total_card_count,
      };
    case BingoActionTypes.SET_CALLED_NUMBERS:
      return {
        ...states,
        called_numbers: action.called_numbers,
      };
    case BingoActionTypes.SET_LAST_NUMBER:
      return {
        ...states,
        last_number: action.last_number,
      };
    case BingoActionTypes.SET_WINNERS:
      return {
        ...states,
        winners: action.winners,
      };
    case BingoActionTypes.SET_WINNER_EARNING:
      return {
        ...states,
        winner_earning: action.winner_earning,
      };
    default:
      return states;
  }
};
