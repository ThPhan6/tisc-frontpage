import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';

import { categoryReducer } from '@/features/categories/reducers';
import { productReducer } from '@/features/product/reducers';
import { projectReducer } from '@/features/project/reducers';

import { loadingActionReducer } from '@/components/LoadingPage/slices';
import { officeProductReducer } from '@/pages/Designer/Products/CustomLibrary/slice';

import summaryReducer from './summary';
import userReducer from './user';
import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({
  product: productReducer,
  officeProduct: officeProductReducer, // using for office library
  category: categoryReducer,
  user: userReducer,
  project: projectReducer,
  loading: loadingActionReducer,
  summary: summaryReducer,
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
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
  }),
});

export const persistor = persistStore(store);

// State Type
export type RootState = ReturnType<typeof reducers>;

// Inject Type RootState on useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
