import { FormGroup } from '@/components/Form';
import classNames from 'classnames';
import React, { FC, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Icons } from './icons';
import style from './styles/InputEditor.less';
import type { CustomInputEditorProps, CustomToolbarProps } from './types';

export const CustomToolbar: FC<CustomToolbarProps> = ({ toolbarId }) => {
  const icons = Quill.import('ui/icons');
  icons.bold = Icons.bold;
  icons.italic = Icons.italic;
  icons.underline = Icons.underline;
  icons.link = Icons.link;
  icons.indent = Icons.indentLeft;
  icons.outdent = Icons.indentRight;

  return (
    <div className={classNames(style['toolbar-editor'])}>
      <div id={toolbarId}>
        <div className={style['d-flex-content-between']}>
          <div>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-link" />
          </div>
          <div>
            <button className="ql-indent" value="+1" />
            <button className="ql-indent ql-outdent" value="-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomInputEditor: FC<CustomInputEditorProps> = ({ placeholder, layout }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [toolbarId] = useState<string>(
    `quill-toolbar-${Math.floor(Math.random() * 100000000000000)}`,
  );

  const onchangeValue = { html: '' };

  const handleChangeGetHTML = (content: string, delta: any, source: any, editor: any) => {
    onchangeValue.html = editor.getHTML();
  };

  const onChange = (content: string, delta: any, source: any, editor: any) => {
    handleChangeGetHTML(content, delta, source, editor);

    const deltaData = editor.getContents().push(onchangeValue);

    setInputValue(deltaData);
  };

  const modules = {
    toolbar: {
      container: `#` + toolbarId,
    },
  };

  const formats = ['bold', 'italic', 'underline', 'link', 'indent'];

  return (
    <div className={classNames(style['quill-editor'])}>
      <FormGroup label="Field Name" tooltip="How are you" layout={layout}>
        <CustomToolbar toolbarId={toolbarId} />
      </FormGroup>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        defaultValue={inputValue}
        onChange={onChange}
      />
    </div>
  );
};
