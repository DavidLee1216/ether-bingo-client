import {
  CHECK_COINS,
  ADD_COINS,
  CONSUME_COINS,
} from "../actions/userActions/types";

const INITIAL_STATE = {
  userCoin: {
    amount: 0,
  },
};

export const UserInfoReducer = (states = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHECK_COINS:
      return {
        ...states,
        userCoin: {
          amount: action.amount,
        },
      };
    case ADD_COINS:
      return {
        ...states,
        userCoin: {
          amount: states.userCoin.amount + action.amount,
        },
      };
    case CONSUME_COINS:
      return {
        ...states,
        userCoin: {
          amount: states.userCoin.amount - action.amount,
        },
      };
    default:
      return states;
  }
};
