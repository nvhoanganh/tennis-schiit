import { rootReducer } from "./reducers/rootReducer";
import { createStore, compose, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

const loggerMiddleware = createLogger();

export function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(thunkMiddleware),
      (<any>window).__REDUX_DEVTOOLS_EXTENSION__
        ? (<any>window).__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
    )
  );
  return store;
}
