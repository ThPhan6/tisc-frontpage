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
    // console.log('editor.document', e.editor.document.getBody().getHtml());
    const html = e.editor.document.getBody()?.getHtml() || '';
    onChangeText(html);
  };

  return (
    <div className={`${styles.container} ${containerClass}`}>
      <CKEditor
        config={{
          toolbar: [['Bold', 'Italic', 'Underline', 'Link', 'Color', 'Indent', 'simplebutton']],
          extraPlugins: ['simplebutton', 'editorplaceholder'],
          removePlugins: ['resize'],
          editorplaceholder: placeholder,
        }}
        {...props}
        onBeforeLoad={loadPlugins}
        onChange={onChange}
      />
    </div>
  );
};
