import { CSSProperties, FC } from 'react';

import { NameContentProps } from '@/pages/Designer/Products/CustomLibrary/types';

import styles from './SimpleContentTable.less';

export const SimpleContentTable: FC<{
  items: NameContentProps[];
  tdStyle?: CSSProperties;
  customClass?: string;
}> = ({ items, tdStyle, customClass = '' }) => {
  return (
    <table
      style={{ width: '100%', tableLayout: 'fixed' }}
      className={`${styles.table} ${customClass}`}>
      <tbody>
        {items.map((item, index) => (
          <tr key={item.id || index}>
            <td className="text-overflow" title={item.name} style={tdStyle}>
              {item.name}
            </td>
            <td className="text-overflow" title={item.content} style={tdStyle}>
              {item.content}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
