import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import React from 'react';
import { Provider } from 'react-redux';
import store, { persistor } from './reducers';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from 'antd';
import { getUserInfoMiddleware } from './pages/LandingPage/services/api';
import { PATH, PUBLIC_PATH } from './constants/path';
import type { UserInfoDataProp } from './pages/LandingPage/types';
import Header from '@/components/Header';
import AsideMenu from './components/Menu/AsideMenu';
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
          if (user?.brand) {
            history.push(PATH.brandHomePage);
          } else if (user?.access_level === 'Design Admin') {
            history.push(PATH.designerHomePage);
          } else {
            history.push(PATH.homePage);
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
    menuRender: (props) => <AsideMenu {...props} />,
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
