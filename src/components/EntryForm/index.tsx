import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { Col, Row } from 'antd';
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
  textAlignTitle = 'center',
  children,
  title = 'ENTRY FORM',
  headerContent,
  footerContent,
  handleDisabledCancel = false,
  handleDisabledSubmit = false,
  submitButtonStatus = false,
}) => {
  return (
    <Row>
      <Col className={styles.entry_form_wrapper} span={12}>
        <div className={`${styles.entry_form_container} ${customClass}`}>
          <div className={styles.header_main}>
            <div className={styles.header}>
              <MainTitle level={3} textAlign={textAlignTitle} customClass={styles.header__title}>
                {title}
              </MainTitle>
              <CloseIcon className={styles.header__icon} onClick={handleCancel} />
            </div>
            <div className={styles.header_content}>{headerContent}</div>
          </div>
          <div className={`${styles.content} ${contentClass}`}>{children}</div>
          <div className={styles.footer_main}>
            <div className={styles.footer_content}>{footerContent}</div>
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
