import { simplebuttonDialogConfig } from './simplebuttondialog';

export const loadSimpleButtonScript = (CKEDITOR) => {
  CKEDITOR.plugins.add('simplebutton', {
    init: function (editor) {
      editor.addCommand('simplebutton', new CKEDITOR.dialogCommand('simplebuttonDialog'));
      editor.ui.addButton('simplebutton', {
        label: 'Simple Button',
        command: 'simplebutton',
        icon: 'https://cdn4.iconfinder.com/data/icons/24x24-free-pixel-icons/24/Clock.png',
      });
      editor.on('doubleclick', function (evt) {
        var element = evt.data.element;
        if (element.hasClass('simple-button-plugin')) {
          evt.data.dialog = 'simplebuttonDialog';
        }
      });

      // CKEDITOR.dialog.add('simplebuttonDialog', './dialogs/simplebutton.js');
      CKEDITOR.dialog.add('simplebuttonDialog', simplebuttonDialogConfig);
    },
  });
};
