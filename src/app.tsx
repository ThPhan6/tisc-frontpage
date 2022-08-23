import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { PATH, PUBLIC_PATH } from './constants/path';
import { UserHomePagePaths } from '@/constants/user.constant';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';

import { getUserInfoMiddleware } from './pages/LandingPage/services/api';

import type { UserInfoDataProp } from './pages/LandingPage/types';
import store, { persistor } from './reducers';

import AsideMenu from './components/Menu/AsideMenu';
import Header from '@/components/Header';

import defaultSettings from '../config/defaultSettings';

// config request umi
const errorHandler = function (error: any) {
  throw error;
};

const authHeaderInterceptor = (url: string, options: any) => {
  const token = localStorage.getItem('access_token') || '';
  const authHeader = { Authorization: `Bearer ${token}` };
  if (token) {
    return {
      url: `${url}`,
      options: { ...options, interceptors: true, headers: authHeader },
    };
  }
  return {
    url: `${url}`,
    options: { ...options, interceptors: true },
  };
};

export const request: RequestConfig = {
  prefix: API_URL,
  errorHandler,
  requestInterceptors: [authHeaderInterceptor],
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: UserInfoDataProp;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const token = localStorage.getItem('access_token') || '';
  const fetchUserInfo = async () => {
    try {
      const msg = await getUserInfoMiddleware();
      return msg;
    } catch (error) {
      localStorage.clear();
    }
    return undefined;
  };
  if (token) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

ConfigProvider.config({
  // prefixCls: 'custom',
  theme: {
    primaryColor: '#2B39D4',
  },
});

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  console.log('initialState', initialState);
  return {
    title: 'TISC',
    logo: false,
    disableContentMargin: false,
    headerRender: () => <Header />,
    onPageChange: () => {
      const { location } = history;
      const token = localStorage.getItem('access_token') || '';
      if (PUBLIC_PATH.includes(location.pathname)) {
        if (token) {
          const user = store.getState().user.user;
          if (user) {
            history.push(UserHomePagePaths[user.type]);
          }
        } else {
          history.push(`${location.pathname}${location.search}`);
        }
        return;
      }
      if (!token) {
        history.push(PATH.landingPage);
      }
    },
    menuHeaderRender: undefined,
    menuRender: AsideMenu,
    /* eslint-disable @typescript-eslint/no-var-requires */
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading />;
      return <>{children}</>;
    },
    ...initialState?.settings,
  };
};

const ProviderContainer = ({ children, routes }: any) => {
  const newChildren = React.cloneElement(children, {
    ...children.props,
    routes,
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {newChildren}
      </PersistGate>
    </Provider>
  );
};

export function rootContainer(container: any) {
  return React.createElement(ProviderContainer, null, container);
}
