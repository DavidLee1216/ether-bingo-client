import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";
import thunk from "redux-thunk";
import {
  // devToolsEnhancer,
  composeWithDevTools,
} from "redux-devtools-extension";
const middleware = [thunk];

const composeEnhancers = composeWithDevTools({
  // Specify custom devTools options
});

export default function Store() {
  return createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middleware))
  );
}
