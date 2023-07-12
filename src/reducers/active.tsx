import store, { RootState, useAppSelector } from '.';

import { useEffect, useState } from 'react';

import { ProductInfoTab } from '@/features/product/components/ProductAttributes/types';

import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

export type ProductFooterTabs = 'collection' | 'tip' | 'download' | '';
interface ActiveState {
  collapse: {
    [key in string]?: number | string;
  };
  productFooter: ProductFooterTabs;
}

const initialState: ActiveState = {
  collapse: {},
  productFooter: '',
};

const activeSlice = createSlice({
  name: 'active',
  initialState,
  reducers: {
    setActiveCollapseItem(
      state,
      action: PayloadAction<{ type: string; activeKey?: number | string }>,
    ) {
      state.collapse[action.payload.type] =
        state.collapse[action.payload.type] === action.payload.activeKey
          ? undefined
          : action.payload.activeKey;
    },
    onChangeProductFooterTab: (
      state,
      action: PayloadAction<{ tab: ProductFooterTabs; infoTab: ProductInfoTab }>,
    ) => {
      state.productFooter = action.payload.tab;
      delete state.collapse[action.payload.infoTab];
    },
    closeProductFooterTab: (state) => {
      state.productFooter = '';
    },
  },
});

export const { setActiveCollapseItem, onChangeProductFooterTab, closeProductFooterTab } =
  activeSlice.actions;

export const activeReducer = activeSlice.reducer;

export const activeSelector = (state: RootState) => state.active;

export const collapseSelector = (type?: string, index?: number | string) =>
  createSelector(activeSelector, ({ collapse }) =>
    type && (typeof index === 'number' || typeof index === 'string')
      ? collapse[type] === index
        ? ['1']
        : []
      : undefined,
  );

export const setActiveCollapse = (type: string, activeKey: number | string) => () =>
  store.dispatch(setActiveCollapseItem({ type, activeKey }));

export const clearActiveCollapse = (type: string) =>
  store.dispatch(setActiveCollapseItem({ type, activeKey: undefined }));

export const useCollapseGroupActiveCheck = (
  groupType?: string,
  groupIndex?: number | string,
  activeKey?: string | string[],
) => {
  const [collapse, setCollapse] = useState<string | string[]>(); // Use for have activeKey case

  const activeKeyInState = useAppSelector(collapseSelector(groupType, groupIndex));

  const activeOneInGroup =
    groupType && (typeof groupIndex === 'number' || typeof groupIndex === 'string');

  const curActiveKey = activeOneInGroup ? activeKeyInState : collapse;

  const onKeyChange = activeOneInGroup ? setActiveCollapse(groupType, groupIndex) : setCollapse;

  useEffect(() => {
    return () => {
      if (activeOneInGroup) {
        clearActiveCollapse(groupType);
      }
    };
  }, [activeOneInGroup]);

  useEffect(() => {
    setCollapse(activeKey);
  }, [activeKey]);

  return { curActiveKey, onKeyChange };
};
