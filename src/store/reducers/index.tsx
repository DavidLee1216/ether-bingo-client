import { combineReducers } from "redux";
import { BingoReducer } from "./bingo";
import { AuthReducer } from "./auth";
import { UserInfoReducer } from "./user";
import { WonReducer } from "./room";

export const rootReducer = combineReducers({
  AuthReducer,
  BingoReducer,
  UserInfoReducer,
  WonReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
