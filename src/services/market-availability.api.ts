import type {
  DataTableResponse,
  PaginationRequestParams,
  PaginationResponse,
  SummaryResponse,
} from '@/components/Table/types';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import {
  AvailabilityCollectionGroup,
  MarketAvailabilityDataList,
  MarketAvailabilityDetails,
} from '@/types';
import { message } from 'antd';
import { request } from 'umi';

interface CategoryPaginationResponse {
  data: {
    collections: MarketAvailabilityDataList[];
    pagination: PaginationResponse;
    summary: SummaryResponse[];
  };
}

export async function getMarketAvailabilityList(
  params: PaginationRequestParams,
  callback: (data: DataTableResponse) => void,
) {
  request<CategoryPaginationResponse>(`/api/market-availability/get-list`, {
    method: 'GET',
    params,
  })
    .then((response) => {
      const { collections, pagination, summary } = response.data;
      callback({
        data: collections,
        pagination: {
          current: pagination.page,
          pageSize: pagination.page_size,
          total: pagination.total,
        },
        summary,
      });
    })
    .catch((error) => {
      message.error(
        error?.data?.message ?? MESSAGE_NOTIFICATION.GET_LIST_MARKET_AVAILABILITY_ERROR,
      );
    });
}

export async function getMarketAvailabilityByCollectionId(collectionId: string) {
  return request<{ data: MarketAvailabilityDetails }>(
    `/api/market-availability/get-one/${collectionId}`,
  )
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.GET_ONE_MARKET_AVAILABILITY_ERROR);
    });
}

export async function updateMarketAvailabilityByCollectionId(
  collectionId: string,
  countryIds: string[],
) {
  return request(`/api/market-availability/update/${collectionId}`, {
    method: 'PUT',
    data: {
      country_ids: countryIds,
    },
  })
    .then(() => {
      message.success(MESSAGE_NOTIFICATION.UPDATE_MARKET_AVAILABILITY_SUCCESS);
      return true;
    })
    .catch((error) => {
      message.error(error?.data?.message ?? MESSAGE_NOTIFICATION.UPDATE_MARKET_AVAILABILITY_ERROR);
      return false;
    });
}

export async function getAvailabilityListCountryGroupByBrandId(brandId: string) {
  return request<{ data: AvailabilityCollectionGroup[] }>(
    `/api/market-availability/get-list-group-by-collection/${brandId}`,
    {
      method: 'GET',
    },
  )
    .then((response) => response.data)
    .catch((error) => {
      message.error(
        error.message.data ?? MESSAGE_NOTIFICATION.GET_LIST_AVAILABILITY_GROUP_COLLECTION_ERROR,
      );
      return [] as AvailabilityCollectionGroup[];
    });
}
