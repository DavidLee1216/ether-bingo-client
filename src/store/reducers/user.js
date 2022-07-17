import {
  CHECK_COINS,
  ADD_COINS,
  CONSUME_COINS,
  SHOW_LOGIN_BOX,
  HIDE_LOGIN_BOX,
} from "../actions/userActions/types";

const INITIAL_STATE = {
  userCoin: {
    amount: 0,
  },
  showLoginBox: false,
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
    case SHOW_LOGIN_BOX:
      return {
        ...states,
        showLoginBox: true,
      };
    case HIDE_LOGIN_BOX:
      return {
        ...states,
        showLoginBox: false,
      };
    default:
      return states;
  }
};
