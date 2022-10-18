import { getSpecificationWithSelectedValue } from '../components/ProductAttributes/hooks';

import type {
  ProductCatelogue,
  ProductDownload,
  ProductItem,
  ProductList,
  ProductSummary,
  ProductTip,
  RelatedCollection,
  SortParams,
  SpecifiedDetail,
} from '../types';
import { OrderMethod } from '@/features/project/types';
import { BrandDetail } from '@/features/user-group/types';
import { FinishScheduleResponse } from '@/pages/Designer/Project/tabs/ProductConsidered/SpecifyingModal/types';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface ProductState {
  brand?: BrandDetail;
  summary?: ProductSummary;
  tip: ProductTip;
  download: ProductDownload;
  catelogue: ProductCatelogue;
  details: ProductItem & { referToDesignDocument?: boolean };
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
    brand_location_id: '',
    distributor_location_id: '',
    specifiedDetail: {
      id: '',
      material_code: '',
      product_id: '',
      project_id: '',
      specification: {
        is_refer_document: true,
        attribute_groups: [],
      },
      brand_location_id: '',
      distributor_location_id: '',
      entire_allocation: true,
      allocation: [],
      material_code_id: '',
      suffix_code: '',
      description: '',
      quantity: 0,
      unit_type_id: '',
      order_method: OrderMethod['Direct Purchase'],
      requirement_type_ids: [],
      instruction_type_ids: [],
      finish_schedules: [],
      special_instructions: '',
    },
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
    setReferToDesignDocument(state, action: PayloadAction<boolean>) {
      state.details.referToDesignDocument = action.payload;
    },
    onCheckReferToDesignDocument: (state) => {
      state.details.referToDesignDocument = true;
      state.details.specification_attribute_groups =
        state.details.specification_attribute_groups.map((group) => ({
          ...group,
          isChecked: false,
          attributes: group.attributes.map((attr) => ({
            ...attr,
            basis_options: attr?.basis_options?.map((otp) => ({ ...otp, isChecked: false })),
          })),
        }));
    },
    setDefaultSelectionFromSpecifiedData: (state) => {
      const specifiedDetail = state.details.specifiedDetail;
      if (specifiedDetail) {
        state.details.specification_attribute_groups = getSpecificationWithSelectedValue(
          specifiedDetail.specification.attribute_groups,
          state.details.specification_attribute_groups,
        );
        state.details.brand_location_id = specifiedDetail.brand_location_id;
        state.details.distributor_location_id = specifiedDetail.distributor_location_id;
      }
    },
    setPartialProductSpecifiedData: (state, action: PayloadAction<Partial<SpecifiedDetail>>) => {
      if (state.details.specifiedDetail) {
        state.details.specifiedDetail = {
          ...state.details.specifiedDetail,
          ...action.payload,
        };
      }
    },
    setFinishScheduleData: (state, action: PayloadAction<FinishScheduleResponse[]>) => {
      if (state.details.specifiedDetail) {
        state.details.specifiedDetail.finish_schedules = [...action.payload];
      }
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
  setReferToDesignDocument,
  onCheckReferToDesignDocument,
  setDefaultSelectionFromSpecifiedData,
  setPartialProductSpecifiedData,
  setFinishScheduleData,
} = productSlice.actions;

export const productReducer = productSlice.reducer;
