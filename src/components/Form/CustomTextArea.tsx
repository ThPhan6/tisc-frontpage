import { FC, useEffect, useRef, useState } from 'react';

import { Input } from 'antd';

import { trimStart } from 'lodash';

import type { CustomTextAreaProps } from './types';

import style from './styles/TextArea.less';

const minRows = 5;
const maxRows = 10;

export const CustomTextArea: FC<CustomTextAreaProps> = ({
  borderBottomColor = 'mono',
  maxLength,
  // maxHeight,
  defaultHeight,
  children,
  boxShadow,
  ...props
}) => {
  const textarea: any = useRef();
  const [height, setHeight] = useState<string | number | undefined>(defaultHeight);

  useEffect(() => {
    let contentHeight = textarea.current.resizableTextArea.textArea.scrollHeight;

    if (props.value === '') {
      contentHeight = defaultHeight;
    }

    setHeight(contentHeight);
  }, [props.value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textareaLineHeight = 24;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      event.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      event.target.rows = maxRows;
      event.target.scrollTop = event.target.scrollHeight;
    }

    setHeight(currentRows < maxRows ? currentRows : maxRows);
  };

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
          handleChange(e);
          if (props.onChange) {
            props.onChange(e);
          }
        }}
      />
    </div>
  );
};
