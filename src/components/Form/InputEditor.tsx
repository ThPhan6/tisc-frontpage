import { FormGroup } from '@/components/Form';
import React, { FC, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Icons from './icons/icon-input-editor';
import style from './styles/InputEditor.less';
import type { CustomInputEditorProps, CustomToolbarProps, EditorServiceProps } from './types';

const CustomToolbar: FC<CustomToolbarProps> = ({ toolbarId }) => {
  const icons = Quill.import('ui/icons');
  icons.bold = Icons.bold;
  icons.italic = Icons.italic;
  icons.underline = Icons.underline;
  icons.link = Icons.link;
  icons.indent = Icons.indentLeft;
  icons.outdent = Icons.indentRight;

  return (
    <div className={style['toolbar-editor']}>
      <div id={toolbarId}>
        <div className={style['d-flex-content-between']}>
          <div>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-link" />
            <select className="ql-color" />
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

export const CustomInputEditor: FC<CustomInputEditorProps> = ({
  placeholder,
  layout,
  label,
  tooltip,
  optional,
  required,
  value,
  handleOnChange,
  containerClass,
  formClass,
  inputClass,
}) => {
  const [inputEditorValue, setInputEditorValue] = useState<{
    text: string;
    html: string;
  }>({
    text: '',
    html: '',
  });

  const [toolbarId] = useState<string>(
    `quill-toolbar-${Math.floor(Math.random() * 100000000000000)}`,
  );
  const modules = {
    toolbar: {
      container: `#` + toolbarId,
    },
  };

  const formats = ['bold', 'italic', 'underline', 'link', 'color', 'indent'];

  const onChangeValue = (
    content: string,
    delta: any,
    source: string,
    editor: EditorServiceProps,
  ) => {
    const newInputEditorValue = {
      text: editor.getText(),
      html: editor.getHTML(),
    };
    if (handleOnChange) {
      handleOnChange({ ...newInputEditorValue });
    }
    setInputEditorValue(newInputEditorValue);
  };

  return (
    <div className={`${style['quill-editor']} ${containerClass}`}>
      <FormGroup
        label={label}
        tooltip={tooltip}
        required={required}
        optional={optional}
        layout={layout}
        formClass={formClass}
      >
        <CustomToolbar toolbarId={toolbarId} />
      </FormGroup>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        value={value ?? inputEditorValue}
        onChange={onChangeValue}
        className={inputClass}
      />
    </div>
  );
};
