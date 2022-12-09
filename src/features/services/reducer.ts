import { ServicesForm, SummaryService } from './type';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ServicesState {
  service: ServicesForm;
  summaryServices: SummaryService;
}

const initialState: ServicesState = {
  service: {
    service_type_id: '',
    brand_id: '',
    brand_name: '',
    ordered_by: '',
    unit_rate: '',
    quantity: '',
    tax: '',
    remark: '',
  },
  summaryServices: {
    grandTotal: 0,
    offline_marketing_sale: 0,
    online_marketing_sale: 0,
    product_card_conversion: 0,
    others: 0,
  },
};

const servicesReducer = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setServiceFormData(state, action: PayloadAction<ServicesForm>) {
      state.service = action.payload;
    },
    resetServiceFormData() {
      return initialState;
    },
    setSummaryServices(state, action: PayloadAction<SummaryService>) {
      state.summaryServices = action.payload;
    },
  },
});

export const { setServiceFormData, resetServiceFormData, setSummaryServices } =
  servicesReducer.actions;
export default servicesReducer.reducer;
