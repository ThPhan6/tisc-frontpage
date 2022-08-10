import TeamIcon from '@/components/TeamProfile/components/TeamIcon';
import { isNaN, isNumber } from 'lodash';
import { FC } from 'react';
import styles from './index.less';

interface RenderLabelHeaderProps {
  header: string;
  quantity?: number | string;
  isUpperCase?: boolean;
  isSubHeader: boolean;
}

interface RenderMemberHeaderProps {
  firstName: string;
  lastName?: string;
  avatar?: string;
}

export const RenderLabelHeader: FC<RenderLabelHeaderProps> = ({
  header,
  quantity,
  isUpperCase,
  isSubHeader,
}) => {
  return (
    <span
      className={isSubHeader ? styles.dropdownCount : ''}
      style={{
        textTransform: isUpperCase ? 'uppercase' : 'capitalize',
        color: '@mono-color',
      }}
    >
      {header}
      {isNumber(quantity) && !isNaN(quantity) ? (
        <span
          className={styles.quantity}
          style={{
            marginLeft: 8,
          }}
        >
          ({quantity ?? '0'})
        </span>
      ) : null}
    </span>
  );
};

export const RenderMemberHeader: FC<RenderMemberHeaderProps> = ({
  firstName = '',
  lastName = '',
  avatar,
}) => {
  return (
    <div className={styles.memberName}>
      <TeamIcon avatar={avatar} name={`${firstName} ${lastName}`} customClass={styles.avatar} />
      <span className={`${styles.name} ${styles.dropdownCount}`}>{`${firstName} ${lastName}`}</span>
    </div>
  );
};
