import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  IBrandDetail,
  IProductSummary,
  IProductTip,
  IProductDownload,
  IProductDetail,
  IRelatedCollection,
} from '@/types';

interface ProductState {
  brand?: IBrandDetail;
  summary?: IProductSummary;
  tips: IProductTip[];
  downloads: IProductDownload[];
  details: IProductDetail;
  relatedProduct: IRelatedCollection[];
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
  tips: [],
  downloads: [],
  relatedProduct: [],
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
    setProductTips(state, action: PayloadAction<IProductTip[]>) {
      state.tips = action.payload;
    },

    setProductDownloads(state, action: PayloadAction<IProductDownload[]>) {
      state.downloads = action.payload;
    },
  },
});

export const {
  setBrand,
  setProductSummary,
  setProductDetail,
  setPartialProductDetail,
  setProductDetailImage,
  setProductTips,
  setProductDownloads,
} = productSlice.actions;
export default productSlice.reducer;
