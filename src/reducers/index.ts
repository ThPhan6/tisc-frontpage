import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productReducer from './product';
import userReducer from './user';
import categoryReducer from './category';
const reducers = combineReducers({
  product: productReducer,
  category: categoryReducer,
  user: userReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [],
  blacklist: [],
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
