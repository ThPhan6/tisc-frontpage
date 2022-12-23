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
  | 'Login'
  | 'Assign Product'
  | 'Market Availability';

export interface ModalState {
  type: ModalType;
  theme?: 'default' | 'dark';
  title?: string;
  autoHeightDrawer?: boolean;
  noBorderDrawerHeader?: boolean;
  props: {
    productId?: string; // assignProduct
    isCustomProduct?: boolean; // assignProduct
  };
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
    openModal: (
      _state,
      action: PayloadAction<Omit<ModalState, 'props'> & { props?: ModalState['props'] }>,
    ) => {
      return { ...action.payload, props: action.payload.props || {} };
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

export const modalPropsSelector = createSelector(modalSeletor, ({ props = {} }) => {
  return props as Required<ModalState['props']>;
});
