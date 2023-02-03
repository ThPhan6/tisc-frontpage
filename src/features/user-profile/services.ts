import { STATUS_RESPONSE } from '@/constants/util';
import { request } from 'umi';

import { UpdatePersonalProfileRequestBody } from './types';

import { hidePageLoading, showPageLoading } from '../loading/loading';

export async function updateTeamProfile(
  data: UpdatePersonalProfileRequestBody,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  showPageLoading();
  request(`/api/team-profile/update-me`, {
    method: 'POST',
    data,
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
      hidePageLoading();
    })
    .catch((error) => {
      callback(STATUS_RESPONSE.ERROR, error?.data?.message);
      hidePageLoading();
    });
}

export async function updateAvatarTeamProfile(
  data: { avatar: string },
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  showPageLoading();
  request(`/api/team-profile/update-avatar`, {
    method: 'POST',
    data,
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
      hidePageLoading();
    })
    .catch((error) => {
      callback(STATUS_RESPONSE.ERROR, error?.data?.message);
      hidePageLoading();
    });
}
