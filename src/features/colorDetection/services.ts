import { message } from 'antd';
import { request } from 'umi';

import { ColourAIResponse } from './types';

import { hidePageLoading, showPageLoading } from '../loading/loading';

export const detectImageColor = (categoryIds: string[], images: string[]) => {
  showPageLoading();

  return request<ColourAIResponse>('/api/color/detect-color', {
    method: 'POST',
    data: { images, category_ids: categoryIds },
  })
    .then((res) => {
      hidePageLoading();
      return res;
    })
    .catch((err) => {
      hidePageLoading();

      message.error(err?.data?.message || 'Failed to detect colour');

      return {} as ColourAIResponse;
    });
};
