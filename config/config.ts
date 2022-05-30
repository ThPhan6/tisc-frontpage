// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: false,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // https://ant.design/docs/react/customize-theme-variable-cn
    // 'root-entry-name': 'variable',
    'primary-color': '#1A227F',
    'primary-color-dark': '#2B39D4',
    'primary-color-medium': '#8088E5',
    'primary-color-light': '#D5D7F6',
    'secondary-color': '#E65000',
    'secondary-color-medium': '#EF8B4D',
    'secondary-color-light': '#FFCDB3',
    'tertiary-color': '#EB008D',
    'tertiary-color-medium': '#FF52BA',
    'tertiary-color-light': '#FFB8E2',
    'mono-color': '#000000',
    'mono-color-dark': '#808080',
    'mono-color-medium': '#BFBFBF',
    'mono-color-light': '#E6E6E6',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
