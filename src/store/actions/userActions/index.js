import * as UserActions from "./types";
import userService from "../../../services/user.service";
import axios from "axios";

export { UserActions };

export const CheckCoins = (amount) => ({
  type: UserActions.CHECK_COINS,
  amount: amount,
});

export const AddCoins = (amount) => ({
  type: UserActions.ADD_COINS,
  amount: amount,
});

export const ConsumeCoins = (amount) => ({
  type: UserActions.CONSUME_COINS,
  amount: amount,
});

export const buyCoins = (data) => {
  return userService.buyCoins(data);
};

export const getCoins = (username) => {
  return userService.getCoins(username);
};

export const getCredits = () => (dispatch) => {
  if (localStorage.user) {
    const user = JSON.parse(localStorage.user);
    let data = {
      username: user.username,
    };
    getCoins(data)
      .then((response) => {
        const amount = response.data.coin;
        dispatch(CheckCoins(amount));
      })
      .catch((error) => {});
  }
};
