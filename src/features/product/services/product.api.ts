import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import {
  setProductDetail,
  setProductList,
  setProductSummary,
  setRelatedProduct,
} from '../reducers/slices';
import {
  BrandSummary,
  GetListProductForDesignerRequestParams,
  GroupProductList,
  ProductFormData,
  ProductGetListParameter,
  ProductItem,
  ProductItemValue,
  ProductSummary,
  RelatedCollection,
} from '../types';
import { SelectSpecificationBodyRequest } from '@/features/project/types';
import { BrandDetail } from '@/features/user-group/types';
import store from '@/reducers';

import { ShareViaEmailForm } from '@/components/ShareViaEmail';

export async function getProductSummary(brandId: string) {
  return request<{ data: ProductSummary }>(`/api/product/brand-product-summary/${brandId}`, {
    method: 'GET',
  })
    .then((response) => {
      store.dispatch(
        setProductSummary({
          ...response.data,
          brandId,
        }),
      );
    })
    .catch((error) => {
      store.dispatch(setProductSummary(undefined));
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_SUMMARY_DATA_ERROR);
    });
}

export const createProductCard = async (data: ProductFormData) => {
  return request<{ data: ProductItem }>(`/api/product/create`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_PRODUCT_SUCCESS);
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_SUMMARY_DATA_ERROR);
    });
};

export const getProductListByBrandId = async (params: ProductGetListParameter) => {
  return request<{ data: { data: GroupProductList[]; brand: BrandDetail } }>(
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
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_PRODUCT_BY_BRAND_ERROR);
    });
};

export const getProductListForDesigner = async (params: GetListProductForDesignerRequestParams) => {
  return request<{ data: GroupProductList[]; brand_summary?: BrandSummary }>(
    `/api/product/design/get-list`,
    {
      method: 'GET',
      params,
    },
  )
    .then(({ data, brand_summary }) => {
      store.dispatch(setProductList({ data, brandSummary: brand_summary }));
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_PRODUCT_BY_BRAND_ERROR);
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

export const getProductById = async (productId: string) => {
  return request<{ data: ProductItem }>(`/api/product/get-one/${productId}`, {
    method: 'GET',
  })
    .then((res) => {
      store.dispatch(
        setProductDetail({
          ...res.data,
          keywords: [0, 1, 2, 3].map((index) => {
            return res.data.keywords[index] ?? '';
          }) as ['', '', '', ''],
        }),
      );
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_PRODUCT_ERROR);
    });
};

export const updateProductCard = async (productId: string, data: ProductFormData) => {
  return request<{ data: ProductItem }>(`/api/product/update/${productId}`, {
    method: 'PUT',
    data,
  })
    .then((res) => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_PRODUCT_SUCCESS);
      return res.data;
    })
    .catch((error) => {
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

export async function getSharingGroups() {
  return request<{ data: ProductItemValue[] }>(`/api/product/sharing-groups`, { method: 'GET' })
    .then((res) => res.data)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_SHARING_GROUPS_ERROR);
      return [] as ProductItemValue[];
    });
}

export async function getSharingPurposes() {
  return request<{ data: ProductItemValue[] }>(`/api/product/sharing-purposes`, { method: 'GET' })
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
      console.log('success');
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? 'Select Specification failed!');
      return false;
    });
}

export async function getSelectedProductSpecification(productId: string) {
  return request<{ data: SelectSpecificationBodyRequest }>(
    `/api/product/${productId}/select-specification/get-list`,
    {
      method: 'GET',
    },
  )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.log('getSelectedProductSpecification error', error);
      return undefined;
    });
}
