import { CheckboxValue } from '@/components/CustomCheckbox/types';
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
  | 'Market Availability'
  | 'Calendar'
  | 'Cancel Booking'
  | 'Reset Password'
  | 'Verify Account'
  | 'Assign Team'
  | 'Project Tracking Legend';

export interface ModalState {
  type: ModalType;
  theme?: 'default' | 'dark';
  title?: string;
  autoHeightDrawer?: boolean;
  noBorderDrawerHeader?: boolean;
  props: {
    productId?: string; // Assign Product
    isCustomProduct?: boolean; // Assign Product

    email?: string; // Reset Password
    token?: string; // Reset Password
    passwordType?: 'reset' | 'create'; // Reset Password

    assignTeam: {
      onChange?: (selected: CheckboxValue[]) => void;
      teams?: any[];
      memberAssigned?: any[];
    };
  };
}

const initialState: ModalState = {
  type: 'none',
  theme: 'default',
  props: {
    assignTeam: {},
  },
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      _state,
      action: PayloadAction<Omit<ModalState, 'props'> & { props?: Partial<ModalState['props']> }>,
    ) => {
      return { ...action.payload, props: { ...initialState.props, ...action.payload.props } };
    },
    closeModalAction: (state) => {
      state.type = 'none';
    },
    resetModalState: () => initialState,
  },
});

export const { openModal, closeModalAction } = modalSlice.actions;

export const modalReducer = modalSlice.reducer;

export const closeModal = () => {
  store.dispatch(closeModalAction());
  setTimeout(() => store.dispatch(modalSlice.actions.resetModalState()), 300);
};

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
