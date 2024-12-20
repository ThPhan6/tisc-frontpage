import { FC } from 'react';

import { ColProps, Row } from 'antd';
import { useHistory } from 'umi';

import { ReactComponent as CheckSuccessIcon } from '@/assets/icons/check-success-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import { confirmDelete, useScreen } from '@/helper/common';

import { EntryFormWrapperProps } from './types';

import CustomButton from '../Button';
import { ResponsiveCol } from '../Layout';
import { BodyText, MainTitle } from '../Typography';
import styles from './styles/index.less';

export const contentId = `entry-form-wrapper--children-${Date.now()}`;

interface FormContainerProps extends ColProps {
  children: any;
}

export const FormContainer: FC<FormContainerProps> = ({ children, ...props }) => (
  <Row>
    <ResponsiveCol {...props}>{children}</ResponsiveCol>
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
  footerClass = '',
  footerStyles,
  submitButtonStatus = false,
  extraFooterButton,
  entryFormTypeOnMobile = '',
  hideHeader,
  hideFooter,
  isRenderFooterContent = true,
  customStyles,
  cancelLabel = 'Cancel',
  submitLabel = 'Save',
  ...props
}) => {
  const history = useHistory();
  const isTablet = useScreen().isTablet;

  const renderFooterButton = () => {
    if (!isRenderFooterContent) {
      return null;
    }

    if (extraFooterButton) {
      return extraFooterButton;
    }

    const showButtonLeft = () => {
      // if (!isTablet || !entryFormTypeOnMobile) {
      //   return null;
      // }

      if (isTablet && entryFormTypeOnMobile === 'edit') {
        return (
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
        );
      }

      return (
        <CustomButton
          size="small"
          buttonClass={styles.footer__cancel_bt}
          onClick={handleCancel || history.goBack}
          disabled={disableCancelButton}
        >
          {cancelLabel}
        </CustomButton>
      );
    };

    return (
      <>
        {showButtonLeft()}

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
                {submitLabel}
              </BodyText>
            </CustomButton>
          )}
        </div>
      </>
    );
  };

  return (
    <FormContainer {...props}>
      <div className={`${styles.entry_form_container} ${customClass}`} style={{ ...customStyles }}>
        {/* header */}
        {hideHeader ? null : (
          <div className={styles.header_main}>
            <div className={styles.header}>
              {typeof title === 'string' ? (
                <MainTitle
                  level={3}
                  textAlign={textAlignTitle}
                  customClass={`${styles.header__title} ${titleClassName}`}
                  style={{ ...titleStyles }}
                >
                  {title}
                </MainTitle>
              ) : (
                title
              )}
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
        {hideFooter ? null : (
          <div className={`${styles.footer_main} ${footerClass}`} style={{ ...footerStyles }}>
            {footerContent ? <div className={styles.footer_content}>{footerContent}</div> : null}
            <div className={styles.footer}>{renderFooterButton()}</div>
          </div>
        )}
      </div>
    </FormContainer>
  );
};
