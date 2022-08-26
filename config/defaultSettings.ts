import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const defaultSettings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  primaryColor: '#2B39D4',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  pwa: false,
  iconfontUrl: '',
};

export default defaultSettings;
