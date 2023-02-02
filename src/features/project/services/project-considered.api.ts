import { message } from 'antd';
import { request } from 'umi';

import { getResponseMessage } from '@/helper/common';

import type {
  DataTableResponse,
  GetDataListResponse,
  PaginationRequestParams,
} from '@/components/Table/types';
import {
  ConsideredProduct,
  ProductConsiderStatus,
  ProjectSpaceListProps,
  ProjectSummaryData,
} from '@/features/project/types';

import { hidePageLoading } from '@/features/loading/loading';

export async function getProductAssignSpaceByProject(
  projectId: string,
  productId: string,
  callback: (isEntire: boolean, data: ProjectSpaceListProps[]) => void,
) {
  request(`/api/project/${projectId}/product/${productId}/assign-zones`, {
    method: 'GET',
  })
    .then((response: { data: ProjectSpaceListProps[] }) => {
      const [entireProject, ...zones] = response.data;
      callback(entireProject.is_assigned || false, zones);
    })
    .catch((error) => {
      message.error(getResponseMessage('get-list', 'spaces by project', 'failed', error));
    });
}

export async function getConsideredProducts(
  { projectId, ...params }: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request(`/api/project/${projectId}/considered-product/get-list`, {
    method: 'GET',
    params,
  })
    .then((response: { data: GetDataListResponse & { data: ConsideredProduct[] } }) => {
      const { data, summary } = response.data;
      data[0].id = 'entire_project';
      callback({ data, summary });
    })
    .catch((error) => {
      console.log('error', error);
      hidePageLoading();
      message.error(error.message);
    });
}

export async function assignProductToProject(data: {
  product_id: string;
  project_id: string;
  entire_allocation: boolean;
  allocation: string[];
  custom_product: boolean;
}) {
  return request<ProjectSummaryData>(`/api/project/assign-product`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(getResponseMessage('assign', 'product'));
      return true;
    })
    .catch((error) => {
      console.log('assignProductToProject error', error);
      message.error(getResponseMessage('assign', 'product', 'failed', error));
      return false;
    });
}

export async function updateProductConsiderStatus(
  consider_id: string,
  data: {
    consider_status: ProductConsiderStatus;
  },
) {
  return request(`/api/project-product/${consider_id}/update-consider-status`, {
    method: 'PATCH',
    data,
  })
    .then(() => {
      message.success(getResponseMessage('update', 'consider status'));
      return true;
    })
    .catch((error) => {
      console.log('updateProductConsiderStatus error', error);
      message.error(getResponseMessage('update', 'consider status', 'failed', error));
      return false;
    });
}

export async function removeProductFromProject(consider_id: string) {
  return request(`/api/project-product/${consider_id}/delete`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(getResponseMessage('delete', 'product from project'));
      return true;
    })
    .catch((error) => {
      console.log('removeProductFromProject error', error);
      message.error(getResponseMessage('delete', 'product from project', 'failed', error));
      return false;
    });
}
