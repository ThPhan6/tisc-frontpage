import { Spin } from 'antd';

import store, { useAppSelector } from '@/reducers';

import { setLoadingAction } from './slices';
import styles from './styles/index.less';

export const LoadingPageCustomize = () => {
  const loading = useAppSelector((state) => state.loading.spninning);

  if (loading) {
    return (
      <div className={styles.container}>
        <Spin size="large" />
      </div>
    );
  }
  return null;
};

export const showPageLoading = () => store.dispatch(setLoadingAction(true));

export const hidePageLoading = () => store.dispatch(setLoadingAction(false));
