import { IUserDetail, InitialUserDetail } from '@/types/user.type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user?: IUserDetail;
}

const initialState: UserState = {
  user: InitialUserDetail,
};

const userReducer = createSlice({
  name: 'userBrand',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUserDetail | undefined>) {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userReducer.actions;
export default userReducer.reducer;
