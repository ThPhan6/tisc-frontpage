import { sum, uniq, uniqBy, xor } from 'lodash';

import { RootState } from '@/reducers';
import { BasisOptionForm, BasisOptionSubForm } from '@/types';

import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

export type OptionLinkedStatus = 'inactive' | 'pair' | 'unpair';

export type LinkedOption = {
  pairId: string;
  isPair: boolean;
  productId: string;
  status: OptionLinkedStatus;
};

export interface LinkageState {
  /* pre select form */
  options: BasisOptionForm[]; /// data
  pickedOptionIds: string[]; /// option selected

  expandSubOptionIds: string[]; /// option collapse

  /*  select form */
  connectionList: LinkedOption[];
  originConnectionList: LinkedOption[];
  chosenOptionIds: string[];
  rootMainOptionId: string;
  rootSubItemId: string;
  rootSubItemProductId: string;
}

const initialState: LinkageState = {
  options: [],
  pickedOptionIds: [],

  connectionList: [],
  originConnectionList: [],
  chosenOptionIds: [],
  rootMainOptionId: '',
  rootSubItemId: '',
  rootSubItemProductId: '',

  ///
  expandSubOptionIds: [],
};

const linkageSlice = createSlice({
  name: 'linkage',
  initialState,
  reducers: {
    setLinkageState: (state, action: PayloadAction<Partial<LinkageState>>) => {
      return { ...state, ...action.payload };
    },

    ///
    toggleSubOptionCollapse: (state, action: PayloadAction<string[]>) => {
      state.expandSubOptionIds = xor(state.expandSubOptionIds, action.payload);
    },

    /// set select option
    updatePickedOptions: (
      state,
      action: PayloadAction<{ pickIds: string[]; remove: boolean; preLinkageForm: boolean }>,
    ) => {
      const { pickIds, remove } = action.payload;
      const stateKey = action.payload.preLinkageForm ? 'pickedOptionIds' : 'chosenOptionIds';
      if (remove) {
        state[stateKey] = state[stateKey].filter((id) => pickIds.includes(id) === false);
      } else {
        state[stateKey] = uniq(state[stateKey].concat(pickIds));
      }
    },

    ///
    updateConnectionList: (
      state,
      action: PayloadAction<{ options: LinkedOption[]; remove: boolean }>,
    ) => {
      const { options, remove } = action.payload;

      const optionIds = options.map((el) => el.pairId);

      if (remove) {
        const opts = state.connectionList.filter((el) => optionIds.includes(el.pairId) === false);

        const newConnectionList = uniqBy(state.originConnectionList.concat(opts), 'pairId');

        state.connectionList = newConnectionList;
        ///
      } else {
        state.connectionList = uniqBy(state.connectionList.concat(options), 'pairId');
      }
    },
    updateLinkedOptionStatus: (state, action: PayloadAction<LinkedOption>) => {
      const { isPair, pairId } = action.payload;

      state.connectionList = state.connectionList.map((el) => ({
        ...el,
        isPair: pairId === el.pairId ? !isPair : el.isPair,
        status: pairId === el.pairId ? 'unpair' : 'pair',
      }));
    },

    ///
    resetLinkageState: () => initialState,
  },
});

export const {
  resetLinkageState,
  toggleSubOptionCollapse,
  updatePickedOptions,
  updateLinkedOptionStatus,
  updateConnectionList,
  setLinkageState,
} = linkageSlice.actions;

// export const setLinkageState = (payload: Partial<LinkageState>) =>
//   store.dispatch(linkageSlice.actions.setLinkageState(payload));

export const linkageReducer = linkageSlice.reducer;

const linkageSeletor = (state: RootState) => state.linkage;

export const isLinkageSubOptionExpandSelector = (id: string) =>
  createSelector(linkageSeletor, ({ expandSubOptionIds }) => {
    return expandSubOptionIds.includes(id);
  });

export const isAllSelectedMainOptionSelector = (
  mainOption: BasisOptionForm,
  preLinkageStep: boolean,
) =>
  createSelector(linkageSeletor, ({ pickedOptionIds, chosenOptionIds }) => {
    return mainOption.subs.every((sub) => {
      return sub.subs.every((s) =>
        (preLinkageStep ? pickedOptionIds : chosenOptionIds).includes(s.id || ''),
      );
    });
  });

export const isAllSelectedSubOptionSelector = (
  subOption: BasisOptionSubForm,
  preLinkageStep: boolean,
) =>
  createSelector(linkageSeletor, ({ pickedOptionIds, chosenOptionIds }) => {
    return subOption.subs.every((sub) =>
      (preLinkageStep ? pickedOptionIds : chosenOptionIds).includes(sub.id || ''),
    );
  });

export const isSelectedSubItemSelector = (id: string, preLinkageStep: boolean) =>
  createSelector(linkageSeletor, ({ pickedOptionIds, chosenOptionIds }) => {
    return (preLinkageStep ? pickedOptionIds : chosenOptionIds).includes(id);
  });

export const isPairedOptionItemSelector = (id: string) =>
  createSelector(linkageSeletor, ({ connectionList }) => {
    return connectionList.findIndex((el) => el.pairId === id) > -1;
  });

export const linkageOptionSelector = createSelector(
  linkageSeletor,
  ({ options, pickedOptionIds }) => {
    const data = options.map((el) => ({
      ...el,
      subs: el.subs.map((sub) => ({
        ...sub,
        subs: sub.subs.filter((item) => pickedOptionIds.includes(item.id as string)),
      })),
    }));

    return data
      .map((el) => ({ ...el, subs: el.subs.filter((item) => item.subs.length) }))
      .filter((el) => el.subs.length);
  },
);

export const preSelectLinkageSummarySelector = createSelector(linkageSeletor, ({ options }) => {
  return [
    { 'Main Options': options.length },
    { 'Sub Options': sum(options.map((op) => op.subs.length)) },
    { Products: sum(options.map((op) => sum(op.subs.map((s) => s.subs.length)))) },
  ];
});

export const linkageSummarySelector = createSelector(
  linkageSeletor,
  linkageOptionSelector,
  ({ connectionList }, options) => {
    return [
      { Dataset: options.length },
      { Products: sum(options.map((op) => sum(op.subs.map((s) => s.subs.length)))) },
      { 'Connection Pairs': connectionList.length },
    ];
  },
);
