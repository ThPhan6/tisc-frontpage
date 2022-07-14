import type {
  IDataTableResponse,
  IPaginationRequest,
  IPaginationResponse,
  ISummaryResponse,
} from '@/components/Table/types';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import { IMarketAvailabilityForm } from '@/types';
import { message } from 'antd';
import { request } from 'umi';

interface ICategoryPaginationResponse {
  data: {
    collections: IMarketAvailabilityForm[];
    pagination: IPaginationResponse;
    summary: ISummaryResponse[];
  };
}

export async function getMarketAvailabilityList(
  params: IPaginationRequest,
  callback: (data: IDataTableResponse) => void,
) {
  request(`/api/market-availability/get-list?brand_id=54bbfa0d-5fda-413b-81a9-1332081e2739`, {
    method: 'GET',
    params,
  })
    .then((response: ICategoryPaginationResponse) => {
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
