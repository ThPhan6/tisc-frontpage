import { message } from 'antd';
import { MESSAGE_NOTIFICATION } from '@/constants/message';
import type { AccessLevelModalProps } from '@/components/TISCModal/types';
import { request } from 'umi';
import { showImageUrl } from '@/helper/utils';

export async function getPermission() {
  return request<{ data: AccessLevelModalProps[] }>('/api/permission/get-list', {
    method: 'GET',
  })
    .then((response) => {
      /// add image logo to data
      response.data.map((item) => {
        item.logo = showImageUrl(item.logo!);

        if (item.subs) {
          item.subs.map((sub) => (sub.logo = showImageUrl(sub.logo!)));
        }
      });

      console.log(response.data);

      return response.data;
    })
    .catch((error) => {
      message.error(error.data.message ?? MESSAGE_NOTIFICATION.GET_PERMISSION_DATA_ERROR);
      return [] as AccessLevelModalProps[];
    });
}
