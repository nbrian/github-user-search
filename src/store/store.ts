import { configureStore } from "@reduxjs/toolkit";
import favoriteReducer from './favoriteSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
    reducer: {
        favorites: favoriteReducer,
        theme: themeReducer
    }
});

// create types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;