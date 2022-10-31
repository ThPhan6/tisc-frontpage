import React from 'react';

import { USER_ROLE } from '@/constants/userRoles';
import { useLocation, useModel, useParams } from 'umi';

import { useAppSelector } from '@/reducers';

import { redirectAfterLogin } from './utils';
import access from '@/access';

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

  const fetchUserInfo = async (hasRedirect?: boolean) => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      const newInitialState = {
        ...initialState,
        currentUser: userInfo,
      };
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
      if (hasRedirect) {
        redirectAfterLogin(access(newInitialState), userInfo.type);
      }
      return newInitialState;
    }
    return undefined;
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

/// check user permission
type AccessLevelType =
  | 'TISC Admin'
  | 'Consultant Team'
  | 'Brand Admin'
  | 'Brand Team'
  | 'Design Admin'
  | 'Design Team';

export const useCheckPermission = (allowRoles: AccessLevelType | AccessLevelType[]) => {
  const isPublicPage = useQuery().get('signature') || '';

  const access_level = useAppSelector(
    (state) => state.user.user?.access_level,
  )?.toLocaleLowerCase();

  if (isPublicPage || !access_level) {
    return false;
  }

  return typeof allowRoles === 'string'
    ? access_level === allowRoles.toLocaleLowerCase()
    : allowRoles.some((role) => access_level.includes(role.toLocaleLowerCase()));
};

export const useGetUserRoleFromPathname = () => {
  return useLocation().pathname.split('/')[1] as USER_ROLE;
};

export const useGetParamId = () => {
  const params = useParams<{ id: string }>();
  return params?.id ?? '';
};
