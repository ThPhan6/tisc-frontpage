import {
  CustomProductDetailProps,
  CustomProductList,
  CustomResourceForm,
  ProductOptionProps,
} from './types';
import { RootState } from '@/reducers';

import { ProductTopBarFilter } from '@/features/product/components/FilterAndSorter';

import { PayloadAction, createSelector } from '@reduxjs/toolkit';
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
    updateCustomProductOption: (state, action: PayloadAction<ProductOptionProps>) => {
      const curOption = action.payload.id
        ? state.details.options.findIndex((el) => el.id === action.payload.id)
        : -1;

      if (curOption === -1) {
        state.details.options.push(action.payload);
      } else {
        state.details.options[curOption] = action.payload;
      }
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
  resetCustomProductState,
  updateCustomProductOption,
} = libraryResources.actions;
export const officeProductReducer = libraryResources.reducer;

export const customProductSelector = (state: RootState) => state.customProduct.details;

export const invalidCustomProductSelector = createSelector(
  customProductSelector,
  (customProduct) => {
    // const invalidImages = customProduct.images.length < 1 || customProduct.images.length > 4;

    // const invalidSummary =
    //   !customProduct.company.id ||
    //   !customProduct.collection.id ||
    //   !customProduct.name ||
    //   !customProduct.description;

    const invalidAttributes =
      customProduct.attributes.length > 0 &&
      customProduct.attributes.some((el) => !el.content || !el.name);

    const invalidSpecifications =
      customProduct.specification.length > 0 &&
      customProduct.specification.some((el) => !el.content || !el.name);

    const invalidOptions =
      customProduct.options.length > 0 &&
      customProduct.options.some((el) => !el.title || el.items.length === 0);

    // console.log('invalidImages', invalidImages);
    // console.log('invalidSummary', invalidSummary);
    // console.log('invalidAttributes', invalidAttributes);
    // console.log('invalidSpecifications', invalidSpecifications);
    // console.log('invalidOptions', invalidOptions);

    return {
      // invalidImages,
      // invalidSummary,
      invalidAttributes,
      invalidSpecifications,
      invalidOptions,
    };
  },
);
