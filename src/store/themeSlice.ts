import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

type Theme = 'dark' | 'light';

type ThemeState = {
    theme: Theme
}

const initialState: ThemeState = {
    theme: 'light'
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
        },
        toggleTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload === 'dark' ? 'light' : 'dark';
        },
    },
});
  
  // actions
  export const { setTheme, toggleTheme } = themeSlice.actions 
  
  // selectors
  export const selectedTheme = (state: RootState) => state.theme;
  
  export default themeSlice.reducer