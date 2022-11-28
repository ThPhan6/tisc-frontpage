import { ServicesForm } from './type';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ServicesState {
  service: ServicesForm;
}

const initialState: ServicesState = {
  service: {
    service_type_id: '',
    brand_id: '',
    brand_name: '',
    ordered_by: '',
    unit_rate: 0,
    quantity: 0,
    tax: 0,
    remark: '',
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
  },
});

export const { setServiceFormData, resetServiceFormData } = servicesReducer.actions;
export default servicesReducer.reducer;
