import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { RadioValue } from '@/components/CustomRadio/types';
import { ProductItem } from '@/features/product/types';
import { BrandAlphabet } from '@/features/user-group/types';
import { IWorkspace, InformationBooking } from '@/pages/LandingPage/types';
import store, { RootState } from '@/reducers';
import { AttributeContentType, AttributeSubForm } from '@/types';

import { WorkLocationData } from '@/features/team-profiles/components/LocationModal';

import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

export type ModalType =
  | 'none'

  // Landing page
  | 'About'
  | 'Policies'
  | 'Contact'
  | 'Browser Compatibility'
  | 'Designer Signup'
  | 'Brand Interested'
  | 'Tisc Login'
  | 'Login'
  | 'Calendar'
  | 'Cancel Booking'
  | 'Reset Password'
  | 'Verify Account'
  | 'Workspaces'

  // General
  | 'Assign Team'
  | 'Project Tracking Legend'
  | 'Access Level'
  | 'Work Location'
  | 'Share via email'

  // TISC
  | 'Product Attribute Type'
  | 'Select Brand'
  | 'Brand Company'

  // Brand
  | 'Actions Tasks'
  | 'Billed Services'

  // Design Firm
  | 'Assign Product'
  | 'Market Availability'
  | 'Inquiry Request'

  // Color AI
  | 'Color AI';

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
      onChange: (selected: CheckboxValue[]) => void;
      teams: any[];
      memberAssigned: any[];
    };

    productAttributeType: {
      contentType: AttributeContentType;
      selectedItem: any;
      onSubmit: (data: Omit<AttributeSubForm, 'id' | 'name'>) => void;
      type: number;
    };

    selectBrand: {
      brands: BrandAlphabet;
      checkedBrand?: RadioValue;
      onChecked: (checkedBrand: RadioValue) => void;
    };

    accessLevel: {
      type: 'brand' | 'designer' | 'tisc';
    };

    workLocation: {
      data: WorkLocationData;
      onChange: (data: WorkLocationData) => void;
    };

    shareViaEmail: {
      product: ProductItem;
      isCustomProduct?: boolean;
    };
    informationBooking: InformationBooking;
    reScheduleBooking: boolean;

    workspaces: IWorkspace[];
  };
}

const initialState: ModalState = {
  type: 'none',
  theme: 'default',
  props: {} as ModalState['props'],
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
