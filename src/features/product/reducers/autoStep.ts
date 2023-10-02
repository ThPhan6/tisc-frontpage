import { isUndefined } from 'lodash';

import {
  AutoStepLinkedOptionResponse,
  AutoStepPreSelectOnAttributeGroupResponse,
  LinkedOptionProps,
  OptionQuantityProps,
  OptionReplicateResponse,
} from '../types/autoStep';
import store from '@/reducers';

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface LinkedOptionDataProps {
  pickedData: LinkedOptionProps[];
  linkedData: AutoStepLinkedOptionResponse[];
}

export interface PickedOptionProps {
  [slide: number]: { id: string; pre_option: string; replicate?: number; yours?: number };
}

export interface AllLinkedDataSelectProps {
  [slide: string]: LinkedOptionProps[];
}

export interface OptionSelectedProps {
  [order: number]: {
    id?: string;
    order: number;
    options: OptionReplicateResponse[] | OptionQuantityProps[];
  };
}

export interface OptionPreSelectedProps {
  [order: number]: AutoStepPreSelectOnAttributeGroupResponse;
}

interface AutoStepProps {
  pickedOption: PickedOptionProps;

  optionsSelected: OptionSelectedProps;

  linkedOptionData: LinkedOptionDataProps[]; /// data view when select on TISC

  preSelectStep: OptionPreSelectedProps; /// data view when pre-select on Brand/Designer

  slide: number; /// (1) -> (2)
  slideBars: string[]; /// (1)<description> -> (2)<description>

  step: 'pre' | number; /// save for open view

  subOptionSelected: { [groupAttributeId: string]: string };
}

const initialState: AutoStepProps = {
  slide: 0,
  slideBars: ['', ''],

  step: 'pre', /// default is select option dataset in FirstStep component

  optionsSelected: [], /// this is payload of all sub options selected

  preSelectStep: {}, /// all data view on left and right panel of Brand/Designer

  pickedOption: {}, /// all hightlighted on the left panel

  linkedOptionData: [], /// all data view on left and right panel of TISC

  subOptionSelected: {}, /// option dataset selected
};

const autoStepSlice = createSlice({
  name: 'autoStep',
  initialState,
  reducers: {
    setSlideBar(state, action: PayloadAction<string[]>) {
      state.slideBars = action.payload;
    },

    setSlide(state, action: PayloadAction<number>) {
      state.slide = action.payload;
    },

    setStep(state, action: PayloadAction<'pre' | number>) {
      state.step = action.payload;
    },

    setSubOptionSelected(state, action: PayloadAction<{ [groupAttributeId: string]: string }>) {
      state.subOptionSelected = { ...state.subOptionSelected, ...action.payload };
    },

    setOptionsSelected(
      state,
      action: PayloadAction<
        | { id: string; order: number; options: OptionReplicateResponse[] | OptionQuantityProps[] }
        | OptionSelectedProps
      >,
    ) {
      const { id, order, options } = action.payload as any;

      if (isUndefined(order) || isUndefined(options)) {
        state.optionsSelected = action.payload;

        return;
      }

      state.optionsSelected = {
        ...state.optionsSelected,
        [order]: { id, order, options },
      };
    },

    setPickedOption(
      state,
      action: PayloadAction<
        | { slide: number; pre_option: string; id: string; replicate: number; yours: number }
        | PickedOptionProps
      >,
    ) {
      const { slide, pre_option, id, replicate = 1, yours = 0 } = action.payload as any;

      if (isUndefined(slide) || isUndefined(id)) {
        state.pickedOption = action.payload;

        return;
      }

      state.pickedOption = {
        ...state.pickedOption,
        [slide]: { id, pre_option, replicate, yours },
      };
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

    /* brand//designer */
    setPreSelectStep(
      state,
      action: PayloadAction<
        | {
            order: number;
            options: OptionQuantityProps[];
          }
        | OptionPreSelectedProps
      >,
    ) {
      const { order, options } = action.payload as any;

      if (isUndefined(order) || isUndefined(options)) {
        state.preSelectStep = action.payload;

        return;
      }

      state.preSelectStep = {
        ...state.preSelectStep,
        [order]: { ...state.preSelectStep[order], order, options },
      };
    },

    resetAutoStepState() {
      return initialState;
    },
  },
});

export const {
  setStep,
  setSlide,
  setSlideBar,
  setPickedOption,
  resetAutoStepState,

  /// TISC
  setOptionsSelected,
  setLinkedOptionData,
  setSubOptionSelected,

  /// Brand/Designer
  setPreSelectStep,
} = autoStepSlice.actions;

export const autoStepReducer = autoStepSlice.reducer;

export const clearSteps = () => {
  store.dispatch(setSlideBar(['', '']));
  store.dispatch(setSlide(0));
  store.dispatch(setPickedOption({}));
  store.dispatch(setOptionsSelected([]));
  store.dispatch(setStep('pre'));
};
