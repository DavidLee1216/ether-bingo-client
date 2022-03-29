import { combineReducers } from "redux";
import { BingoReducer } from "./bingo";
import { AuthReducer } from "./auth";

export default combineReducers({
  AuthReducer,
  BingoReducer,
  //   channelReducer: ChannelReducer,
});
