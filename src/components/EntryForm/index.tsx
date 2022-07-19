import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { Col, Row } from 'antd';
import { FC } from 'react';
import CustomButton from '../Button';
import { BodyText, MainTitle } from '../Typography';
import styles from './styles/index.less';
import { EntryFormWrapperProps } from './types';

export const contentId = `entry-form-wrapper--children-${Date.now()}`;

export const EntryFormWrapper: FC<EntryFormWrapperProps> = ({
  handleSubmit,
  handleCancel,
  customClass,
  contentClass,
  children,
  title = 'ENTRY FORM',
  disableCancelButton = false,
  disableSubmitButton = false,
  submitButtonStatus = false,
}) => {
  return (
    <Row>
      <Col className={styles.entry_form_wrapper} span={12}>
        <div className={`${styles.entry_form_container} ${customClass}`}>
          {/* header */}
          <div className={styles.header}>
            <MainTitle level={3} customClass={styles.header__title}>
              {title}
            </MainTitle>
            <CloseIcon className={styles.header__icon} onClick={handleCancel} />
          </div>

          {/* children */}
          <div id={contentId} className={`${styles.content} ${contentClass}`}>
            {children}
          </div>

          {/* footer */}
          <div className={styles.footer}>
            <CustomButton
              size="small"
              buttonClass={styles.footer__cancel_bt}
              onClick={handleCancel}
              disabled={disableCancelButton}
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
                  disabled={disableSubmitButton}
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
disabled={disableCancelButton}
>
Save
</CustomButton> */
}
