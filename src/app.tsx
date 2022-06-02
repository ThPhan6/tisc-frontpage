import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import defaultSettings from '../config/defaultSettings';
import React from 'react';
import { Provider } from 'react-redux';
import store, { persistor } from './reducers';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from 'antd';
import { getUserInfoMiddleware } from './pages/LandingPage/services/api';
import { PATH } from './constants/path';

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
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await getUserInfoMiddleware();
      return msg;
    } catch (error) {
      localStorage.clear();
      history.push(PATH.landingPage);
    }
    return undefined;
  };
  if (history.location.pathname !== PATH.landingPage) {
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
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      const token = localStorage.getItem('access_token') || '';
      if (token && location.pathname === PATH.landingPage) {
        history.push(PATH.homePage);
      }
      if (!token && location.pathname !== PATH.landingPage) {
        history.push(PATH.landingPage);
      }
    },
    menuHeaderRender: undefined,
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
