import React from 'react';
import { useLocation, useModel } from 'umi';

export function useDefault(defaultValue: any) {
  const [value, setValue] = React.useState(defaultValue);
  return { value, setValue };
}

export function useBoolean(defaultValue = false) {
  return useDefault(defaultValue);
}

export function useNumber(defaultValue = 0) {
  return useDefault(defaultValue);
}

export function useString(defaultValue = '') {
  return useDefault(defaultValue);
}

export const useCustomInitialState = () => {
  const { initialState, setInitialState, loading } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };
  return {
    loading,
    initialState,
    setInitialState,
    fetchUserInfo,
  };
};

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};
