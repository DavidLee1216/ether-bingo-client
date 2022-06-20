import { combineReducers } from "redux";
import { BingoReducer } from "./bingo";
import { AuthReducer } from "./auth";
import { UserInfoReducer } from "./user";
import { WonReducer } from "./room";

export default combineReducers({
  AuthReducer,
  BingoReducer,
  UserInfoReducer,
  WonReducer,
});
