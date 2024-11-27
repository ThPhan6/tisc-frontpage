// https://umijs.org/config/
import { defineConfig } from 'umi';

import defaultSettings from './defaultSettings';
import routes from './routes';

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: false,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 240,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  // dynamicImport: {
  //   loading: '@/components/LoadingPage',
  // },
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

    // colors
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
    // box-shadow border
    'border-top': 'inset 0 .7px 0 #000',
    'border-bottom': 'inset 0 -.7px 0 #000',
    'border-top-bottom': 'inset 0 -.7px 0 #000, inset 0 .7px 0 #000',
    'border-left': 'inset .7px 0 0 #000',
    'border-right': 'inset -.7px 0 0 #000',
    'border-all': 'inset 0 0 0 .7px #000',
    'border-top-light': 'inset 0 .5px 0 rgba(0, 0, 0, 0.3)',
    'border-bottom-light': 'inset 0 -.5px 0 rgba(0, 0, 0, 0.3)',
    'border-left-light': 'inset .7px 0 0 rgba(0, 0, 0, 0.3)',
    'border-right-light': 'inset -.7px 0 0 rgba(0, 0, 0, 0.3)',
    'border-all-light': 'inset 0 0 0 .7px rgba(0, 0, 0, 0.3)',
    'border-bottom-black-inset': '0 -0.5px 0 0 #000 inset',
    'border-top-black-inset': '0 0.5px 0 0 #000 inset',
    'border-right-black-inset': '-0.5px 0 0 0 #000 inset',
    'screen-lg': '1500px',

    //font fontFamily
    'font-primary': 'Roboto',
    'font-secondary': 'Cormorant-Garamond',
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
  mfsu: false,
  webpack5: {},
  exportStatic: {},
  define: {
    API_URL: process.env.REACT_APP_API_URL || '',
    STORE_URL: process.env.TISC_FILE_STORE_URL || '',
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || '',
    ENABLE_RECAPTCHA: process.env.ENABLE_RECAPTCHA === 'true',
    // Can choose other production environments, 'staging | 'demo' | 'prod'
    AIRWALLEX_ENVIRONMENT: process.env.REACT_APP_AIRWALLEX_ENVIRONMENT || 'demo',
  },
});
