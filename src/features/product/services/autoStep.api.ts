import { message } from 'antd';
import { request } from 'umi';

import {
  AutoStepLinkedOptionResponse,
  AutoStepOnAttributeGroupResponse,
  AutoStepPreSelectOptionResponse,
} from '../types/autoStep';

export const getAutoStepData = (productId: string, specificationId: string) => {
  // showPageLoading();
  return request<{ data: AutoStepOnAttributeGroupResponse[] }>(`/api/step`, {
    method: 'GET',
    params: { product_id: productId, specification_id: specificationId },
  })
    .then((res) => {
      // hidePageLoading();
      return res.data;
    })
    .catch((err) => {
      // hidePageLoading();

      message.error(err?.data?.message ?? 'Failed to get step');
      return [] as AutoStepOnAttributeGroupResponse[];
    });
};

export const getLinkedOptionByOptionIds = (optionId: string, exceptOptionIds?: string) => {
  // showPageLoading();

  return request<{ data: AutoStepLinkedOptionResponse[] }>(`/api/linkage/rest-options`, {
    method: 'GET',
    params: { option_ids: optionId, except_option_ids: exceptOptionIds || undefined },
  })
    .then((res) => {
      // hidePageLoading();
      return res.data.map((el) => ({
        ...el,
        subs: el.subs.map((item) => ({
          ...item,
          subs: item.subs.map((sub) => ({
            ...sub,
            sub_id: item.id,
            sub_name: item.name,
            pre_option: optionId,
            replicate: sub?.replicate ?? 1,
          })),
        })),
      })) as AutoStepLinkedOptionResponse[];
    })
    .catch((err) => {
      // hidePageLoading();

      message.error(err?.data?.message ?? 'Failed to get rest options');
      return [] as AutoStepLinkedOptionResponse[];
    });
};

export const getPreSelectStep = (userId: string, productId: string, specificationId: string) => {
  return request<{ data: AutoStepPreSelectOptionResponse[] }>(`/api/step/configuration`, {
    method: 'GET',
    params: { user_id: userId, product_id: productId, specification_id: specificationId },
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      message.error(err?.data?.message ?? 'Failed to get pre select steps');
      return [] as AutoStepPreSelectOptionResponse[];
    });
};
