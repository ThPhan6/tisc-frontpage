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
  defaultHeight = 54,
  boxShadow,
  autoResize,
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
      className={`
        ${style['textarea-container']}
        ${style[`${borderBottomColor}-border-bottom-color`]}
        ${boxShadow ? style.boxShadow : ''}
      `}>
      <Input.TextArea
        {...props}
        ref={textarea}
        maxLength={maxLength}
        style={{ height: autoResize ? height : 'auto', minHeight: defaultHeight }}
        onChange={(e) => {
          e.target.value = trimStart(e.target.value);
          handleResize(e);
          if (props.onChange) {
            props.onChange(e);
          }
        }}
      />
    </div>
  );
};
