import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';

import servicesReducer from '@/features/services/reducer';

import { autoStepReducer } from './../features/product/reducers/autoStep';
import { importReducer } from '@/features/Import/reducers';
import { categoryReducer } from '@/features/categories/reducers';
import { productReducer } from '@/features/product/reducers';
import { projectReducer } from '@/features/project/reducers';
import { customResourceReducer } from '@/pages/Designer/CustomResource/reducer';

import { linkageReducer } from './../pages/TISC/Product/Basis/Option/store';
import { loadingActionReducer } from '@/components/LoadingPage/slices';
import { officeProductReducer } from '@/pages/Designer/Products/CustomLibrary/slice';
import { quotationReducer } from '@/pages/LandingPage/quotionReducer';
import { componentReducer } from '@/pages/TISC/Product/Basis/Option/componentReducer';

import { activeReducer } from './active';
import labelReducer from './label';
import { modalReducer } from './modal';
import partnerReducer from './partner';
import summaryReducer from './summary';
import userReducer from './user';
import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({
  product: productReducer,
  customProduct: officeProductReducer, // using for office library
  category: categoryReducer,
  user: userReducer,
  label: labelReducer,
  partner: partnerReducer,
  project: projectReducer,
  loading: loadingActionReducer,
  summary: summaryReducer,
  customResource: customResourceReducer,
  service: servicesReducer,
  modal: modalReducer,
  active: activeReducer,
  quotation: quotationReducer,
  linkage: linkageReducer,
  autoStep: autoStepReducer,
  component: componentReducer,
  import: importReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const persistedReducers = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducers,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

// State Type
export type RootState = ReturnType<typeof reducers>;

// Inject Type RootState on useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
