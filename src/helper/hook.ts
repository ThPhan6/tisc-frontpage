import React, { useCallback, useState } from 'react';

import { USER_ROLE } from '@/constants/userRoles';
import { useHistory, useLocation, useModel, useParams } from 'umi';

import { RadioValue } from '@/components/CustomRadio/types';
import { useAppSelector } from '@/reducers';

import { getQueryVariableFromOriginURL, redirectAfterLogin } from './utils';
import access from '@/access';

export function useDefault<T>(defaultValue: T) {
  const [value, setValue] = React.useState<T>(defaultValue);
  return { value, setValue };
}

export function useBoolean(defaultValue = false) {
  return useDefault<boolean>(defaultValue);
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

export const useCheckBrandSpecified = (isSpecified: boolean) => {
  const brandUser = useCheckPermission(['Brand Admin', 'Brand Team']);

  return brandUser && isSpecified;
};

export const useGetQueryFromOriginURL = (queryKey: string) => {
  const query = getQueryVariableFromOriginURL(window.location.href);
  return query[queryKey];
};

export const useGetUserRoleFromPathname = () => {
  return useLocation().pathname.split('/')[1] as USER_ROLE;
};

export const useGetParamId = () => {
  const params = useParams<{ id: string }>();
  return params?.id ?? '';
};

export const useToggleExpand = (singleExpand = false) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  /**
   * Function to toggle the expanded state of an item.
   *
   * @param key - The key of the item to toggle the expanded state.
   */
  const handleToggleExpand = useCallback(
    (key: string) => {
      setExpandedKeys((prev) => {
        if (singleExpand) return prev.includes(key) ? [] : [key];
        if (prev.includes(key)) return prev.filter((id) => id !== key);
        return prev.concat([key]);
      });
    },
    [singleExpand],
  );

  return { expandedKeys, setExpandedKeys, handleToggleExpand };
};

type FormData = Record<string, any>;

export const useEntryFormHandlers = <T extends FormData>(initialData: T) => {
  const [data, setData] = useState<T>(initialData);

  const handleOnChange = <K extends keyof T>(fieldName: K, fieldValue: T[K] | string) => {
    setData((prevData) => ({
      ...prevData,
      [fieldName]: fieldValue,
    }));
  };

  const handleInputChange =
    (fieldName: keyof T) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleOnChange(fieldName, event.target.value);
    };

  const handleInputDelete = (fieldName: keyof T) => () => handleOnChange(fieldName, '');

  const handlePhoneChange = (fieldName: keyof T) => (value: { phoneNumber: string }) => {
    handleOnChange(fieldName, value.phoneNumber);
  };

  const handleRadioChange = (fieldName: keyof T) => (radioValue: RadioValue) =>
    handleOnChange(fieldName, radioValue.value as T[typeof fieldName]);

  return {
    data,
    setData,
    handleOnChange,
    handleInputChange,
    handleInputDelete,
    handlePhoneChange,
    handleRadioChange,
  };
};

interface NavigateOptions {
  path: string;
  query?: Record<string, any>;
  state?: Record<string, any>;
}

export const useNavigationHandler = () => {
  const history = useHistory();

  const navigate =
    ({ path, query, state }: NavigateOptions) =>
    () => {
      const searchParams = query ? new URLSearchParams(query).toString() : '';
      const search = searchParams ? `?${searchParams}` : '';

      history.push({
        pathname: path,
        search,
        state,
      });
    };

  return navigate;
};

export const useSelectableData = <T extends { items: { id: string }[] }>(data: T[]) => {
  const [selectedValue, setSelectedValue] = useState<any>(null);

  const handleRadioChange = (event: any) => {
    const selectedItem = data
      .flatMap((category) => category.items)
      .find((item) => item.id === event.target.value);
    setSelectedValue(selectedItem ?? null);
  };

  return [selectedValue, handleRadioChange] as const;
};
