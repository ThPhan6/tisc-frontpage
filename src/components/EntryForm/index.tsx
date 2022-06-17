import { Col, Row } from 'antd';
import { FC } from 'react';
import CustomButton from '../Button';
import { MainTitle } from '../Typography';
import styles from './styles/index.less';
import { EntryFormWrapperProps } from './types';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import classNames from 'classnames';

export const EntryFormWrapper: FC<EntryFormWrapperProps> = ({
  handleSubmit,
  handleCancel,
  customClass,
  contentClass,
  children,
  title = 'ENTRY FORM',
}) => {
  return (
    <Row style={{ height: '100%' }}>
      <Col span={12} style={{ height: '100%' }}>
        <div className={classNames(styles.entry_form_container, customClass)}>
          <div className={styles.header}>
            <MainTitle level={3} customClass={styles.header__title}>
              {title}
            </MainTitle>
            <CloseIcon className={styles.header__icon} onClick={handleCancel} />
          </div>
          <div className={classNames(styles.content, contentClass)}>{children}</div>
          <div className={styles.footer}>
            <CustomButton
              size="small"
              buttonClass={styles.footer__cancel_bt}
              onClick={handleCancel}
            >
              Cancel
            </CustomButton>
            <CustomButton
              size="small"
              buttonClass={styles.footer__submit_bt}
              onClick={handleSubmit}
            >
              Save
            </CustomButton>
          </div>
        </div>
      </Col>
    </Row>
  );
};
