const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.prettier,
  semi: true,
  bracketSpacing: true,
  bracketSameLine: true,
  tabWidth: 2,
  importOrder: [
    'react',
    'ant|umi',
    'assets',
    'hook|service|helper|lodash',
    'reducer|constant|type',
    'component|page',
    '[^(.less)$]',
    '(.less)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
