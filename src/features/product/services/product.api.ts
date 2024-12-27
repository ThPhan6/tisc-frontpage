import { useCallback } from 'react';

import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { COMMON_TYPES, QUERY_KEY } from '@/constants/util';
import { message } from 'antd';
// import { TablePaginationConfig } from 'antd/es/table/interface';
import { request } from 'umi';

import { debounce, isEmpty, isNil } from 'lodash';

import {
  setPartialProductDetail,
  setProductList,
  setProductSummary,
  setRelatedProduct,
} from '../reducers/product';
import {
  BrandSummary,
  GetListProductForDesignerRequestParams,
  GroupProductList,
  ProductAttributeFormInput,
  ProductFormData,
  ProductGetListParameter,
  ProductItem,
  ProductItemValue,
  ProductSummary,
  RelatedCollection,
  SpecificationType,
} from '../types';
// import { AutoStepOnAttributeGroupResponse } from '../types/autoStep';
import { PaginationResponse } from '@/components/Table/types';
import { SelectSpecificationBodyRequest } from '@/features/project/types';
import { BrandDetail } from '@/features/user-group/types';
import store from '@/reducers';

import { ShareViaEmailForm } from '@/components/ShareViaEmail';

// import { getAutoStepData } from './autoStep.api';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

export async function getProductSummary(brandId: string, isGetTotalProduct?: boolean) {
  const url = !isNil(isGetTotalProduct)
    ? `/api/product/brand-product-summary/${brandId}?is_get_total_product=${isGetTotalProduct}`
    : `/api/product/brand-product-summary/${brandId}`;

  return request<{ data: ProductSummary }>(url, {
    method: 'GET',
  })
    .then((response) => {
      store.dispatch(
        setProductSummary({
          ...response.data,
          brandId,
        }),
      );

      return response.data;
    })
    .catch((error) => {
      store.dispatch(setProductSummary(undefined));
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_SUMMARY_DATA_ERROR);
      return {} as ProductSummary;
    });
}

export const createProductCard = async (data: ProductFormData) => {
  showPageLoading();
  return request<{ data: ProductItem }>(`/api/product/create`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      hidePageLoading();
      message.success(MESSAGE_NOTIFICATION.CREATE_PRODUCT_SUCCESS);
      return res.data;
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_SUMMARY_DATA_ERROR);
    });
};

export const getProductListByBrandId = async (params: ProductGetListParameter) => {
  showPageLoading();
  return await request<{ data: { data: GroupProductList[]; brand: BrandDetail } }>(
    `/api/product/get-list`,
    {
      method: 'GET',
      params,
    },
  )
    .then(({ data }) => {
      store.dispatch(
        setProductList({
          data: data.data.map((group) => {
            return {
              ...group,
              products: group.products.map((product) => {
                return {
                  ...product,
                  brand: data.brand,
                };
              }),
            };
          }),
        }),
      );
      hidePageLoading();
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_PRODUCT_BY_BRAND_ERROR);
    });
};

export const getBrandProductListByBrandId = async (params: ProductGetListParameter) => {
  showPageLoading();
  return await request<{ data: { data: GroupProductList[]; brand: BrandDetail } }>(
    `/api/product/brand/get-list`,
    {
      method: 'GET',
      params,
    },
  )
    .then(({ data }) => {
      hidePageLoading();
      store.dispatch(
        setProductList({
          data: data.data.map((group) => {
            return {
              ...group,
              products: group.products?.map((product) => {
                return {
                  ...product,
                  brand: data?.brand,
                };
              }),
            };
          }),
        }),
      );
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_PRODUCT_BY_BRAND_ERROR);
    });
};

export const getProductListForDesigner = async (
  params: GetListProductForDesignerRequestParams,
  props?: { isConcat?: boolean },
) => {
  if (params.brand_id || params.category_id) showPageLoading();
  return request<{
    data?: GroupProductList[];
    brand_summary?: BrandSummary;
    allProducts?: ProductItem[];
    pagination?: PaginationResponse;
  }>(`/api/product/design/get-list`, {
    method: 'GET',
    params,
  })
    .then(({ data, brand_summary, allProducts, pagination }) => {
      const newPagination = {
        current: pagination?.page || 1,
        pageSize: pagination ? pagination.page_size : params.pageSize || 20,
        total: pagination?.total || 0,
        pageCount: pagination?.page_count || 0,
      };

      const oldProducts = store.getState().product.list.allProducts;

      if (props?.isConcat) {
        store.dispatch(
          setProductList({
            data,
            brandSummary: brand_summary,
            allProducts: oldProducts?.concat(allProducts ?? []),
            pagination: newPagination,
          }),
        );
      } else {
        store.dispatch(
          setProductList({
            data,
            brandSummary: brand_summary,
            allProducts,
            pagination: newPagination,
          }),
        );
      }
      if (params.brand_id || params.category_id) hidePageLoading();
      return { allProducts, pagination: newPagination };
    })
    .catch((error) => {
      if (params.brand_id || params.category_id) hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_PRODUCT_BY_BRAND_ERROR);
      return {
        allProducts: [],
        pagination: { current: 1, pageSize: 20, total: 0, pageCount: 1 },
      };
    });
};

