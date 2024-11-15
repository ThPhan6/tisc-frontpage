import { TabItem } from '@/components/Tabs/types';

export const LIST_TAB: TabItem[] = [
  { tab: 'IMPORT CSV FILE', key: 'import' },
  { tab: 'EXPORT CSV FILE', key: 'export' },
];

export type ImportExportTab = 'import' | 'export';
