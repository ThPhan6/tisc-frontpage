import { FC } from 'react';

import { Col, Row } from 'antd';
import { useHistory } from 'umi';

import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { EntryFormWrapperProps } from './types';

import CustomButton from '../Button';
import { BodyText, MainTitle } from '../Typography';
import styles from './styles/index.less';

export const contentId = `entry-form-wrapper--children-${Date.now()}`;

export const FormContainer: FC = ({ children }) => (
  <Row>
    <Col span={24} lg={{ span: 12 }}>
      {children}
    </Col>
  </Row>
);

export const EntryFormWrapper: FC<EntryFormWrapperProps> = ({
  handleSubmit,
  handleCancel,
  customClass = '',
  contentClass = '',
  textAlignTitle = 'center',
  children,
  title = 'ENTRY FORM',
  disableCancelButton = false,
  disableSubmitButton = false,
  headerContent,
  footerContent,
  submitButtonStatus = false,
}) => {
  const history = useHistory();
  return (
    <FormContainer>
      <div className={`${styles.entry_form_container} ${customClass}`}>
        {/* header */}
        <div className={styles.header_main}>
          <div className={styles.header}>
            <MainTitle level={3} textAlign={textAlignTitle} customClass={styles.header__title}>
              {title}
            </MainTitle>
            <CloseIcon className={styles.header__icon} onClick={handleCancel} />
          </div>
          {headerContent ? <div className={styles.header_content}>{headerContent}</div> : null}
        </div>

        {/* main content */}
        <div id={contentId} className={`${styles.content} ${contentClass}`}>
          {children}
        </div>

        {/* footer */}
        <div className={styles.footer_main}>
          {footerContent ? <div className={styles.footer_content}>{footerContent}</div> : null}

          <div className={styles.footer}>
            <CustomButton
              size="small"
              buttonClass={styles.footer__cancel_bt}
              onClick={handleCancel || history.goBack}
              disabled={disableCancelButton}>
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
                  disabled={disableSubmitButton}>
                  <BodyText level={6} fontFamily="Roboto">
                    Save
                  </BodyText>
                </CustomButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormContainer>
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
