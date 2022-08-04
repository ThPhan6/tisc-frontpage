import { FC } from 'react';
import CustomButton from '../Button';
import { FormGroup } from './index';
import styles from './styles/status.less';
import { StatusProps } from './types';
import { Tooltip } from 'antd';
import { USER_STATUSES } from '@/constants/util';

export const Status: FC<StatusProps> = ({
  value,
  label = 'Status',
  layout = 'vertical',
  buttonName,
  onClick,
  text_1,
  text_2,
  formClass,
  textClass,
  activeButtonClass,
  InActiveButtonClass,
}) => {
  return (
    <FormGroup label={label} layout={layout} formClass={`${styles.form_group} ${formClass}`}>
      <div className={styles.status}>
        <span
          className={`
          ${styles.status_text}
          ${textClass}
          ${value === USER_STATUSES.PENDING || !value ? styles.pendingText : ''}
          `}
        >
          {value === USER_STATUSES.PENDING || !value ? text_2 : text_1}
        </span>
        {value == USER_STATUSES.ACTIVE || value == USER_STATUSES.BLOCKED ? (
          <CustomButton buttonClass={activeButtonClass} disabled onClick={onClick}>
            {buttonName}
          </CustomButton>
        ) : (
          <Tooltip
            title={
              <span className={styles.send_invite_tip}>
                Click <span className={styles.highlight}>Send Invite</span> button to send team
                member email invitation. You could resend it multiple time as a reminder.
              </span>
            }
            placement="topRight"
          >
            <CustomButton
              buttonClass={`${InActiveButtonClass} ${styles.sendInvite}`}
              onClick={onClick}
              variant="secondary"
            >
              {buttonName}
            </CustomButton>
          </Tooltip>
        )}
      </div>
    </FormGroup>
  );
};
