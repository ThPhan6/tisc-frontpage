import { ActionTaskModalParams } from '@/components/ActionTask/types';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ActionTaskProps extends ActionTaskModalParams {
  reloadActionTaskTable: boolean;
  modalVisible: boolean;
}

const initialState: ActionTaskProps = {
  model_id: '',
  model_name: 'none',
  reloadActionTaskTable: false,
  modalVisible: false,
};

const actionTaskSlice = createSlice({
  name: 'actionTasks',
  initialState,
  reducers: {
    setActionTaskModalId(state, action: PayloadAction<string>) {
      state.model_id = action.payload;
    },
    setActionTaskModalName(state, action: PayloadAction<ActionTaskModalParams['model_name']>) {
      state.model_name = action.payload;
    },
    /// set reload table to get data after chosen actions/tasks
    setReloadActionTaskTable(state, action: PayloadAction<boolean>) {
      state.reloadActionTaskTable = action.payload;
    },
    /// set reload table to get data after modal is closed
    setActionTaskModalVisible(state, action: PayloadAction<boolean>) {
      state.modalVisible = action.payload;
    },
  },
});

export const {
  setActionTaskModalId,
  setActionTaskModalName,
  setReloadActionTaskTable,
  setActionTaskModalVisible,
} = actionTaskSlice.actions;

export const actionTaskReducer = actionTaskSlice.reducer;
