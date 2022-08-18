import { loadColorButtonPlugin } from './color-button/colorbutton';
import { loadPlaceholderPlugin } from './editor-placeholder/editorplaceholder';
import { loadHeadingPlugin } from './format-heading/formatheading';
import { loadSimpleButtonScript } from './simple-button/simplebutton';

let loaded = false;

export const loadPlugins = (CKEDITOR) => {
  if (loaded) return;

  loadSimpleButtonScript(CKEDITOR);

  loadPlaceholderPlugin(CKEDITOR);

  loadColorButtonPlugin(CKEDITOR);

  loadHeadingPlugin(CKEDITOR);

  loaded = true;
};
