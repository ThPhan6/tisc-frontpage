import store from '@/reducers';

import { setLoadingAction } from '@/components/LoadingPage/slices';

export const showPageLoading = () => store.dispatch(setLoadingAction(true));

export const hidePageLoading = () => store.dispatch(setLoadingAction(false));
