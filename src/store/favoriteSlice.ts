import { User } from '@/lib/types/github';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface FavoriteState {
    favorites: Array<User>
  }

const initialState: FavoriteState = {
    favorites: []
}

export const favoriteSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<User>) => {
            const user = action.payload;
            state.favorites.push(user);
        },
        removeFavorite: (state, action: PayloadAction<User>) => {
            const user = action.payload;
            const users = state.favorites.filter((fav) => fav.id !== user.id);
            state.favorites = users;
        }
    },
});
  
  // actions
  export const {addFavorite, removeFavorite} = favoriteSlice.actions 
  
  // selectors
  export const selectFavorites = (state: RootState) => state.favorites.favorites
  
  export default favoriteSlice.reducer