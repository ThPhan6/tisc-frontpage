import { getSpecificationWithSelectedValue } from '../components/ProductAttributes/hooks';
import { sortObjectArray } from '@/helper/utils';
import { isEmpty } from 'lodash';

import type {
  ProductItem,
  ProductList,
  ProductSummary,
  RelatedCollection,
  SortParams,
  SpecifiedDetail,
} from '../types';
import { ProductAttributeWithSubAdditionByType } from './../../../types/attribute.type';
import { OrderMethod, SpecificationAttributeGroup } from '@/features/project/types';
import { BrandDetail } from '@/features/user-group/types';
import { FinishScheduleResponse } from '@/pages/Designer/Project/tabs/ProductConsidered/SpecifyingModal/types';
import { RootState } from '@/reducers';
import { GeneralData, ProductIDType } from '@/types';

import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

interface ProductState {
  brand?: BrandDetail;
  summary?: ProductSummary;
  details: ProductItem & { referToDesignDocument?: boolean };
  brandSpecifiedDetails: ProductItem['specifiedDetail'] & { referToDesignDocument?: boolean };
  relatedProduct: RelatedCollection[];
  relatedProductOnView?: GeneralData & { relatedProductData?: RelatedCollection[] };
  list: ProductList;
  curAttrGroupCollapseId?: {
    [key: string]: string;
  };
  allPreSelectAttributes: SpecificationAttributeGroup[];

  attributeList: ProductAttributeWithSubAdditionByType;
}

