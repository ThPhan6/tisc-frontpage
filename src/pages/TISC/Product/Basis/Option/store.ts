import { flatMap, uniq, uniqBy, xor } from 'lodash';

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
  /* group name */
  groupName: string;

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
  groupName: '',

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

        /// new linkage
      } else {
        const newOptions: LinkedOption[] = options.map((el) => ({
          ...el,
          isPair: false, /// default is unpair
          status: 'inactive',
        }));

        state.connectionList = uniqBy(state.connectionList.concat(newOptions), 'pairId');
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

export const getSubOptionActiveSelector = (
  subOptions: BasisOptionSubForm[],
  preLinkageStep: boolean,
) =>
  createSelector(linkageSeletor, ({ pickedOptionIds, chosenOptionIds }) => {
    const subIds = flatMap(subOptions.map((el) => el.subs.map((item) => item.id)));

    const activeSubItem = (preLinkageStep ? pickedOptionIds : chosenOptionIds).some((el) =>
      subIds.includes(el),
    );

    return activeSubItem ? subOptions : null;
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

export const preSelectLinkageSummarySelector = createSelector(
  linkageSeletor,
  ({ options, pickedOptionIds }) => {
    const subOptions = flatMap(
      options.map((main) =>
        uniq(
          flatMap(
            main.subs
              .map((sub) =>
                sub.subs.map((item) => (pickedOptionIds.includes(item.id) ? sub : undefined)),
              )
              .filter(Boolean),
          ),
        ),
      ),
    ).filter(Boolean) as BasisOptionSubForm[];

    const subOptionIds = subOptions.map((el) => el.main_id);
    const mainOptions = options
      .map((el) => (subOptionIds.includes(el.id) ? el : undefined))
      .filter(Boolean);

    return [
      { 'Main Options': mainOptions?.length ?? 0 },
      {
        'Sub Options': subOptions?.length ?? 0,
      },
      { Products: pickedOptionIds.length ?? 0 },
    ];
  },
);

export const linkageSummarySelector = createSelector(
  linkageSeletor,
  linkageOptionSelector,
  ({ connectionList, chosenOptionIds }, options) => {
    const dataset = flatMap(
      options.map((main) =>
        uniq(
          flatMap(
            main.subs
              .map((sub) =>
                sub.subs.map((item) => (chosenOptionIds.includes(item.id) ? main : undefined)),
              )
              .filter(Boolean),
          ),
        ),
      ),
    ).filter(Boolean);

    return [
      { Dataset: dataset.length },
      { Products: chosenOptionIds.length },
      { 'Connection Pairs': connectionList.length },
    ];
  },
);
