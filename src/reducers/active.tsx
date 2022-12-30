import store, { RootState, useAppSelector } from '.';

import { useEffect, useState } from 'react';

import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

export type CollapseGroup =
  | 'project-basic-info'
  | 'share-via-email'
  | 'inquiry-request'
  | 'issuing-info';

interface ActiveState {
  collapse: {
    [key in CollapseGroup]?: number;
  };
}

const initialState: ActiveState = {
  collapse: {},
};

const activeSlice = createSlice({
  name: 'active',
  initialState,
  reducers: {
    setActiveCollapseItem(
      state,
      action: PayloadAction<{ type: CollapseGroup; activeKey?: number }>,
    ) {
      state.collapse[action.payload.type] =
        state.collapse[action.payload.type] === action.payload.activeKey
          ? undefined
          : action.payload.activeKey;
    },
  },
});

export const { setActiveCollapseItem } = activeSlice.actions;

export const activeReducer = activeSlice.reducer;

export const activeSelector = (state: RootState) => state.active;

export const collapseSelector = (type?: CollapseGroup, index?: number) =>
  createSelector(activeSelector, ({ collapse }) =>
    type && typeof index === 'number' ? (collapse[type] === index ? ['1'] : []) : undefined,
  );

export const setActiveCollapse = (type: CollapseGroup, activeKey: number) => () =>
  store.dispatch(setActiveCollapseItem({ type, activeKey }));

export const clearActiveCollapse = (type: CollapseGroup) =>
  store.dispatch(setActiveCollapseItem({ type, activeKey: undefined }));

export const useCollapseGroupActiveCheck = (
  groupType?: CollapseGroup,
  groupIndex?: number,
  activeKey?: string | string[],
) => {
  const [collapse, setCollapse] = useState<string | string[]>();

  const activeKeyInState = useAppSelector(collapseSelector(groupType, groupIndex));

  const activeOneInGroup = groupType && typeof groupIndex === 'number';

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
