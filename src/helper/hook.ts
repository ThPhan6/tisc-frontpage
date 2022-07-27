import { useAppSelector } from '@/reducers';
import React from 'react';
import { useLocation, useModel } from 'umi';

/// check user permission
type AccessLevelType =
  | 'TISC Admin'
  | 'Consultant Team'
  | 'Brand Admin'
  | 'Brand Team'
  | 'Design Admin'
  | 'Design Team';

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

  const currentUser = initialState?.currentUser;

  return {
    loading,
    initialState,
    setInitialState,
    fetchUserInfo,
    currentUser,
  };
};

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const useCheckPermission = (allowRoles: AccessLevelType | AccessLevelType[]) => {
  const access_level = useAppSelector((state) => state.user.user?.access_level);

  if (!access_level) {
    return { permission: false, role: allowRoles };
  }

  const userRole =
    typeof allowRoles === 'string'
      ? access_level === allowRoles
      : allowRoles.some((role) => access_level.includes(role));

  return { permission: userRole, role: access_level };
};
