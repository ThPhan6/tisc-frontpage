import React from 'react';
import { Input } from 'antd';
import { FC } from 'react';
import { CustomTextAreaProps } from './types';
import style from './styles/TextArea.less';
import classNames from 'classnames';

export const CustomTextArea: FC<CustomTextAreaProps> = ({
  borderBottomColor = 'mono',
  maxLength,
  children,
  ...props
}) => {
  return (
    <div
      className={classNames(
        style['textarea-container'],
        style[`${borderBottomColor}-border-bottom-color`],
      )}
    >
      <Input.TextArea maxLength={maxLength ? maxLength : 100} {...props} />
    </div>
  );
};
