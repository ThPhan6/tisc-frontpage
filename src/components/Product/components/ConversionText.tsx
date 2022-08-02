import { BodyText } from '@/components/Typography';
import { FC } from 'react';
import type { ConversionSubValueProps } from '@/types';
import styles from '../styles/attributes.less';

interface ConversionTextProps {
  conversion: ConversionSubValueProps;
  firstValue: string;
  secondValue: string;
}

const ConversionText: FC<ConversionTextProps> = ({ conversion, firstValue, secondValue }) => {
  return (
    <BodyText level={6} customClass={styles.content_text} fontFamily="Roboto">
      <span className={styles.converstionText}>
        {firstValue} {conversion.unit_1}
      </span>
      <span className={styles.converstionText}>
        {secondValue} {conversion.unit_2}
      </span>
    </BodyText>
  );
};
export default ConversionText;
