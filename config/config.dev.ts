// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  dynamicImport: {
    loading: '@/components/LoadingPage',
  },
});
