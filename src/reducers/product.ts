import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IBrandDetail,
  IProductSummary,
  IProductTip,
  IProductDownload,
  IProductDetail,
  IRelatedCollection,
  IProductCatelogue,
  IProductList,
} from '@/types';

interface ProductState {
  brand?: IBrandDetail;
  summary?: IProductSummary;
  tip: IProductTip;
  download: IProductDownload;
  catelogue: IProductCatelogue;
  details: IProductDetail;
  relatedProduct: IRelatedCollection[];
  list: IProductList;
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
    setProductSummary(state, action: PayloadAction<IProductSummary | undefined>) {
      state.summary = action.payload;
    },
    setProductDetail(state, action: PayloadAction<IProductDetail>) {
      state.details = action.payload;
    },
    setPartialProductDetail(state, action: PayloadAction<Partial<IProductDetail>>) {
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
    setProductTip(state, action: PayloadAction<Partial<IProductTip>>) {
      state.tip = {
        ...state.tip,
        ...action.payload,
      };
    },
    setProductDownload(state, action: PayloadAction<Partial<IProductDownload>>) {
      state.download = {
        ...state.download,
        ...action.payload,
      };
    },
    setProductCatelogue(state, action: PayloadAction<Partial<IProductCatelogue>>) {
      state.catelogue = {
        ...state.catelogue,
        ...action.payload,
      };
    },
    setProductList(state, action: PayloadAction<Partial<IProductList>>) {
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
