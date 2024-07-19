import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import type { Label, LabelInput } from '@/types';

export async function getLabels(brandId: string) {
  return request<{ data: Label[] }>(`/api/label/get-list/${brandId}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LABEL_ERROR);
      return [] as Label[];
    });
}

export async function createLabel(data: LabelInput) {
  return request<{ data: Label }>(`/api/label/create`, {
    method: 'POST',
    data,
  })
    .then((res) => {
      message.success(MESSAGE_NOTIFICATION.CREATE_LABEL_SUCCESS);

      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_LABEL_ERROR);
      return {} as Label;
    });
}

export async function updateLabel(labelId: string, props: LabelInput) {
  return request(`/api/label/update/${labelId}`, {
    method: 'PATCH',
    data: props,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_LABEL_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_LABEL_ERROR);
      return false;
    });
}
export async function deleteLabel(id: string) {
  return request(`/api/label/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_LABEL_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_LABEL_ERROR);
      return false;
    });
}
