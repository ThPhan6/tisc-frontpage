import TeamIcon from '@/components/TeamProfile/components/TeamIcon';
import { FC } from 'react';
import styles from '../styles/renderHeader.less';

interface RenderLabelHeaderProps {
  header: string;
  quantity?: number | string;
  isUpperCase?: boolean;
  isSubHeader: boolean;
}

// interface RenderHeaderProps {
//   header: string;
//   quantity: number | string;
//   isUpperCase?: boolean;
// }

interface RenderMemberHeaderProps {
  firstName: string;
  lastName?: string;
  avatar?: string;
}

// export const RenderMainHeader: FC<RenderHeaderProps> = ({
//   header,
//   quantity,
//   isUpperCase = true,
// }) => {
//   return (
//     <span
//       style={{
//         textTransform: isUpperCase ? 'uppercase' : 'capitalize',
//       }}
//     >
//       {header}
//       <span
//         className={styles.dropdownCount}
//         style={{
//           marginLeft: 8,
//         }}
//       >
//         ({quantity})
//       </span>
//     </span>
//   );
// };

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
      {quantity !== undefined ? (
        quantity == 0 ? (
          <span
            style={{
              marginLeft: 8,
            }}
          >
            (0)
          </span>
        ) : (
          <span
            className={`${styles.quantity} ${styles.dropdownCount}`}
            style={{
              marginLeft: 8,
            }}
          >
            ({quantity})
          </span>
        )
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
      <TeamIcon avatar={avatar} name={firstName} customClass={styles.avatar} />
      <span className={`${styles.name} ${styles.dropdownCount}`}>{`${firstName} ${lastName}`}</span>
    </div>
  );
};
