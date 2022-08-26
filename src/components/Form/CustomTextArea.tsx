import { FC, useEffect, useRef, useState } from 'react';

import { Input } from 'antd';

import { trimStart } from 'lodash';

import type { CustomTextAreaProps } from './types';

import style from './styles/TextArea.less';

export const CustomTextArea: FC<CustomTextAreaProps> = ({
  borderBottomColor = 'mono',
  maxLength,
  maxHeight,
  defaultHeight,
  children,
  boxShadow,
  ...props
}) => {
  const textarea: any = useRef();
  const [height, setHeight] = useState<string | number | undefined>(defaultHeight);
  // const [checkedOverflow, setCheckedOverflow] = useState<string>('hidden');

  useEffect(() => {
    let contentHeight = textarea.current.resizableTextArea.textArea.scrollHeight;

    if (!maxHeight || !defaultHeight || props.value === '') {
      contentHeight = defaultHeight;
    }
    // if (maxHeight && contentHeight < maxHeight) {
    // contentHeight = contentHeight;
    // setCheckedOverflow('hidden');
    // }
    // else {
    // contentHeight = maxHeight;
    // setCheckedOverflow('hidden auto');
    // }

    setHeight(contentHeight);
  }, [props.value]);

  return (
    <div
      className={`
        ${style['textarea-container']}
        ${style[`${borderBottomColor}-border-bottom-color`]}
        ${boxShadow ? style.boxShadow : ''}
      `}>
      <Input.TextArea
        ref={textarea}
        style={{ height: height /* , overflow: checkedOverflow  */ }}
        maxLength={maxLength ? maxLength : 100}
        {...props}
        onChange={(e) => {
          e.target.value = trimStart(e.target.value);
          if (props.onChange) {
            props.onChange(e);
          }
        }}
      />
    </div>
  );
};
