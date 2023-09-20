import { isUndefined } from 'lodash';

import {
  AutoStepLinkedOptionResponse,
  LinkedOptionProps,
  OptionReplicateResponse,
} from '../types/autoStep';
import store from '@/reducers';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface LinkedOptionDataProps {
  pickedData: LinkedOptionProps[];
  linkedData: AutoStepLinkedOptionResponse[];
}

export interface PickedOptionProps {
  [slide: number]: { id: string; pre_option: string };
}

export interface AllLinkedDataSelectProps {
  [slide: string]: LinkedOptionProps[];
}

export interface OptionSelectedProps {
  [order: number]: { order: number; name?: string; options: OptionReplicateResponse[] };
}

interface AutoStepProps {
  optionDatasetName: string;

  pickedOption: PickedOptionProps;

  optionsSelected: OptionSelectedProps;

  linkedOptionData: LinkedOptionDataProps[];

  slide: number | undefined;
  slideBar: string[];

  step: 'pre' | number | undefined;

  subOptionSelected: { [groupAttributeId: string]: string };
}

const initialState: AutoStepProps = {
  optionDatasetName: '',

  slide: undefined,
  slideBar: ['', ''],

  step: undefined,

  optionsSelected: [],

  pickedOption: {},

  linkedOptionData: [],

  subOptionSelected: {},
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

    setSlide(state, action: PayloadAction<number | undefined>) {
      state.slide = action.payload;
    },

    setStep(state, action: PayloadAction<'pre' | number | undefined>) {
      state.step = action.payload;
    },

    setSubOptionSelected(state, action: PayloadAction<{ [groupAttributeId: string]: string }>) {
      state.subOptionSelected = { ...state.subOptionSelected, ...action.payload };
    },

    setOptionsSelected(
      state,
      action: PayloadAction<
        | {
            order: number;
            options: OptionReplicateResponse[];
          }
        | OptionSelectedProps
      >,
    ) {
      const { order, options } = action.payload as any;

      if (isUndefined(order) || isUndefined(options)) {
        state.optionsSelected = action.payload;

        return;
      }

      state.optionsSelected = { ...state.optionsSelected, [order]: { order, options } };
    },

    setPickedOption(
      state,
      action: PayloadAction<{ slide: number; pre_option: string; id: string } | PickedOptionProps>,
    ) {
      const { slide, pre_option, id } = action.payload as any;

      if (isUndefined(slide) || isUndefined(id)) {
        state.pickedOption = action.payload;

        return;
      }

      state.pickedOption = { ...state.pickedOption, [slide]: { id, pre_option } };
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
  setPickedOption,
  setLinkedOptionData,
  setOptionsSelected,
  setStep,
  setSubOptionSelected,
  resetAutoStepState,
} = autoStepSlice.actions;

export const autoStepReducer = autoStepSlice.reducer;

export const clearSteps = () => {
  store.dispatch(setOptionDatasetName(''));
  store.dispatch(setSlideBar(['', '']));
  store.dispatch(setSlide(undefined));
  store.dispatch(setPickedOption({}));
  store.dispatch(setOptionsSelected([]));
  store.dispatch(setStep(undefined));
};
