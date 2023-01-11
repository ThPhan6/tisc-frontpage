import { FC } from 'react';

import { Row } from 'antd';
import { useHistory } from 'umi';

import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { confirmDelete } from '@/helper/common';
import { useScreen } from '@/helper/common';

import { EntryFormWrapperProps } from './types';

import CustomButton from '../Button';
import { ResponsiveCol } from '../Layout';
import { BodyText, MainTitle } from '../Typography';
import styles from './styles/index.less';

export const contentId = `entry-form-wrapper--children-${Date.now()}`;

export const FormContainer: FC = ({ children }) => (
  <Row>
    <ResponsiveCol>{children}</ResponsiveCol>
  </Row>
);

export const EntryFormWrapper: FC<EntryFormWrapperProps> = ({
  handleSubmit,
  handleCancel,
  handleDelete,
  customClass = '',
  contentClass = '',
  contentStyles,
  textAlignTitle = 'center',
  titleStyles,
  titleClassName,
  children,
  title = 'ENTRY FORM',
  disableCancelButton = false,
  disableSubmitButton = false,
  headerContent,
  footerContent,
  submitButtonStatus = false,
  extraFooterButton,
  entryFormTypeOnMobile = '',
  hideAction,
}) => {
  const history = useHistory();
  const isMobile = useScreen().isMobile;

  const renderFooterButton = () => {
    if (extraFooterButton) {
      return extraFooterButton;
    }

    return (
      <div className={styles.footer} style={{ justifyContent: isMobile ? 'center' : undefined }}>
        {isMobile && entryFormTypeOnMobile === 'edit' ? (
          <CustomButton
            size="small"
            variant="secondary"
            buttonClass={styles.footer__delete_bt}
            disabled={!handleDelete}
            onClick={() => {
              if (handleDelete) {
                confirmDelete(() => {
                  handleDelete();
                });
              }
            }}
          >
            Delete
          </CustomButton>
        ) : (
          <CustomButton
            size="small"
            buttonClass={styles.footer__cancel_bt}
            onClick={handleCancel || history.goBack}
            disabled={disableCancelButton}
          >
            Cancel
          </CustomButton>
        )}

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
    );
  };

  return (
    <FormContainer>
      <div className={`${styles.entry_form_container} ${customClass}`}>
        {/* header */}
        {hideAction ? null : (
          <div className={styles.header_main}>
            <div className={styles.header}>
              <MainTitle
                level={3}
                textAlign={textAlignTitle}
                customClass={`${styles.header__title} ${titleClassName}`}
                style={{ ...titleStyles }}
              >
                {title}
              </MainTitle>
              <CloseIcon className={styles.header__icon} onClick={handleCancel} />
            </div>
            {headerContent ? <div className={styles.header_content}>{headerContent}</div> : null}
          </div>
        )}

        {/* main content */}
        <div
          id={contentId}
          className={`${styles.content} ${contentClass}`}
          style={{ ...contentStyles }}
        >
          {children}
        </div>

        {/* footer */}
        {hideAction ? null : (
          <div className={styles.footer_main}>
            {footerContent ? <div className={styles.footer_content}>{footerContent}</div> : null}

            <div className={styles.footer__wrapper_submit}>{renderFooterButton()}</div>
          </div>
        )}
      </div>
    </FormContainer>
  );
};
