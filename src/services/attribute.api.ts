import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { message } from 'antd';
import { request } from 'umi';

import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import { setActualAttributeList } from '@/features/product/reducers';
import store from '@/reducers';
import type {
  AttributeContentType,
  AttributeForm,
  AttributeListResponse,
  ICreateAttributeRequest,
  IUpdateAttributeRequest,
  ProductAttributeByType,
  ProductAttributeWithSubAdditionByType,
} from '@/types';
import { EGetAllAttributeType } from '@/types';

import { hidePageLoading } from '@/features/loading/loading';

interface CategoryPaginationResponse {
  data: {
    attributes: AttributeListResponse[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}
export async function getProductAttributePagination(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  if (!params) {
    message.error('Something went wrong');
    return;
  }

  const newParams = { ...params };
  let attributeOrderIndex = -1;
  let contentTypeOrderIndex = -1;

  Object.keys(params).map((key, index) => {
    if (key === 'attribute_order') {
      attributeOrderIndex = index;
    }

    if (key === 'content_type_order') {
      contentTypeOrderIndex = index;
    }
  });

  if (attributeOrderIndex !== -1 && contentTypeOrderIndex !== -1) {
    /// keep content type order
    if (attributeOrderIndex > contentTypeOrderIndex) {
      newParams.content_type_order =
        (params?.attribute_order === 'ASC' && params?.content_type_order === 'DESC') ||
        (params?.attribute_order === 'DESC' && params?.content_type_order === 'ASC')
          ? 'ASC'
          : 'DESC';

      delete newParams?.attribute_order;

      /// keep attribute order
    } else {
      newParams.attribute_order =
        (params?.attribute_order === 'ASC' && params?.content_type_order === 'DESC') ||
        (params?.attribute_order === 'DESC' && params?.content_type_order === 'ASC')
          ? 'DESC'
          : 'ASC';

      delete newParams?.content_type_order;
    }
  }

  request(`/api/attribute/get-list`, {
    method: 'GET',
    params: newParams,
  })
    .then((response: CategoryPaginationResponse) => {
      const { attributes, pagination, summary } = response.data;
      callback({
        data: attributes,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary,
      });
    })
    .catch((error) => {
      console.log('error', error);
      hidePageLoading();
      message.error(error.message);
    });
}

export async function getProductAttributeContentType() {
  return request<{ data: AttributeContentType }>(`/api/attribute/content-type/get-list`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error.message);
    });
}

export async function createAttribute(data: ICreateAttributeRequest) {
  return request<boolean>(`/api/attribute/create`, {
    method: 'POST',
    data,
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.CREATE_ATTRIBUTE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.CREATE_ATTRIBUTE_ERROR);
      return false;
    });
}
export async function getOneAttribute(id: string) {
  return request<{ data: AttributeForm }>(`/api/attribute/get-one/${id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_ATTRIBUTE_ERROR);
    });
}
export async function updateAttribute(id: string, data: IUpdateAttributeRequest) {
  return request<{ data: AttributeForm }>(`/api/attribute/update/${id}`, {
    method: 'PUT',
    data,
  })
    .then((res) => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_ATTRIBUTE_SUCCESS);
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_ATTRIBUTE_ERROR);
      return {} as AttributeForm;
    });
}
export async function deleteAttribute(id: string) {
  return request<boolean>(`/api/attribute/delete/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.DELETE_ATTRIBUTE_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.DELETE_ATTRIBUTE_ERROR);
      return false;
    });
}

export async function getAllAttribute(type: EGetAllAttributeType, brandId?: string) {
  const url = brandId
    ? `/api/attribute/get-all?brand_id=${brandId}&add_sub=${type === EGetAllAttributeType.ADD_SUB}`
    : `/api/attribute/get-all?add_sub=${type === EGetAllAttributeType.ADD_SUB}`;

  return request<{ data: ProductAttributeWithSubAdditionByType | ProductAttributeByType }>(url)
    .then((response) => {
      if (brandId) {
        store.dispatch(
          setActualAttributeList(response.data as ProductAttributeWithSubAdditionByType),
        );
      }

      return response.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ATTRRIBUTE_DATA_FAILED);
      return {
        general: [],
        feature: [],
        specification: [],
      } as ProductAttributeWithSubAdditionByType;
    });
}
