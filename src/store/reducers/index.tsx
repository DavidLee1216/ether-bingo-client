import { combineReducers } from "redux";
import { BingoReducer } from "./bingo";
import { AuthReducer } from "./auth";
import { UserInfoReducer } from "./user";

export const rootReducer = combineReducers({
  AuthReducer,
  BingoReducer,
  UserInfoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
