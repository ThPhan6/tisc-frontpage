import TeamIcon from '@/components/TeamProfile/components/TeamIcon';
import { FC } from 'react';
import styles from '../styles/renderHeader.less';

interface RenderSubHeaderProps {
  header: string;
}

interface RenderHeaderProps extends RenderSubHeaderProps {
  quantity: number | string;
  isUpperCase?: boolean;
}

interface RenderMemberHeaderProps {
  firstName: string;
  lastName?: string;
  avatar?: string;
}

export const RenderMainHeader: FC<RenderHeaderProps> = ({
  header,
  quantity,
  isUpperCase = true,
}) => {
  return (
    <span
      style={{
        textTransform: isUpperCase ? 'uppercase' : 'capitalize',
      }}
    >
      {header}
      <span
        className={styles.dropdownCount}
        style={{
          marginLeft: 8,
        }}
      >
        ({quantity})
      </span>
    </span>
  );
};

export const RenderSubHeader: FC<RenderSubHeaderProps> = ({ header }) => {
  return (
    <span
      className={styles.dropdownCount}
      style={{
        textTransform: 'capitalize',
      }}
    >
      {header}
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
      <TeamIcon avatar={avatar} name={firstName} customClass={styles.avatar} />
      <span className={`${styles.name} ${styles.dropdownCount}`}>{`${firstName} ${lastName}`}</span>
    </div>
  );
};
