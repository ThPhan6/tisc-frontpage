import { RootState } from '.';

import { createSelector, createSlice } from '@reduxjs/toolkit';

export interface LandingPageState {
  props: {
    captcha: string;
    setRefreshReCaptcha: () => void;
  };
}

const initialState: LandingPageState = {
  props: {} as LandingPageState['props'],
};

const landingPageSlice = createSlice({
  name: 'landingPage',
  initialState,
  reducers: {
    updateCaptchaProps: (state, action: { payload: Partial<LandingPageState['props']> }) => {
      state.props = {
        ...state.props,
        ...action.payload,
      };
    },
  },
});

export const { updateCaptchaProps } = landingPageSlice.actions;
export const landingPageReducer = landingPageSlice.reducer;

const landingPageSelector = (state: RootState) => state.landingPage;

export const landingPagePropsSelector = createSelector(landingPageSelector, ({ props = {} }) => {
  return props as Required<LandingPageState['props']>;
});
