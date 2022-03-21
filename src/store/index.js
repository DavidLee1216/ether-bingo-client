import { createStore, combineReducers } from "redux";
import reducers from "./reducers";

export default function Store() {
  return createStore(
    combineReducers({
      ...reducers,
    }),
    {}
  );
}
