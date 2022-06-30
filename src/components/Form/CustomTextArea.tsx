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
  const [height, setHeight] = useState<string | number | undefined>(defaultHeight);
  const [checkedOverflow, setCheckedOverflow] = useState<string>('hidden');

  useEffect(() => {
    let contentHeight = textarea.current.resizableTextArea.textArea.scrollHeight;
    if (maxHeight && defaultHeight) {
      if (props.value !== '') {
        if (contentHeight < maxHeight) {
          contentHeight = contentHeight;
          setCheckedOverflow('hidden');
        } else {
          contentHeight = maxHeight;
          setCheckedOverflow('hidden auto');
        }
      } else {
        contentHeight = defaultHeight;
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
        style={{ height: height, overflow: checkedOverflow }}
        maxLength={maxLength ? maxLength : 100}
        {...props}
      />
    </div>
  );
};
