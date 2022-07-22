import { UserDetail } from '@/types/user.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user?: UserDetail;
}

const initialState: UserState = {};

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<UserDetail | undefined>) {
      state.user = action.payload;
    },
  },
});

export const { setUserProfile } = userReducer.actions;
export default userReducer.reducer;
