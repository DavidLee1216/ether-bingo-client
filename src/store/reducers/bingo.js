import { BingoActionTypes } from "../actions/bingoActions";

const BINGO_INITIAL_STATE = {
  bingo: {
    credits: 0,
  },
};

export const BingoReducer = (states = BINGO_INITIAL_STATE, action) => {
  switch (action.type) {
    case BingoActionTypes.CHECK_CREDIT:
      return {
        ...states,
        bingo: {
          credits: action.credits,
        },
      };
    default:
      return states;
  }
};
