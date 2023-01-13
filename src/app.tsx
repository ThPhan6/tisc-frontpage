import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { PATH, PUBLIC_PATH } from './constants/path';
import { UserHomePagePaths } from '@/constants/user.constant';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { ConfigProvider } from 'antd';
import { RequestConfig, RunTimeLayoutConfig, history } from 'umi';

import { getUserInfoMiddleware } from './pages/LandingPage/services/api';
import { debounce } from 'lodash';

import type { UserInfoDataProp } from './pages/LandingPage/types';
import store, { persistor } from './reducers';

import LoadingPageCustomize from './components/LoadingPage';
import AsideMenu from './components/Menu/AsideMenu';
import NoAccessPage from './pages/403';
import Header from '@/components/Header';

import defaultSettings from '../config/defaultSettings';
import { ModalController } from './controllers/ModalController';
import Cookies from 'js-cookie';

// config request umi
const errorHandler = function (error: any) {
  throw error;
};

const authHeaderInterceptor = (url: string, options: any) => {
  const token = localStorage.getItem('access_token') || '';

  // get signature from cookies
  const signature = Cookies.get('signature') || '';

  const axiosHeader: any = {
    url: `${url}`,
    options: { ...options, interceptors: true },
  };

  if (token) {
    axiosHeader.options.headers = { Authorization: `Bearer ${token}` };
  }

  if (signature) {
    axiosHeader.options.headers = {
      ...axiosHeader.options.headers,
      signature,
    };
  }

  return axiosHeader;
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
      return await getUserInfoMiddleware();
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
    headerRender: (props) => <Header {...props} />,
    onPageChange: () => {
      const { location } = history;
      const token = localStorage.getItem('access_token') || '';
      const signature = Cookies.get('signature') || '';
      const publicPage =
        location.pathname.indexOf('shared-product' || 'shared-custom-product') !== -1;
      const bookingPage = location.pathname.indexOf('booking') !== -1;

      if (publicPage || bookingPage || PUBLIC_PATH.includes(location.pathname)) {
        if (signature) {
          history.push(`${location.pathname}${location.search}`);
          return;
        }

        if (token) {
          const user = store.getState().user.user;
          if (user && !publicPage) {
            history.push(UserHomePagePaths[user.type]);
            return;
          }
        }
        return;
      }
      if (!token) {
        history.push(PATH.landingPage);
      }
    },
    menuRender: (props) => <AsideMenu {...props} />,
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}

          <LoadingPageCustomize />

          <ModalController />
        </>
      );
    },
    unAccessible: <NoAccessPage />,
    ...initialState?.settings,
  };
};

const ProviderContainer = ({ children, routes }: any) => {
  const newChildren = React.cloneElement(children, {
    ...children.props,
    routes,
  });

  useEffect(() => {
    const resize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vhi', `${vh}px`);
    };

    resize();
    const debounceResize = debounce(resize, 50);
    window.addEventListener('resize', debounceResize);
    return () => window.removeEventListener('resize', debounceResize);
  }, []);

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
