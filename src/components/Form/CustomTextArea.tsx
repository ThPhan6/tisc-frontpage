import React from 'react';
import { Input } from 'antd';
import type { FC } from 'react';
import type { CustomTextAreaProps } from './types';
import style from './styles/TextArea.less';

export const CustomTextArea: FC<CustomTextAreaProps> = ({
  borderBottomColor = 'mono',
  maxLength,
  children,
  ...props
}) => {
  return (
    <div
      className={`${style['textarea-container']}
        ${style[`${borderBottomColor}-border-bottom-color`]}`}
    >
      <Input.TextArea maxLength={maxLength ? maxLength : 100} {...props} />
    </div>
  );
};
