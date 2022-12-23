import store, { RootState } from '@/reducers';

import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

export type ModalType =
  | 'none'
  | 'About'
  | 'Policies'
  | 'Contact'
  | 'Browser Compatibility'
  | 'Designer Signup'
  | 'Brand Interested'
  | 'Tisc Login'
  | 'Login';

export interface ModalState {
  type: ModalType;
  theme?: 'default' | 'dark';
  props?: {};
}

const initialState: ModalState = {
  type: 'none',
  theme: 'default',
  props: {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalState>) => {
      return action.payload;
    },
    closeModalAction: () => {
      return initialState;
    },
  },
});

export const { openModal, closeModalAction } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;

export const closeModal = () => store.dispatch(closeModalAction());

const modalSeletor = (state: RootState) => state.modal;

export const modalThemeSelector = createSelector(modalSeletor, ({ theme }) => {
  const darkTheme = theme === 'dark';
  const themeStyle = darkTheme ? '-dark' : '';
  return {
    theme,
    darkTheme,
    themeStyle,
  };
});
