import { FC, ReactNode } from 'react';

import { Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';

import { ReactComponent as InfoIcon } from '@/assets/icons/info.svg';

import { isNaN, isNumber } from 'lodash';

import TeamIcon from '../TeamIcon/TeamIcon';
import { BodyText } from '../Typography';
import styles from './index.less';

interface RenderLabelHeaderProps {
  header: string;
  quantity?: number | string;
  isUpperCase?: boolean;
  isSubHeader: boolean;
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
      }}>
      {header}
      {isNumber(quantity) && !isNaN(quantity) ? (
        <span
          className={styles.quantity}
          style={{
            marginLeft: 8,
          }}>
          ({quantity ?? '0'})
        </span>
      ) : null}
    </span>
  );
};

interface MemberHeaderLabelProps {
  firstName: string;
  lastName?: string;
  avatar?: string;
}

export const MemberHeaderLabel: FC<MemberHeaderLabelProps> = ({
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

interface RenderEntireProjectLabelProps {
  title: string;
  trigger?: 'click' | 'hover';
  toolTiptitle: string | ReactNode;
  overLayWidth?: string;
  placement?: TooltipPlacement;
  customClass?: string;
  icon?: ReactNode;
  overlayClassName?: string;
}

export const RenderEntireProjectLabel: FC<RenderEntireProjectLabelProps> = ({
  title,
  trigger = 'hover',
  toolTiptitle,
  overLayWidth,
  placement = 'bottom',
  customClass = '',
  overlayClassName = '',
  icon,
}) => {
  return (
    <div className={`flex-start ${styles.entireProject}  ${customClass}`}>
      <BodyText fontFamily="Roboto" level={6} style={{ fontWeight: '500' }}>
        {title}
      </BodyText>
      <Tooltip
        trigger={[trigger]}
        placement={placement}
        title={toolTiptitle}
        overlayClassName={`${styles.overlay} ${overlayClassName}`}
        overlayInnerStyle={{
          width: overLayWidth ? overLayWidth : 'auto',
        }}>
        {icon ? icon : <InfoIcon style={{ width: 18, height: 18, marginLeft: 8 }} />}
      </Tooltip>
    </div>
  );
};
