import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import { GeneralInquirySummaryData } from '@/pages/Brand/GeneralInquiries/types';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SummaryState {
  summaryProjectTracking: DataMenuSummaryProps[];
  summaryGeneralInquiry: GeneralInquirySummaryData;
}

const initialState: SummaryState = {
  summaryProjectTracking: [],
  summaryGeneralInquiry: {
    inquires: 0,
    pending: 0,
    responded: 0,
  },
};

const summaryReducer = createSlice({
  name: 'summary',
  initialState,
  reducers: {
    setSummaryProjectTracking(state, action: PayloadAction<DataMenuSummaryProps[]>) {
      state.summaryProjectTracking = action.payload;
    },
    setSummaryGeneralInquiry(state, action: PayloadAction<GeneralInquirySummaryData>) {
      state.summaryGeneralInquiry = action.payload;
    },
  },
});

export const { setSummaryGeneralInquiry, setSummaryProjectTracking } = summaryReducer.actions;
export default summaryReducer.reducer;
