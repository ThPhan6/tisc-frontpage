import { STATUS_RESPONSE } from '@/constants/util';
import { request } from 'umi';
import { UpdateTeamProfileBodyProp } from '../types';

export async function updateTeamProfile(
  data: UpdateTeamProfileBodyProp,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/team-profile/update-me`, {
    method: 'POST',
    data,
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(STATUS_RESPONSE.ERROR, error?.data?.message);
    });
}

export async function updateAvatarTeamProfile(
  body: any,
  callback: (type: STATUS_RESPONSE, message?: string) => void,
) {
  request(`/api/team-profile/update-avatar`, {
    method: 'POST',
    body,
  })
    .then(() => {
      callback(STATUS_RESPONSE.SUCCESS);
    })
    .catch((error) => {
      callback(STATUS_RESPONSE.ERROR, error?.data?.message);
    });
}
