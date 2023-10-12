import { COMMON_TYPES } from '@/constants/util';
import { message } from 'antd';
import { request } from 'umi';

import { getResponseMessage } from '@/helper/common';
import { clone } from 'lodash';

import { UnitType } from '../types/project-specifying.type';
import { setFinishScheduleData } from '@/features/product/reducers';
import {
  FinishScheduleResponse,
  SpecifyingProductRequestBody,
} from '@/pages/Designer/Project/tabs/ProductConsidered/SpecifyingModal/types';
import store from '@/reducers';
import { GeneralData } from '@/types';

import { updateCustomProductSpecifiedDetail } from '@/pages/Designer/Products/CustomLibrary/slice';

export async function getUnitTypeList() {
  return request<{ data: UnitType[] }>(`/api/setting/common-type/${COMMON_TYPES.PROJECT_UNIT}`, {
    method: 'GET',
  })
    .then((response) => {
      const units = clone(response.data);
      const onTopUnitIndex = units.findIndex((el) => el.name.trim().includes('Not Applicable'));
      if (onTopUnitIndex !== -1) {
        const onTopUnit = units.splice(onTopUnitIndex, 1);
        units.unshift(onTopUnit[0]);
      }
      return units;
    })
    .catch((error) => {
      // console.log('getUnitTypeList error', error);
      return [] as UnitType[];
    });
}

export async function getInstructionTypeList() {
  return request<{ data: GeneralData[] }>(
    `/api/setting/common-type/${COMMON_TYPES.PROJECT_INSTRUCTION}`,
    {
      method: 'GET',
    },
  )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      // console.log('getInstructionTypeList error', error);
      return [] as GeneralData[];
    });
}

export async function getRequirementTypeList() {
  return request<{ data: GeneralData[] }>(
    `/api/setting/common-type/${COMMON_TYPES.PROJECT_REQUIREMENT}`,
    {
      method: 'GET',
    },
  )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      // console.log('getRequirementTypeList error', error);
      return [] as GeneralData[];
    });
}

export async function getFinishScheduleList(
  projectProductId: string,
  roomIds: string[] | string,
  customProduct?: boolean,
) {
  request<{ data: FinishScheduleResponse[] }>(
    `/api/project-product/${projectProductId}/finish-schedules`,
    {
      method: 'GET',
      params: { roomIds },
    },
  )
    .then((response) => {
      if (customProduct) {
        store.dispatch(updateCustomProductSpecifiedDetail({ finish_schedules: response.data }));
      } else {
        store.dispatch(setFinishScheduleData(response.data));
      }
    })
    .catch((error) => {
      // console.log('getFinishScheduleList error', error);
      return [] as FinishScheduleResponse[];
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
      // console.log('getInstructionTypeList error', error);
      return undefined;
    });
}

export async function updateProductSpecifying(
  { considered_product_id, ...data }: SpecifyingProductRequestBody,
  callback: () => void,
) {
  await request(`/api/project-product/${considered_product_id}/update-specify`, {
    method: 'PATCH',
    data: { ...data, quantity: Number(data.quantity) },
  })
    .then(() => {
      message.success(getResponseMessage('update', 'product specifying'));
      callback();
    })
    .catch((error) => {
      message.error(getResponseMessage('update', 'product specifying', 'failed', error));
      // console.log('updateProductSpecifying error', error);
    });
}
