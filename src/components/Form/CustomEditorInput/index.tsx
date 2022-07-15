import { FC } from 'react';
import {
  CKEditor,
  CKEditorEventHandlerProp,
  CKEditorEventPayload,
  CKEditorProps,
} from 'ckeditor4-react';
import styles from './styles.less';
import { loadPlugins } from './plugins/load-plugins';

type CustomEditorInputProps = Partial<CKEditorProps<CKEditorEventHandlerProp>> & {
  onChangeText: (html: string) => void;
  containerClass?: string;
  placeholder?: string;
};

export const CustomEditorInput: FC<CustomEditorInputProps> = ({
  onChangeText,
  containerClass,
  placeholder,
  ...props
}) => {
  const onChange = (e: CKEditorEventPayload<'change'>) => {
    // console.log('e', e);
    const html = e.editor.getData() || '';
    // console.log('html', html);
    onChangeText(html);
  };

  return (
    <div className={`${styles.container} ${containerClass}`}>
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
            {
              name: 'document',
              groups: ['mode', 'document', 'doctools'],
            },
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
