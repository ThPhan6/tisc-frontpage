import { CommonPartnerType } from '@/pages/Brand/Adminstration/Partners/PartnersTable';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface PartnerState {
  association: CommonPartnerType | null;
  companiesPage: number;
  contactsPage: number;
}

const initialState: PartnerState = {
  association: null,
  companiesPage: 1,
  contactsPage: 1,
};

const partnerReducer = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    setAssociation(state, action: PayloadAction<CommonPartnerType | null>) {
      state.association = action.payload;
    },
    setCompaniesPage(state, action: PayloadAction<number>) {
      state.companiesPage = action.payload;
    },
    setContactsPage(state, action: PayloadAction<number>) {
      state.contactsPage = action.payload;
    },
  },
});

export const { setAssociation, setCompaniesPage, setContactsPage } = partnerReducer.actions;
export default partnerReducer.reducer;
