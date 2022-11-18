import {
  CustomProductDetailProps,
  CustomProductList,
  CustomResourceForm,
  ProductOptionProps,
} from './types';

import { ProductTopBarFilter } from '@/features/product/components/FilterAndSorter';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface CustomProductState {
  list: CustomProductList[];
  details: CustomProductDetailProps;
  filter?: ProductTopBarFilter;
  brand?: CustomResourceForm;
}

const initialState: CustomProductState = {
  list: [],
  details: {
    id: '',
    name: '',
    description: '',
    images: [],
    dimension_and_weight: {
      id: '',
      name: '',
      with_diameter: false,
      attributes: [],
    },
    attributes: [],
    specification: [],
    options: [],
    collection: {
      id: '',
      name: '',
    },
    company: {
      id: '',
      name: '',
    },
  },
};

const libraryResources = createSlice({
  name: 'customProduct',
  initialState,
  reducers: {
    setBrandForCustomProduct(state, action: PayloadAction<CustomResourceForm | undefined>) {
      state.brand = action.payload;
    },
    setCustomProductList(state, action: PayloadAction<CustomProductList[]>) {
      state.list = action.payload;
    },
    setCustomProductDetail(state, action: PayloadAction<Partial<CustomProductDetailProps>>) {
      state.details = { ...state.details, ...action.payload };
    },
    setCustomProductOptionItem(state, action: PayloadAction<ProductOptionProps>) {
      console.log('setCustomProductOptionItem');

      state.details.options = {
        ...state.details.options,
        ...action.payload,
      };
    },
    setCustomProductDetailImage(
      state,
      action: PayloadAction<{ type: 'first' | 'last'; image: string }>,
    ) {
      const newImages = [...state.details.images];
      if (action.payload.type === 'first') {
        newImages.unshift(action.payload.image);
      } else {
        newImages.push(action.payload.image);
      }
      state.details = {
        ...state.details,
        images: newImages,
      };
    },
    setCustomProductFilter(state, action: PayloadAction<ProductTopBarFilter | undefined>) {
      state.filter = action.payload;
    },
    resetCustomProductState() {
      return initialState;
    },
  },
});

export const {
  setCustomProductList,
  setCustomProductDetail,
  setBrandForCustomProduct,
  setCustomProductFilter,
  setCustomProductDetailImage,
  setCustomProductOptionItem,
  resetCustomProductState,
} = libraryResources.actions;
export const officeProductReducer = libraryResources.reducer;
