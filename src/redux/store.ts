import { configureStore } from "@reduxjs/toolkit";
import commentReducer from "./commentSlice";
import { saveState } from "../utils/localStorage";

const store = configureStore({
  reducer: {
    comments: commentReducer,
  },
});

store.subscribe(() => {
  saveState(store.getState().comments);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
