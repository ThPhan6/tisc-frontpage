export const loadHeadingPlugin = (CKEDITOR) => {
  CKEDITOR.config.format_h1 = { element: 'h1', name: 'Heading 1', styles: { 'font-weight': 500 } };
  CKEDITOR.config.format_h2 = { element: 'h2', name: 'Heading 2', styles: { 'font-weight': 400 } };
  CKEDITOR.config.format_h3 = { element: 'h3', name: 'Heading 3', styles: { 'font-weight': 300 } };
  //   CKEDITOR.config.format_h4 = { element: 'h4', name: 'Heading 4', styles: { 'font-weight': 300 } };
  //   CKEDITOR.config.format_h5 = { element: 'h5', name: 'Heading 5', styles: { 'font-weight': 200 } };
  //   CKEDITOR.config.format_h6 = { element: 'h6', name: 'Heading 6', styles: { 'font-weight': 100 } };

  //   CKEDITOR.config.format_tags = 'p;h1;h2;h3;h4;h5;h6;pre;address;div';
};
