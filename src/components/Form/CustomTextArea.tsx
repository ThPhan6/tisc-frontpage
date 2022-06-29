import React from 'react';
import { Input } from 'antd';
import type { FC } from 'react';
import type { CustomTextAreaProps } from './types';
import style from './styles/TextArea.less';
import classNames from 'classnames';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';

export const CustomTextArea: FC<CustomTextAreaProps> = ({
  borderBottomColor = 'mono',
  maxLength,
  maxHeight,
  defaultHeight,
  children,
  ...props
}) => {
  const textarea: any = useRef();
  const [height, setHeight] = useState(defaultHeight);

  useEffect(() => {
    let contentHeight = Math.min(textarea.current.offsetHeight, Number(maxHeight));

    if (maxHeight && defaultHeight && props.value !== '') {
      if (contentHeight < maxHeight) {
        contentHeight = Number(defaultHeight);
      } else {
        contentHeight = Number(maxHeight);
      }
      setHeight(contentHeight);
    }
  }, [props.value]);

  return (
    <div
      className={classNames(
        style['textarea-container'],
        style[`${borderBottomColor}-border-bottom-color`],
      )}
    >
      <Input.TextArea
        ref={textarea}
        style={{ height: height, overflow: 'hidden auto' }}
        maxLength={maxLength ? maxLength : 100}
        {...props}
      />
    </div>
  );
};