export const deleteProductById = async (productId: string) => {
  return request(`/api/product/delete/${productId}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_PRODUCT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_PRODUCT_ERROR);
      return false;
    });
};
export const duplicateProductById = async (productId: string) => {
  return request(`/api/product/duplicate/${productId}`, {
    method: 'POST',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DUPLICATE_PRODUCT_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DUPLICATE_PRODUCT_ERROR);
      return false;
    });
};
export const likeProductById = async (productId: string) => {
  return request(`/api/product/like/${productId}`, {
    method: 'POST',
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

export const getProductById = async (
  productId: string,
  props?: { isSpecified?: boolean; isAssignModal?: boolean; isDetail?: boolean },
) => {
  if (!props?.isAssignModal) showPageLoading();
  return await request<{ data: ProductItem }>(`/api/product/get-one/${productId}`, {
    method: 'GET',
  })
    .then((res) => {
      const specifiedData = store.getState().product.details?.specifiedDetail;
      const isProductSpecified = !!specifiedData?.id && !!props?.isSpecified;

      const specifiedConfigurationSteps =
        specifiedData?.specification?.attribute_groups.filter(
          (el) => el.configuration_steps?.length,
        ) ?? [];

      const newAttributeGroup: ProductAttributeFormInput[] = [];
      res.data.specification_attribute_groups.forEach((attr) => {
        const newRes = attr?.specification_steps?.length ? [...attr.specification_steps] : [];

        const currentSpecifiedConfigurationSteps = isProductSpecified
          ? specifiedConfigurationSteps.find(
              (configurationStep) => configurationStep.id === attr.id,
            )
          : { configuration_steps: [] };

        const isMappingQuantity = isProductSpecified
          ? !!currentSpecifiedConfigurationSteps?.configuration_steps?.length
          : !!attr?.configuration_steps?.length;

        /// mapping quantity
        if (isMappingQuantity && !!newRes.length) {
          (isProductSpecified
            ? currentSpecifiedConfigurationSteps?.configuration_steps
            : attr.configuration_steps
          )?.forEach((el) => {
            if (!attr?.specification_steps?.length) {
              return;
            }

            attr?.specification_steps?.forEach((opt, index) => {
              if (!opt.options.length || el.step_id !== opt.id) {
                return;
              }

              newRes[index] = {
                ...opt,
                options: opt.options.map((optionItem) => {
                  if (index === 0) {
                    return {
                      ...optionItem,
                      quantity: el.options.some((o) => o.id === optionItem.id) ? 1 : 0,
                      yours: optionItem.replicate ?? 0,
                    };
                  }

                  const optionFound = el.options.find(
                    (o) => o.id === optionItem.id && optionItem.pre_option === o.pre_option,
                  );

                  return {
                    ...optionItem,
                    quantity: optionFound ? optionFound.quantity : 0,
                    yours: optionItem.replicate ?? 0,
                  };
                }),
              };
            });
          });
        }
        if (attr.type === SpecificationType.attribute || attr.attributes?.length) {
          newAttributeGroup.push({ ...attr, type: attr.type ?? SpecificationType.attribute });
        } else if (attr.type === SpecificationType.autoStep || newRes.length) {
          const quantities = specifiedData?.specification.attribute_groups.find(
            (el) => el.id === attr.id,
          )?.step_selections?.quantities;
          const newViewSteps = attr.viewSteps.map((viewStep: any) => {
            const foundSpecStep = attr.specification_steps.find(
              (specStep: any) => specStep.id === viewStep.id,
            );
            const newOptions = viewStep?.options.map((option: any) => {
              const foundOption = foundSpecStep.options.find(
                (specOption: any) => specOption.id === option.id,
              );
              return {
                ...option,
                id_format_type: foundOption.id_format_type,
              };
            });
            return {
              ...viewStep,
              options: newOptions,
            };
          });
          newAttributeGroup.push({
            ...attr,
            viewSteps: newViewSteps,
            steps: newRes,
            isChecked: !props?.isSpecified
              ? !isEmpty(attr?.stepSelection?.quantities)
              : !isEmpty(quantities),
            type: attr.type ?? SpecificationType.autoStep,
          });
        }
      });

      store.dispatch(
        setPartialProductDetail({
          ...res.data,
          specification_attribute_groups: newAttributeGroup,
          catelogue_downloads: (res.data.brand as any)?.catelogue_downloads,
          keywords: [0, 1, 2, 3].map((index) => {
            return res.data.keywords[index] ?? '';
          }) as ['', '', '', ''],
        }),
      );
      if (!props?.isAssignModal) hidePageLoading();
    })
    .catch((error) => {
      if (!props?.isAssignModal) hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_PRODUCT_ERROR);
      return {} as ProductItem;
    });
};

export const updateProductCard = async (productId: string, data: ProductFormData) => {
  showPageLoading();

  return request<{ data: ProductItem }>(`/api/product/update/${productId}`, {
    method: 'PUT',
    data,
  })
    .then((res) => {
      hidePageLoading();
      // getProductById(productId);

      // const attributeGroupId = store.getState().product.curAttrGroupCollapseId;
      // const currentSpecAttributeGroupId = attributeGroupId?.['specification_attribute_groups'];

      // const isGroupStep = data.specification_attribute_groups.some(
      //   (group) => group.id === currentSpecAttributeGroupId && group.steps?.length,
      // );

      // let autoStepData: AutoStepOnAttributeGroupResponse[] = [];

      // if (isGroupStep) {
      //   autoStepData = currentSpecAttributeGroupId
      //     ? await getAutoStepData(productId, currentSpecAttributeGroupId)
      //     : [];
      // }

      // const newSpecificationAttributeGroup = res.data.specification_attribute_groups.map((el) =>
      //   autoStepData?.length ? { ...el, steps: autoStepData } : el,
      // );
      store.dispatch(
        setPartialProductDetail({
          ecoLabel: res.ecoLabel,
        }),
      );

      message.success(MESSAGE_NOTIFICATION.UPDATE_PRODUCT_SUCCESS);

      return res.data;

      // return { ...res.data, specification_attribute_groups: newSpecificationAttributeGroup };
    })
    .catch((error) => {
      hidePageLoading();
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_PRODUCT_ERROR);
      return undefined;
    });
};

export async function getRelatedCollectionProducts(productId: string) {
  return request<{ data: RelatedCollection[] }>(
    `/api/product/get-list-rest-collection-product/${productId}`,
    {
      method: 'GET',
    },
  )
    .then((response) => {
      store.dispatch(setRelatedProduct(response.data));
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_SUMMARY_DATA_ERROR);
    });
}

/// Share Via Email
export async function getSharingGroups() {
  return request<{ data: ProductItemValue[] }>(
    `/api/setting/common-type/${COMMON_TYPES.SHARING_GROUP}`,
    { method: 'GET' },
  )
    .then((res) => res.data)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_SHARING_GROUPS_ERROR);
      return [] as ProductItemValue[];
    });
}

export async function getSharingPurposes() {
  return request<{ data: ProductItemValue[] }>(
    `/api/setting/common-type/${COMMON_TYPES.SHARING_PURPOSE}`,
    { method: 'GET' },
  )
    .then((res) => res.data)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_SHARING_PURPOSES_ERROR);
      return [] as ProductItemValue[];
    });
}

export async function createShareViaEmail(data: ShareViaEmailForm) {
  return request<boolean>(`/api/product/share-via-email`, { method: 'POST', data })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_SHARE_VIA_EMAIL_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_SHARE_VIA_EMAIL_ERROR);
      return false;
    });
}

export async function selectProductSpecification(
  productId: string,
  data: Partial<SelectSpecificationBodyRequest>,
) {
  return request<boolean>(`/api/product/${productId}/select-specification/update`, {
    method: 'POST',
    data,
  })
    .then(() => {
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? 'Select Specification failed!');
      return false;
    });
}

export const useSelectProductSpecification = () => {
  const debounceSelectProductSpecification = useCallback(
    debounce(
      (productId: string, data: Partial<SelectSpecificationBodyRequest>) =>
        selectProductSpecification(productId, data),
      500,
    ),
    [],
  );
  return debounceSelectProductSpecification;
};

export async function getSelectedProductSpecification(
  productId: string,
  projectProductId?: string,
) {
  const url = projectProductId
    ? `/api/product/${productId}/select-specification/get-list?${QUERY_KEY.project_product_id}=${projectProductId}`
    : `/api/product/${productId}/select-specification/get-list`;

  return request<{ data: SelectSpecificationBodyRequest }>(url, {
    method: 'GET',
  })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? 'getSelectedProductSpecification error!');
      return undefined;
    });
}
