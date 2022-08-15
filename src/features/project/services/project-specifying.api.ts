import { getResponseMessage } from '@/helper/common';
import { SpecifyingProductRequestBody } from '@/pages/Designer/Project/tabs/ProductConsidered/SpecifyingModal/types';
import { GeneralData } from '@/types';
import { message } from 'antd';
import { request } from 'umi';
import { UnitType } from '../types/project-specifying.type';

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

export async function updateProductSpecifying(
  data: SpecifyingProductRequestBody,
  callback: () => void,
) {
  await request(`/api/specified-product/specify`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.error(getResponseMessage('update', 'product specifying'));
      callback();
    })
    .catch((error) => {
      message.error(getResponseMessage('update', 'product specifying', 'failed', error));
      console.log('getRequirementTypeList error', error);
    });
}
