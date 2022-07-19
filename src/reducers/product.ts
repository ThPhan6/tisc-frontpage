import type {
  IBrandDetail,
  ProductCatelogue,
  ProductDownload,
  ProductList,
  ProductSummary,
  ProductTip,
  IRelatedCollection,
  ProductItem,
} from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface ProductState {
  brand?: IBrandDetail;
  summary?: ProductSummary;
  tip: ProductTip;
  download: ProductDownload;
  catelogue: ProductCatelogue;
  details: ProductItem;
  relatedProduct: IRelatedCollection[];
  list: ProductList;
}

const initialState: ProductState = {
  details: {
    name: '',
    description: '',
    keywords: ['', '', '', ''],
    images: [],
    general_attribute_groups: [],
    feature_attribute_groups: [],
    specification_attribute_groups: [],
    categories: [],
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
    setBrand(state, action: PayloadAction<IBrandDetail | undefined>) {
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
    setRelatedProduct(state, action: PayloadAction<IRelatedCollection[]>) {
      state.relatedProduct = action.payload;
    },
    reset(state) {
      return {
        ...initialState,
        list: state.list,
      };
    },
  },
});

export const {
  reset,
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
} = productSlice.actions;
export default productSlice.reducer;