const initialState: ProductState = {
  attributeList: {
    feature: [],
    general: [],
    specification: [],
  },
  allPreSelectAttributes: [],
  brandSpecifiedDetails: {
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
  details: {
    id: '',
    name: '',
    brand_id: '',
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
    product_information: {
      product_id: '',
      product_name: '',
    },
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
    ecoLabel: undefined,
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
          specifiedDetail.specification?.attribute_groups ?? [],
          state.details.specification_attribute_groups,
          true,
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

    /// save group selected for brand user can re-select after modifying
    setBrandSpecifiedPartialProductSpecifiedData: (
      state,
      action: PayloadAction<Partial<SpecifiedDetail>>,
    ) => {
      if (state.brandSpecifiedDetails) {
        state.brandSpecifiedDetails = {
          ...state.brandSpecifiedDetails,
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

    getAllPreSelectAttributes: (state, action: PayloadAction<SpecificationAttributeGroup[]>) => {
      state.allPreSelectAttributes = action.payload;
    },

    closeActiveSpecAttributeGroup: (state) => {
      state.curAttrGroupCollapseId = {
        ...state.curAttrGroupCollapseId,
        ['specification_attribute_groups']: '',
      };
    },

    setActualAttributeList: (
      state,
      action: PayloadAction<ProductAttributeWithSubAdditionByType>,
    ) => {
      state.attributeList = action.payload;
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
  setBrandSpecifiedPartialProductSpecifiedData,
  setFinishScheduleData,
  setCurAttrGroupCollapse,
  closeActiveSpecAttributeGroup,
  getAllPreSelectAttributes,
  setActualAttributeList,
} = productSlice.actions;

export const productReducer = productSlice.reducer;

export const productSpecificationSelector = (state: RootState) => {
  return state.product.details.specifiedDetail &&
    !isEmpty(state.product.details.specifiedDetail.specification?.attribute_groups)
    ? state.product.details.specifiedDetail.specification?.attribute_groups?.map(
        (attributeGroup: any) => {
          // const allNormalAttribute = state.product.details.specification_attribute_groups.reduce(
          //   (pre: any, cur) => {
          //     if (cur.type === 0) {
          //       return pre.concat(cur.attributes);
          //     }
          //     return pre;
          //   },
          //   [],
          // );
          // const newAttributes = attributeGroup.attributes?.map((attribute: any) => {
          //   const foundAttribute = allNormalAttribute.find((el: any) => el.id === attribute.id);
          //   return {
          //     ...attribute,
          //     ...foundAttribute,
          //     basis_options: foundAttribute?.basis_options.filter(
          //       (bo: any) => bo.id === attribute.basis_option_id,
          //     ),
          //   };
          // });
          const attrGroup = state.product.details.specification_attribute_groups.find(
            (group) => group.id === attributeGroup.id,
          );
          const found = state.product.details.specification_attribute_groups.find(
            (item) => item.id === attributeGroup.id,
          );
          const newViewSteps = found?.viewSteps?.map((viewStep: any) => {
            const foundSpecStep = found.specification_steps.find(
              (specStep: any) => specStep.id === viewStep.id,
            );
            const newOptions = viewStep?.options?.map((option: any) => {
              const foundOption = foundSpecStep?.options?.find(
                (specOption: any) => specOption.id === option.id,
              );
              return {
                ...option,
                id_format_type: foundOption?.id_format_type,
              };
            });
            return {
              ...viewStep,
              options: newOptions,
            };
          });

          return {
            ...attributeGroup,
            isChecked: true,
            attributes: attrGroup?.attributes,
            stepSelection: attributeGroup.step_selections,
            viewSteps: newViewSteps,
          };
        },
      )
    : state.product.details.specification_attribute_groups;
};

export const combineQuantityForStepSelection = (data: any) => {
  const selectIds = Object.keys(data);
  const combinedOptionQuantity = selectIds.reduce((pre: any, selectId: string) => {
    const parts = selectId.split(',');
    const last = parts[parts.length - 1];
    const lastParts = last.split('_');
    const optionId = lastParts[0];
    const quantity = data[selectId];
    return quantity > 0
      ? {
          ...pre,
          [optionId]: pre[optionId] ? pre[optionId] + quantity : quantity,
        }
      : pre;
  }, {});
  const optionIds = Object.keys(combinedOptionQuantity);
  return optionIds.map((optionId: string) => {
    return {
      id: optionId,
      quantity: combinedOptionQuantity[optionId],
    };
  });
};
export const productVariantsSelector = createSelector(productSpecificationSelector, (specGroup) => {
  let variants = '';
  specGroup?.forEach((el) => {
    if (!el.isChecked) {
      return;
    }

    let prevFormat = -1;
    el?.attributes?.forEach((attr: any) => {
      if (!attr?.basis_options?.find((opt: any) => opt.isChecked)) {
        if (attr?.basis_options !== undefined && attr?.basis_options?.length > 0 && !el.selection) {
          const curFormat =
            attr?.basis_options?.find((opt: any) => opt.option_code)?.id_format_type ?? 0;
          const seperator = prevFormat == 0 ? ', ' : curFormat == 0 ? ', ' : ' - ';
          prevFormat = curFormat;
          variants += (variants ? seperator : '') + 'X';
        }
      }
      attr?.basis_options?.forEach((opt: any) => {
        if (opt.isChecked) {
          const seperator = prevFormat == 0 ? ', ' : opt.id_format_type == 0 ? ', ' : ' - ';
          prevFormat = opt.id_format_type;
          variants += (variants ? seperator : '') + opt.option_code;
          return true;
        }
        return false;
      });
    });
    const viewStepAllOptions = el.viewSteps?.reduce((pre: any, cur: any) => {
      return pre.concat(
        cur.options.map((item: any, index: number) => ({
          id: item.id,
          product_id: item.product_id,
          id_format_type: item.id_format_type,
          order_key: `${cur.order}_${index}`,
        })),
      );
    }, []);
    // console.log('el.viewSteps: ', el.viewSteps);
    // For remove the items that not pair in the linkage data anymore
    const specificationAllOptions: string[] = el.viewSteps?.reduce((pre: any, cur: any) => {
      return pre.concat(cur.options.map((item: any) => item.id));
    }, []);
    const combinedQuantities = combineQuantityForStepSelection(
      el?.stepSelection?.quantities || [],
    ).map((item: any) => {
      const found = viewStepAllOptions?.find(
        (viewStepOption: any) =>
          viewStepOption.id === item.id && specificationAllOptions.includes(item.id),
      );
      return {
        ...item,
        product_id: found?.product_id,
        id_format_type: found?.id_format_type,
        order_key: found?.order_key,
      };
    });

    prevFormat = -1;
    sortObjectArray(combinedQuantities, 'order_key', 'asc')?.forEach((option: any) => {
      for (let q = 0; q < option.quantity; q++) {
        const seperator = prevFormat == 0 ? ', ' : option.id_format_type == 0 ? ', ' : ' - ';
        prevFormat = option.id_format_type;
        variants += (variants ? seperator : '') + option.product_id;
      }
    });
  });
  return variants;
});
