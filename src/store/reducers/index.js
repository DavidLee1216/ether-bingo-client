import { combineReducers } from "redux";
import { BingoReducer } from "./bingo";
import { AuthReducer } from "./auth";
import { UserInfoReducer } from "./user";

export default combineReducers({
  AuthReducer,
  BingoReducer,
  UserInfoReducer,
});
