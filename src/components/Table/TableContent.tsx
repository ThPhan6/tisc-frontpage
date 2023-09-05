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
    <tr className={`${styles.content} ${customClass}`}>
      <td className={`${styles.textLeft} text-content-left`} style={{ width: textLeftWidth }}>
        {textLeft}
      </td>
      <td className={`${styles.textRight} text-content-right`} style={{ width: textRightWidth }}>
        {textRight}
      </td>
    </tr>
  );
};

export default TableContent;
