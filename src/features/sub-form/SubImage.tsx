import { CSSProperties, FC } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { IMAGE_ACCEPT_TYPES, LOGO_SIZE_LIMIT } from '@/constants/util';
import { Upload, message } from 'antd';

import DefaultImage from '@/assets/icons/default-option-icon.png';

import { getBase64 } from '@/helper/utils';

export const ImageUpload: FC<{
  onFileChange: (base64: string) => void;
  image?: string;
  style?: CSSProperties;
}> = ({ style, onFileChange, image, ...props }) => {
  return (
    <Upload
      accept={IMAGE_ACCEPT_TYPES.image}
      maxCount={1}
      showUploadList={false}
      beforeUpload={(file) => {
        if (file.size > LOGO_SIZE_LIMIT) {
          message.error(MESSAGE_ERROR.reachSizeLimit);
          return false;
        }
        getBase64(file)
          .then(onFileChange)
          .catch(() => {
            message.error('Upload Failed');
          });
        return true;
      }}
      {...props}
    >
      <img
        style={{
          width: 48,
          height: 48,
          objectFit: 'cover',
          marginRight: 16,
          cursor: 'pointer',
          ...style,
        }}
        src={image || DefaultImage}
      />
    </Upload>
  );
};
