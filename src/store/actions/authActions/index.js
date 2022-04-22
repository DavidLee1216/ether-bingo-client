import * as authTypes from "./types";
import AuthService from "../../../services/auth.service";
import axios from "axios";

export { authTypes };

export const setAuthState = (user, authState) => ({
  type: authTypes.SET_AUTH_USER,
  user: user,
  authState: authState,
});

export const logOut = () => ({
  type: authTypes.LOGOUT,
});

export const register = (data) => (dispatch) => {
  return AuthService.register(data).then(
    (response) => {
      const user = response.data;
      dispatch(setAuthState(user, authTypes.AUTH_LOGIN_NO_EMAIL_CONFIRM));
      return Promise.resolve();
    },
    (error) => {
      return Promise.reject();
    }
  );
};

export const login = (data) => (dispatch) => {
  return AuthService.login(data).then(
    (response) => {
      recordLoginInfo(response, dispatch);
      return Promise.resolve();
    },
    (error) => {
      return Promise.reject();
    }
  );
};

export const authorize = (data) => (dispatch) => {
  return AuthService.auth(data).then(
    (response) => {
      recordLoginInfo(response, dispatch);
      return Promise.resolve();
    },
    (error) => {
      return Promise.reject();
    }
  );
};

export const logout = () => (dispatch) => {
  return AuthService.logout().then((response) => {
    dispatch(logOut());
  });
};

export const recordLoginInfo = (response, dispatch) => {
  const user = response.data.user;
  const accessToken = response.data.token.access;
  const refreshToken = response.data.token.refresh;
  const backUserInfo = {
    id: user.id,
    email: user.email,
    username: user.username,
    wallet_adress: user.wallet_adress,
    first_name: user.first_name,
    last_name: user.last_name,
  };
  localStorage.setItem("token", refreshToken);
  localStorage.setItem("user", JSON.stringify(backUserInfo));
  axios.defaults.headers["Authorization"] = "JWT " + accessToken;
  dispatch(setAuthState(backUserInfo, authTypes.AUTH_LOGIN));
};

export const jwtSetUserState = () => (dispatch) => {
  const userInfo = JSON.parse(localStorage.user);
  dispatch(setAuthState(userInfo, authTypes.AUTH_LOGIN));
};
