import classNames from 'classnames';
import { FC } from 'react';
import CustomButton from '../Button';
import { FormGroup } from './index';
import styles from './styles/status.less';
import { StatusProps } from './types';

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
  UnActiveButtonClass,
}) => {
  return (
    <FormGroup label={label} layout={layout} formClass={classNames(styles.form_group, formClass)}>
      <div className={styles.status}>
        <span className={classNames(styles.status_text, textClass)}>{value ? text_1 : text_2}</span>
        {value ? (
          <CustomButton className={activeButtonClass} disabled onClick={onClick}>
            {buttonName}
          </CustomButton>
        ) : (
          <CustomButton className={UnActiveButtonClass} onClick={onClick}>
            {buttonName}
          </CustomButton>
        )}
      </div>
    </FormGroup>
  );
};
