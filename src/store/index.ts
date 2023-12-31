import * as DialogAlert from "./redux/DialogAlert";
import * as BlockUI from "./redux/BlockUI";
import {
  applyMiddleware,
  combineReducers,
  compose,
  legacy_createStore as createStore,
} from "redux";
import thunk from "redux-thunk";
interface ApplicationState {
  dialogReducer: DialogAlert.DialogState | undefined;
  blockuiReducer: BlockUI.BlockUIState | undefined;
}

const reducers = {
  dialogReducer: DialogAlert.DialogReducer,
  blockuiReducer: BlockUI.BlockUIReducer,
};

const initialState: ApplicationState = {
  dialogReducer: DialogAlert.DialogInitialState,
  blockuiReducer: BlockUI.BlockUIInitialState,
};

export default function configureStore() {
  const middleware = [thunk];

  const rootReducer = combineReducers({
    ...reducers,
  });

  const enhancers = [] as any;
  const windowIfDefined =
    typeof window === "undefined" ? null : (window as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
  }

  return createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware), ...enhancers)
  );
}
