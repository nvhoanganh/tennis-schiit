import { rootReducer } from "./reducers";
import { createStore, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

const loggerMiddleware = createLogger();

export function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware, loggerMiddleware),
      (<any>window).devToolsExtension ? (<any>window).devToolsExtension() : f => f
    )
  );
  return store;
}
