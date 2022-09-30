import { message } from 'antd';
import { request } from 'umi';

import { getResponseMessage } from '@/helper/common';

import { UnitType } from '../types/project-specifying.type';
import { SpecifyingProductRequestBody } from '@/pages/Designer/Project/tabs/ProductConsidered/SpecifyingModal/types';
import { GeneralData } from '@/types';

export async function getUnitTypeList() {
  return request<{ data: UnitType[] }>(`/api/unit-type/get-list`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('getUnitTypeList error', error);
      return [] as UnitType[];
    });
}

export async function getInstructionTypeList() {
  return request<{ data: GeneralData[] }>(`/api/instruction-type/get-list`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('getInstructionTypeList error', error);
      return [] as GeneralData[];
    });
}

export async function getRequirementTypeList() {
  return request<{ data: GeneralData[] }>(`/api/requirement-type/get-list`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('getRequirementTypeList error', error);
      return [] as GeneralData[];
    });
}

export async function getFinishScheduleList() {
  return request<{ data: GeneralData[] }>(`/api/finish-schedule-for/get-list`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('getFinishScheduleList error', error);
      return [] as GeneralData[];
    });
}

export async function getProductSpecifying(consider_id: string) {
  return request<{ data: SpecifyingProductRequestBody }>(
    `/api/specified-product/get-one/${consider_id}`,
    { method: 'GET' },
  )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log('getInstructionTypeList error', error);
      return undefined;
    });
}

export async function updateProductSpecifying(
  { considered_product_id, ...data }: SpecifyingProductRequestBody,
  callback: () => void,
) {
  await request(`/api/project-product/${considered_product_id}/update-specify`, {
    method: 'POST',
    data: { ...data, quantity: Number(data.quantity) },
  })
    .then(() => {
      message.success(getResponseMessage('update', 'product specifying'));
      callback();
    })
    .catch((error) => {
      message.error(getResponseMessage('update', 'product specifying', 'failed', error));
      console.log('getRequirementTypeList error', error);
    });
}
