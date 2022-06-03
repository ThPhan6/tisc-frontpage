import classNames from 'classnames';
import React, { FC } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// Icons toolbar
import { Icons } from './icons';
import style from './styles/InputEditor.less';

export const CustomInputEditor: FC = () => {
  const modules = {
    toolbar: {
      container: '#toolbars',
    },
  };

  const formats = ['bold', 'italic', 'underline', 'link', 'indent'];

  const icons = Quill.import('ui/icons');
  icons.bold = Icons.bold;
  icons.italic = Icons.italic;
  icons.underline = Icons.underline;
  icons.link = Icons.link;
  icons.indent = Icons.indentLeft;
  icons.outdent = Icons.indentRight;

  const CustomToolbar = () => {
    return (
      <div className="toolbar-editor" id="toolbars">
        <div className="d-flex-items-between">
          <div>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-link" />
          </div>

          <div>
            <button className="ql-indent " value="+1" />
            <button className="ql-indent ql-outdent" value="-1" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className={classNames(style['text-editor'])}>
        <CustomToolbar />

        <div className={classNames(style['input'])}>
          <ReactQuill theme="snow" modules={modules} formats={formats} placeholder="Type text..." />
        </div>
      </div>
    </div>
  );
};
