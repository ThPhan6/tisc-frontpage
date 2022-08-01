import { BodyText } from '@/components/Typography';
import { FC } from 'react';
import styles from '../styles/attributes.less';

interface GeneralTextProps {
  text?: string;
}

const GeneralText: FC<GeneralTextProps> = ({ text = '' }) => {
  return (
    <BodyText level={6} customClass={styles.content_text} fontFamily="Roboto">
      {text}
    </BodyText>
  );
};
export default GeneralText;
