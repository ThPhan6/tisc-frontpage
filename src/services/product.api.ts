import { MESSAGE_NOTIFICATION } from '@/constants/message';
import store from '@/reducers';
import {
  setProductDetail,
  setProductList,
  setProductSummary,
  setRelatedProduct,
} from '@/reducers/product';
import type {
  GroupProductList,
  BrandDetail,
  ProductFormData,
  ProductGetListParameter,
  ProductSummary,
  RelatedCollection,
  ProductItem,
  GetListProductForDesignerRequestParams,
} from '@/types';
import { message } from 'antd';
import { request } from 'umi';

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

//
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

//
export const getProductListForDesigner = async (params: GetListProductForDesignerRequestParams) => {
  return request<{ data: GroupProductList[] }>(`/api/product/design/get-list`, {
    method: 'GET',
    params,
  })
    .then(({ data }) => {
      store.dispatch(setProductList({ data }));
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
      console.log(res.data);

      message.success(MESSAGE_NOTIFICATION.UPDATE_PRODUCT_SUCCESS);
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_PRODUCT_ERROR);
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
