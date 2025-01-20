import { CommonPartnerType } from '@/pages/Brand/Adminstration/Partners';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface PartnerState {
  association: CommonPartnerType | null;
}

const initialState: PartnerState = {
  association: null,
};

const partnerReducer = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    setAssociation(state, action: PayloadAction<CommonPartnerType | null>) {
      state.association = action.payload;
    },
  },
});

export const { setAssociation } = partnerReducer.actions;
export default partnerReducer.reducer;
