import { loadColorButtonPlugin } from './color-button/colorbutton';
import { loadPlaceholderPlugin } from './editor-placeholder/editorplaceholder';
import { loadSimpleButtonScript } from './simple-button/simplebutton';

export const loadPlugins = (CKEDITOR) => {
  loadSimpleButtonScript(CKEDITOR);

  loadPlaceholderPlugin(CKEDITOR);

  loadColorButtonPlugin(CKEDITOR);
};
