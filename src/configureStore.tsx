import { Dispatch, Action, AnyAction } from 'redux';
import { Store, applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';

import example, { ExampleState } from './reducers/example';

export type ConnectedReduxProps<A extends Action = AnyAction> = {
  dispatch: Dispatch<A>;
};

export type ApplicationState = {
  example: ExampleState;
};

const createRootReducer = () => {
  return combineReducers<ApplicationState>({ example });
};

const configureStore = (
  preloadedState?: ApplicationState,
): Store<ApplicationState> => {
  let middleware = applyMiddleware(createLogger());
  if (process.env.NODE_ENV !== 'production') {
    const composeEnhancers = composeWithDevTools({});
    middleware = composeEnhancers(middleware);
  }

  return createStore(createRootReducer(), preloadedState, middleware);
};

export default configureStore;
