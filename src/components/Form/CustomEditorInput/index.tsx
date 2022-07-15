import { FC, useEffect } from 'react';
import {
  CKEditor,
  CKEditorEventHandlerProp,
  CKEditorEventPayload,
  CKEditorProps,
} from 'ckeditor4-react';
import styles from './index.less';
import { loadPlugins } from './plugins/load-plugins';

type CustomEditorInputProps = Partial<CKEditorProps<CKEditorEventHandlerProp>> & {
  onChangeText: (html: string) => void;
  containerClass?: string;
  placeholder?: string;
  containerSelector?: string;
};

const id = `editor-container-${Date.now()}`;

export const CustomEditorInput: FC<CustomEditorInputProps> = ({
  onChangeText,
  containerClass,
  placeholder,
  containerSelector,
  ...props
}) => {
  useEffect(() => {
    setTimeout(() => {
      if (containerSelector) {
        const updateSize = () => {
          const containerEl = document.querySelector(containerSelector);
          const editorEl = document.querySelector(`#${id}`);
          const iFrameEl = document.querySelector('iframe.cke_wysiwyg_frame');

          if (!containerEl || !editorEl) {
            return;
          }

          const contentFullHeight =
            (containerEl.offsetHeight || 0) -
            (iFrameEl.offsetTop || 0) -
            (containerEl.offsetTop || 0) +
            89;

          if (contentFullHeight && iFrameEl?.style) {
            iFrameEl.style.height = `${contentFullHeight}px`;
          }
        };

        // editor is resizing while window is resizing
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
      }
    }, 200);
  }, [containerSelector]);

  const onChange = (e: CKEditorEventPayload<'change'>) => {
    // console.log('e', e);
    const html = e.editor.getData() || '';
    // console.log('html', html);
    onChangeText(html);
  };

  return (
    <div id={id} className={`${styles.container} ${containerClass}`}>
      <CKEditor
        config={{
          // toolbar: [['Bold', 'Italic', 'Underline', 'Strikethrough', 'Link', 'colors', 'Indent', 'simplebutton']],
          extraPlugins: ['simplebutton', 'editorplaceholder', 'colorbutton'],
          allowedContent: true, // disable format tag styles
          removePlugins: ['resize', 'elementspath'],
          removeButtons: '',
          editorplaceholder: placeholder,
          toolbarGroups: [
            // { "name": "clipboard", "groups": ["clipboard", "undo"] },
            // {
            //   "name": "editing",
            //   "groups": ["find",
            //     "selection",
            //     "spellchecker"]
            // },
            // { "name": "insert" },
            // { "name": "forms" },
            // { "name": "tools" },
            // {
            //   "name": "document",
            //   "groups": ["mode",
            //     "document",
            //     "doctools"]
            // },
            {
              name: 'basicstyles',
            },
            // { "name": "links" },
            {
              name: 'paragraph',
              groups: [
                'list',
                'indent',
                // "blocks",
                'align',
                'bidi',
              ],
            },
            { name: 'styles' },
            { name: 'colors' },
            { name: 'others' }, // extraPlugins
          ],
        }}
        {...props}
        onBeforeLoad={loadPlugins}
        onChange={onChange}
      />
    </div>
  );
};
