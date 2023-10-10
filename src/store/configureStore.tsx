import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice";
import * as DialogAlert from "./redux/DialogAlert";
import {
  combineReducers,
} from "redux";

const rootReducer = combineReducers({
  counter: counterReducer,
  dialogReducer: DialogAlert.DialogReducer,
});

export const store = configureStore({
  reducer: {
    rootReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
