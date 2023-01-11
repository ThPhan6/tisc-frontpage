import { FC, useEffect, useRef, useState } from 'react';

import { Input } from 'antd';

import { trimStart } from 'lodash';

import type { CustomTextAreaProps } from './types';

import style from './styles/TextArea.less';

const minRows = 5;
const maxRows = 10;
const defaultHeight = 32;

export const CustomTextArea: FC<CustomTextAreaProps> = ({
  borderBottomColor = 'mono',
  maxLength,
  boxShadow,
  autoResize,
  customClass = '',
  maxWords,
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

  const handleResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!autoResize) return;

    const previousRows = event.target.rows;
    event.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(event.target.scrollHeight / defaultHeight);

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
      className={`${style['textarea-container']} ${
        style[`${borderBottomColor}-border-bottom-color`]
      } ${boxShadow ? style.boxShadow : ''} ${customClass}`}>
      <Input.TextArea
        {...props}
        ref={textarea}
        maxLength={maxLength}
        style={{ height: autoResize ? height : undefined }}
        onChange={(e) => {
          if (maxWords) {
            const text = e.target.value;
            const textLength = text.split(' ').length;
            if (textLength > maxWords) {
              return false;
            }
          }
          e.target.value = trimStart(e.target.value);
          handleResize(e);
          if (props.onChange) {
            props.onChange(e);
          }
          return true;
        }}
      />
    </div>
  );
};
