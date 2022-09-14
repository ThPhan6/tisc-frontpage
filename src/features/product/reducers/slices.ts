import type {
  ProductCatelogue,
  ProductDownload,
  ProductItem,
  ProductList,
  ProductSummary,
  ProductTip,
  RelatedCollection,
  SortParams,
} from '../types';
import { BrandDetail } from '@/features/user-group/types';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface ProductState {
  brand?: BrandDetail;
  summary?: ProductSummary;
  tip: ProductTip;
  download: ProductDownload;
  catelogue: ProductCatelogue;
  details: ProductItem;
  relatedProduct: RelatedCollection[];
  list: ProductList;
}

const initialState: ProductState = {
  details: {
    id: '',
    name: '',
    description: '',
    keywords: ['', '', '', ''],
    images: [],
    general_attribute_groups: [],
    feature_attribute_groups: [],
    specification_attribute_groups: [],
    categories: [],
    referToDesignDocument: true,
  },
  tip: {
    contents: [],
  },
  download: {
    contents: [],
  },
  catelogue: {
    contents: [],
  },
  relatedProduct: [],
  list: {
    data: [],
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setBrand(state, action: PayloadAction<BrandDetail | undefined>) {
      state.brand = action.payload;
    },
    setProductSummary(state, action: PayloadAction<ProductSummary | undefined>) {
      state.summary = action.payload;
    },
    setProductDetail(state, action: PayloadAction<ProductItem>) {
      state.details = action.payload;
    },
    setPartialProductDetail(state, action: PayloadAction<Partial<ProductItem>>) {
      state.details = {
        ...state.details,
        ...action.payload,
      };
    },
    setProductDetailImage(state, action: PayloadAction<{ type: 'first' | 'last'; image: string }>) {
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
    setProductTip(state, action: PayloadAction<Partial<ProductTip>>) {
      state.tip = {
        ...state.tip,
        ...action.payload,
      };
    },
    setProductDownload(state, action: PayloadAction<Partial<ProductDownload>>) {
      state.download = {
        ...state.download,
        ...action.payload,
      };
    },
    setProductCatelogue(state, action: PayloadAction<Partial<ProductCatelogue>>) {
      state.catelogue = {
        ...state.catelogue,
        ...action.payload,
      };
    },
    setProductList(state, action: PayloadAction<Partial<ProductList>>) {
      state.list = {
        ...state.list,
        ...action.payload,
      };
    },
    setRelatedProduct(state, action: PayloadAction<RelatedCollection[]>) {
      state.relatedProduct = action.payload;
    },
    setProductListSearchValue(state, action: PayloadAction<string>) {
      state.list.search = action.payload;
    },
    setProductListSorter(state, action: PayloadAction<SortParams>) {
      state.list.sort = action.payload;
    },
    resetProductDetailState(state) {
      return { ...initialState, list: state.list, brand: state.brand };
    },
    resetProductState() {
      return initialState;
    },
  },
});

export const {
  resetProductState,
  setBrand,
  setProductSummary,
  setProductDetail,
  setPartialProductDetail,
  setProductDetailImage,
  setProductTip,
  setProductCatelogue,
  setProductDownload,
  setProductList,
  setRelatedProduct,
  setProductListSearchValue,
  setProductListSorter,
  resetProductDetailState,
} = productSlice.actions;

export const productReducer = productSlice.reducer;
