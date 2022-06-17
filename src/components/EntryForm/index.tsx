import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { Col, Row } from 'antd';
import classNames from 'classnames';
import { FC } from 'react';
import CustomButton from '../Button';
import { BodyText, MainTitle } from '../Typography';
import styles from './styles/index.less';
import { EntryFormWrapperProps } from './types';

export const EntryFormWrapper: FC<EntryFormWrapperProps> = ({
  handleSubmit,
  handleCancel,
  customClass,
  contentClass,
  children,
  title = 'ENTRY FORM',
  handleDisabledCancel = false,
  handleDisabledSubmit = false,
  submitButtonStatus = false,
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
              disabled={handleDisabledCancel}
            >
              Cancel
            </CustomButton>

            <div className={styles.footer__wrapper_submit}>
              {submitButtonStatus ? (
                <CustomButton
                  buttonClass={styles.footer__wrapper_submit_success}
                  size="small"
                  width="64px"
                  icon={<CheckSuccessIcon />}
                />
              ) : (
                <CustomButton
                  buttonClass={styles.footer__wrapper_submit_normal}
                  size="small"
                  width="64px"
                  onClick={handleSubmit}
                  disabled={handleDisabledSubmit}
                >
                  <BodyText level={6} fontFamily="Roboto">
                    Save
                  </BodyText>
                </CustomButton>
              )}
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

{
  /* <CustomButton
size="small"
buttonClass={styles.footer__submit_bt}
onClick={handleSubmit}
disabled={handleDisabledCancel}
>
Save
</CustomButton> */
}
