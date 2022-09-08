import { FC, ReactNode } from 'react';

import styles from './styles/TableContent.less';

interface TableContentProps {
  textRight: ReactNode | string;
  textLeft: ReactNode | string;
  customClass?: string;
  textRightWidth?: string;
  textLeftWidth?: string;
}

const TableContent: FC<TableContentProps> = ({
  textLeft,
  textRight,
  customClass = '',
  textRightWidth,
  textLeftWidth,
}) => {
  return (
    <table className={`${styles.table} ${customClass} `}>
      <tbody>
        <tr>
          <td className={styles.textLeft} style={{ width: textLeftWidth }}>
            {textLeft}
          </td>
          <td className={styles.textRight} style={{ width: textRightWidth }}>
            {textRight}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default TableContent;
