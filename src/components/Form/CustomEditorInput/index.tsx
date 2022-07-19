import { FC, useEffect, useState } from 'react';
import {
  CKEditor,
  CKEditorEventHandlerProp,
  CKEditorEventPayload,
  CKEditorProps,
} from 'ckeditor4-react';
import { loadPlugins } from './plugins/load-plugins';

type CustomEditorInputProps = Partial<CKEditorProps<CKEditorEventHandlerProp>> & {
  onChangeText: (html: string) => void;
  containerClass?: string;
  placeholder?: string;
  containerSelector?: string;
};

const id = `editor-container-${Date.now()}`;
let firstLoad = true;
const PADDING = 16;

// IMPORTANT: do not wrap this component inside another component
export const CustomEditorInput: FC<CustomEditorInputProps> = ({
  onChangeText,
  containerClass,
  placeholder,
  containerSelector,
  ...props
}) => {
  const [height, setHeight] = useState<number | null>(0);

  useEffect(() => {
    const updateSize = () => {
      if (!containerSelector) {
        return;
      }
      const containerEl = document.querySelector(containerSelector);
      const iFrameEl = document.querySelector('iframe.cke_wysiwyg_frame');
      const editorEl = document.querySelector(`#${id}`); // For checking editor is loaded or not

      if (!containerEl || !editorEl || !iFrameEl) {
        setTimeout(updateSize, 100);
        return;
      }

      const contentBottomOffset = (containerEl.offsetHeight || 0) + (containerEl.offsetTop || 0);

      const contentFullHeight =
        contentBottomOffset - (iFrameEl.offsetTop || 0) - 1 + (firstLoad ? 0 : -PADDING);

      // console.log('containerEl.offsetHeight', containerEl.offsetHeight);
      // console.log('iFrameEl', iFrameEl);
      // console.log('iFrameEl.offsetTop', iFrameEl.offsetTop);
      // console.log('contentBottomOffset', contentBottomOffset);
      // console.log('contentFullHeight', contentFullHeight);

      if (contentFullHeight && iFrameEl) {
        firstLoad = false;
        setHeight((prevHeight) => (prevHeight === contentFullHeight ? contentFullHeight : null)); // force reload by render to component to null
        setTimeout(() => setHeight(contentFullHeight), 1);
      } else {
        setTimeout(updateSize, 100);
      }
    };

    setTimeout(updateSize, 200);

    // editor is resizing while window is resizing
    window.addEventListener('resize', updateSize);

    return () => {
      firstLoad = true;
    };
  }, [containerSelector]);

  const onChange = (e: CKEditorEventPayload<'change'>) => {
    // console.log('e', e);
    const html = e.editor.getData() || '';
    // console.log('html', html);
    onChangeText(html);
  };

  if (height === null) {
    return null;
  }

  return (
    <div id={id} className={containerClass}>
      <CKEditor
        config={{
          height: `${height}px`,
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
            {
              name: 'document',
              groups: ['mode', 'document', 'doctools'],
            },
          ],
        }}
        {...props}
        onBeforeLoad={loadPlugins}
        onChange={onChange}
      />
    </div>
  );
};
