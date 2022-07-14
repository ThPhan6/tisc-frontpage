import { request } from 'umi';
import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type {
  IProductSummary,
  IProductFormData,
  IProductGetListParameter,
  IProductDetail,
  GroupProductList,
} from '@/types';
import { setProductSummary, setProductList } from '@/reducers/product';
import store from '@/reducers';

export async function getProductSummary(brandId: string) {
  return request<{ data: IProductSummary }>(`/api/product/brand-product-summary/${brandId}`, {
    method: 'GET',
  })
    .then((response) => {
      store.dispatch(setProductSummary(response.data));
    })
    .catch((error) => {
      store.dispatch(setProductSummary(undefined));
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_BRAND_SUMMARY_DATA_ERROR);
    });
}

export const createProductCard = async (data: IProductFormData) => {
  return request<{ data: IProductDetail }>(`/api/product/create`, {
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
export const getProductListByBrandId = async (params: IProductGetListParameter) => {
  return request<{ data: GroupProductList[] }>(`/api/product/get-list`, {
    method: 'GET',
    params,
  })
    .then((res) => {
      store.dispatch(setProductList(res.data));
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_PRODUCT_BY_BRAND_ERROR);
    });
};
