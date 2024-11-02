import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import { GeneralInquirySummaryData } from '@/pages/Brand/GeneralInquiries/types';
import type { FinancialRecords } from '@/types';

import { UnitItem } from '@/components/Modal/UnitType';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SummaryState {
  summaryProjectTracking: DataMenuSummaryProps[];
  summaryGeneralInquiry: GeneralInquirySummaryData;
  summaryFinancialRecords: FinancialRecords;
  currencySelected: string;
  unitType: UnitItem[];
}

const initialState: SummaryState = {
  summaryProjectTracking: [],
  summaryGeneralInquiry: {
    inquires: 0,
    pending: 0,
    responded: 0,
  },
  summaryFinancialRecords: {
    currencies: [],
    exchange_history: {
      created_at: '',
      from_currency: '',
      id: '',
      rate: 0,
      relation_id: '',
      to_currency: '',
      updated_at: '',
    },
    total_product: 0,
    total_stock: 0,
  },
  currencySelected: '',
  unitType: [],
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
    setSummaryFinancialRecords(state, action: PayloadAction<FinancialRecords>) {
      state.summaryFinancialRecords = action.payload;
    },
    setCurrencySelected(state, action: PayloadAction<string>) {
      state.currencySelected = action.payload;
    },
    setUnitType(state, action: PayloadAction<UnitItem[]>) {
      state.unitType = action.payload;
    },
  },
});

export const {
  setSummaryGeneralInquiry,
  setSummaryProjectTracking,
  setSummaryFinancialRecords,
  setCurrencySelected,
  setUnitType,
} = summaryReducer.actions;
export default summaryReducer.reducer;
