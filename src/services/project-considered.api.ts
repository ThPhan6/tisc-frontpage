import { message } from 'antd';
import { request } from 'umi';
import type {
  DataTableResponse,
  PaginationRequestParams,
  GetDataListResponse,
} from '@/components/Table/types';
import {
  ProjectSummaryData,
  ConsideredProduct,
  ProjectSpaceListProps,
  FindProductConsiderRequest,
  AssigningStatus,
} from '@/types';
import { getResponseMessage } from '@/helper/common';

export async function getProductAssignSpaceByProject(
  projectId: string,
  productId: string,
  callback: (isEntire: boolean, data: ProjectSpaceListProps[]) => void,
) {
  request(`/api/considered-product/get-list-assigned/${projectId}/${productId}`, {
    method: 'GET',
  })
    .then((response: { data: ProjectSpaceListProps[] }) => {
      console.log('response', response);
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
  request(`/api/considered-product/get-list/${projectId}`, {
    method: 'GET',
    params,
  })
    .then(
      (response: { data: GetDataListResponse & { considered_products: ConsideredProduct[] } }) => {
        const { considered_products, summary } = response.data;
        considered_products[0].id = 'entire_project';
        callback({
          data: considered_products,
          summary,
        });
      },
    )
    .catch((error) => {
      console.log('error', error);
      message.error(error.message);
    });
}

export async function assignProductToProject(data: {
  is_entire: boolean;
  product_id: string;
  project_id: string;
  project_zone_ids: string[];
}) {
  return request<ProjectSummaryData>(`/api/product/assign`, {
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
  product_id: string,
  data: FindProductConsiderRequest & {
    status: AssigningStatus;
  },
) {
  return request<ProjectSummaryData>(`/api/considered-product/update-status/${product_id}`, {
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

export async function removeProductFromProject(
  product_id: string,
  data: FindProductConsiderRequest,
) {
  return request<ProjectSummaryData>(`/api/considered-product/delete/${product_id}`, {
    method: 'DELETE',
    data,
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
