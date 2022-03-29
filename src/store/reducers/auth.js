import {
  SET_AUTH_USER,
  AUTH_NO_LOGIN,
  AUTH_LOGIN,
  AUTH_LOGIN_NO_EMAIL_CONFIRM,
  LOGOUT,
} from "../actions/authActions/types";

const INITIAL_STATE = {
  authUser: {
    user: null,
    authState: AUTH_NO_LOGIN,
  },
};

export const AuthReducer = (states = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_AUTH_USER:
      return {
        ...states,
        authUser: {
          user: action.user,
          authState: action.authState,
        },
      };
    case LOGOUT:
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return INITIAL_STATE;

    default:
      if (localStorage.user) {
        return {
          ...states,
          authUser: {
            user: JSON.parse(localStorage.user),
            authState: AUTH_LOGIN,
          },
        };
      }
      return states;
  }
};
