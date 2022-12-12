import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import { ProductDimensionWeight } from './types';

export function getDimensionWeightList() {
  return request<ProductDimensionWeight>('/api/setting/dimension-and-weight', {
    method: 'GET',
  })
    .then((res) => res)
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_DIMENSION_WEIGHT_ERROR);
      return {} as ProductDimensionWeight;
    });
}
