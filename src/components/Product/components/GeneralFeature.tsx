import { BodyText } from '@/components/Typography';
import { FC } from 'react';
import styles from '../styles/attributes.less';

export const GeneralFeatureHeader: FC<{ name: string }> = ({ name = '' }) => {
  return (
    <div className={styles.brandProfileHeader}>
      <BodyText level={6} fontFamily="Roboto" className={styles.name}>
        {name}
      </BodyText>
    </div>
  );
};

export const GeneralFeatureContent: FC<{ type: string; text: string }> = ({
  type = '',
  text = '',
}) => {
  return (
    <div className={styles.content}>
      <BodyText level={4} customClass={styles.content_type}>
        {type}
      </BodyText>
      <BodyText level={6} customClass={styles.content_text} fontFamily="Roboto">
        {text}
      </BodyText>
    </div>
  );
};

// export const CollapseGeneralFeature: FC<{ name: string }> = ({ name, children }) => {
//   return (
//     <CustomCollapse header={<GeneralFeatureHeader name={name} />} className={styles.group}>
//       {children}
//     </CustomCollapse>
//   );
// };
