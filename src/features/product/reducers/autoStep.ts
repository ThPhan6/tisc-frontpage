import { isUndefined } from 'lodash';

import { AutoStepLinkedOptionResponse, LinkedOptionProps } from '../types/autoStep';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface LinkedOptionDataProps {
  pickedData: LinkedOptionProps[];
  linkedData: AutoStepLinkedOptionResponse[];
}

export interface PickedOptionIdProps {
  pickedIds: string[];
  linkedIds: { [key: string]: string[] };
}

interface AutoStepProps {
  optionDatasetName: string;

  pickedOptionIds: PickedOptionIdProps[];

  linkedOptionData: LinkedOptionDataProps[];

  slide?: number;

  slideBar: string[];
}

const initialState: AutoStepProps = {
  optionDatasetName: '',

  slideBar: ['', ''],

  pickedOptionIds: [],

  linkedOptionData: [],
};

const autoStepSlice = createSlice({
  name: 'autoStep',
  initialState,
  reducers: {
    setOptionDatasetName(state, action: PayloadAction<string>) {
      state.optionDatasetName = action.payload;
    },

    setSlideBar(state, action: PayloadAction<string[]>) {
      state.slideBar = action.payload;
    },

    setSlide(state, action: PayloadAction<number>) {
      state.slide = action.payload;
    },

    setPickedOptionId(
      state,
      action: PayloadAction<
        | {
            index: number;
            pickedIds: string[];
            linkedIds: { [key: string]: string[] };
          }
        | PickedOptionIdProps[]
      >,
    ) {
      if (isUndefined((action.payload as any)?.index)) {
        state.pickedOptionIds = action.payload as PickedOptionIdProps[];
      } else {
        const {
          index = 0,
          pickedIds = [],
          linkedIds = {},
        } = action.payload as {
          index: number;
          pickedIds: string[];
          linkedIds: { [key: string]: string[] };
        };

        const newPickedOptionId = [...state.pickedOptionIds];

        const newLinkedIds = {
          ...newPickedOptionId?.[index]?.linkedIds,
          ...linkedIds,
        };

        newPickedOptionId[index] = { pickedIds, linkedIds: newLinkedIds };

        state.pickedOptionIds = newPickedOptionId;
      }
    },

    setLinkedOptionData(
      state,
      action: PayloadAction<
        | {
            index: number;
            pickedData: LinkedOptionProps[];
            linkedData: AutoStepLinkedOptionResponse[];
          }
        | LinkedOptionDataProps[]
      >,
    ) {
      if (isUndefined((action.payload as any)?.index)) {
        state.linkedOptionData = action.payload as LinkedOptionDataProps[];
      } else {
        const {
          index,
          pickedData = [],
          linkedData = [],
        } = action.payload as {
          index: number;
          pickedData: LinkedOptionProps[];
          linkedData: AutoStepLinkedOptionResponse[];
        };

        const newLinkedOptionData = [...state.linkedOptionData];

        newLinkedOptionData[index] = { pickedData, linkedData };

        state.linkedOptionData = newLinkedOptionData;
      }
    },

    resetAutoStepState() {
      return initialState;
    },
  },
});

export const {
  setOptionDatasetName,
  setSlideBar,
  setSlide,
  setPickedOptionId,
  setLinkedOptionData,
  resetAutoStepState,
} = autoStepSlice.actions;

export const autoStepReducer = autoStepSlice.reducer;
