import { getSpecificationWithSelectedValue } from '../components/ProductAttributes/hooks';

import type {
  ProductItem,
  ProductList,
  ProductSummary,
  RelatedCollection,
  SortParams,
  SpecifiedDetail,
} from '../types';
import {
  AutoStepPreSelectLinkedOptionResponse,
  AutoStepPreSelectOnAttributeGroupResponse,
  AutoStepPreSelectOptionResponse,
} from '../types/autoStep';
import { OrderMethod } from '@/features/project/types';
import { BrandDetail } from '@/features/user-group/types';
import { FinishScheduleResponse } from '@/pages/Designer/Project/tabs/ProductConsidered/SpecifyingModal/types';
import { RootState } from '@/reducers';
import { GeneralData } from '@/types';

import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

interface ProductState {
  brand?: BrandDetail;
  summary?: ProductSummary;
  details: ProductItem & { referToDesignDocument?: boolean };
  relatedProduct: RelatedCollection[];
  relatedProductOnView?: GeneralData & { relatedProductData?: RelatedCollection[] };
  list: ProductList;
  curAttrGroupCollapseId?: {
    [key: string]: string;
  };
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
    dimension_and_weight: {
      id: '',
      name: '',
      with_diameter: false,
      attributes: [],
    },
    categories: [],
    collections: [],
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
    tips: [],
    downloads: [],
    catelogue_downloads: [],
  },
  relatedProduct: [],
  list: {
    data: [],
    pagination: {
      current: 1,
      pageSize: 20,
      total: 0,
      pageCount: 1,
    },
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
    setProductList(state, action: PayloadAction<Partial<ProductList>>) {
      state.list = {
        ...state.list,
        ...action.payload,
      };
    },
    setRelatedProduct(state, action: PayloadAction<RelatedCollection[]>) {
      state.relatedProduct = action.payload;
    },
    onShowRelatedProductByCollection(
      state,
      action?: PayloadAction<GeneralData & { relatedProductData: RelatedCollection[] }>,
    ) {
      state.relatedProductOnView = action?.payload ?? { id: '', name: '', relatedProductData: [] };
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
    setCurAttrGroupCollapse: (state, action: PayloadAction<{ [key: string]: string }>) => {
      state.curAttrGroupCollapseId = { ...state.curAttrGroupCollapseId, ...action.payload };
    },

    closeActiveSpecAttributeGroup: (state) => {
      state.curAttrGroupCollapseId = {
        ...state.curAttrGroupCollapseId,
        ['specification_attribute_groups']: '',
      };
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
  setProductList,
  setRelatedProduct,
  onShowRelatedProductByCollection,
  setProductListSearchValue,
  setProductListSorter,
  resetProductDetailState,
  setReferToDesignDocument,
  onCheckReferToDesignDocument,
  setDefaultSelectionFromSpecifiedData,
  setPartialProductSpecifiedData,
  setFinishScheduleData,
  setCurAttrGroupCollapse,
  closeActiveSpecAttributeGroup,
} = productSlice.actions;

export const productReducer = productSlice.reducer;

const productSpecificationSelector = (state: RootState) =>
  state.product.details.specification_attribute_groups;

export const productVariantsSelector = createSelector(productSpecificationSelector, (specGroup) => {
  let variants = '';

  console.log('specGroup', specGroup);

  specGroup.forEach((el) => {
    if (!el.isChecked) {
      return;
    }

    el?.attributes?.forEach((attr) => {
      attr.basis_options?.forEach((opt) => {
        if (opt.isChecked) {
          const dash = opt.option_code === '' ? '' : ' - ';
          variants += opt.option_code + dash;
          return true;
        }
        return false;
      });
    });

    (el?.steps as AutoStepPreSelectOnAttributeGroupResponse[])?.forEach((step) => {
      step?.options?.forEach((option) => {
        for (let q = 0; q < option.quantity; q++) {
          const dash = option.product_id === '' ? '' : ' - ';
          variants += option.product_id + dash;
        }
      });
    });
  });

  return variants.length > 2 ? variants.slice(0, -2) : variants;
});
