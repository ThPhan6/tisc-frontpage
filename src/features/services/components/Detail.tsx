import { FC, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { history } from 'umi';

import { ReactComponent as PlusIcon } from '@/assets/icons/action-plus-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as EqualIcon } from '@/assets/icons/equal-icon.svg';

import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { formatCurrencyNumber, getFullName } from '@/helper/utils';

import { InvoiceStatus, ServicesResponse } from '../type';

import CustomButton from '@/components/Button';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import TextForm from '@/components/Form/TextForm';
import { BodyText, Title } from '@/components/Typography';

import { getOneService, getServicePDF, markAsPaid, sendBill, sendRemind } from '../api';
import styles from '../index.less';
import { checkShowBillingAmount, formatToMoneyValue } from '../util';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';
import moment from 'moment';

interface ServiceDetailProps {
  type: 'tisc' | 'brand';
  id: string;
}
export const Detail: FC<ServiceDetailProps> = ({ type, id }) => {
  const [detailData, setDetailData] = useState<ServicesResponse>();
  const isMobile = useScreen().isMobile;

  const dueDate = moment().add(7, 'days').format('YYYY-MM-DD');

  const submitButtonStatus = useBoolean();

  const getService = () => {
    getOneService(id).then((res) => {
      if (res) {
        setDetailData(res);
      }
    });
  };

  useEffect(() => {
    getService();
  }, []);

  const handleSubmit = () => {
    showPageLoading();
    const onSubmit = detailData?.status === InvoiceStatus.Pending ? sendBill : sendRemind;
    onSubmit(id).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
          getService();
        }, 1000);
      }
      hidePageLoading();
    });
  };

  const handleMarkAsPaid = () => {
    markAsPaid(id).then((isSuccess) => {
      if (isSuccess) {
        pushTo(PATH.tiscRevenueService);
      }
    });
  };

  const handleDownloadPDF = () => {
    getServicePDF(id).then((res) => {
      if (res) {
        const linkSoure = new Blob([res], { type: 'application/pdf' });
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(linkSoure);
        downloadLink.download = String(detailData?.name);
        downloadLink.click();
      }
    });
  };

  const renderBottom = () => {
    if (type === 'tisc') {
      return (
        <>
          {detailData?.status !== InvoiceStatus.Paid ? (
            <div className="flex-start">
              <CustomSaveButton
                contentButton={detailData?.status === InvoiceStatus.Pending ? 'Bill' : 'Remind'}
                isSuccess={submitButtonStatus.value}
                onClick={handleSubmit}
              />
              {detailData?.status !== InvoiceStatus.Pending ? (
                <CustomButton
                  size="small"
                  variant="primary"
                  properties="rounded"
                  buttonClass={styles.leftSpace}
                  onClick={handleMarkAsPaid}>
                  Mark as Paid
                </CustomButton>
              ) : null}
            </div>
          ) : null}
        </>
      );
    }

    return (
      <div className="flex-start">
        {detailData?.status !== InvoiceStatus.Paid ? (
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            buttonClass={styles.rightSpace}
            onClick={() => alert('Coming soon!')}>
            Pay
          </CustomButton>
        ) : null}
        <CustomButton
          size="small"
          variant="primary"
          properties="rounded"
          onClick={handleDownloadPDF}>
          PDF
        </CustomButton>
      </div>
    );
  };

  const showBillingAmount = checkShowBillingAmount(detailData);

  const quantityWidth =
    String(Number(detailData?.billing_amount) + Number(detailData?.overdue_amount)).length < 5
      ? '5%'
      : String(Number(detailData?.billing_amount) + Number(detailData?.overdue_amount)).length * 10;

  const getContentHeight = () => {
    if (isMobile && type == 'tisc') {
      return 'calc(100vh - 288px)';
    }

    if (isMobile && type == 'brand') {
      return 'calc(100vh - 232px)';
    }

    if (type == 'tisc') {
      return 'calc(100vh - 304px)';
    }

    return 'calc(100vh - 248px)';
  };

  return (
    <EntryFormWrapper
      title={detailData?.name}
      textAlignTitle="left"
      titleClassName={styles.detailLabel}
      contentStyles={{
        height: getContentHeight(),
        overflow: 'auto',
      }}
      handleCancel={history.goBack}
      extraFooterButton={renderBottom()}>
      <TextForm boxShadow label="Billed Date">
        {moment(detailData?.created_at).format('YYYY-MM-DD')}
      </TextForm>
      <TextForm boxShadow label="Service Type">
        {detailData?.service_type_name}
      </TextForm>
      {type === 'tisc' && (
        <TextForm boxShadow label="Brand Company">
          {detailData?.brand_name}
        </TextForm>
      )}
      <TextForm boxShadow label="Ordered By">
        {getFullName(detailData?.ordered_user)}
      </TextForm>
      <TextForm boxShadow label="Billing Number">
        {detailData?.name}
      </TextForm>
      <FormGroup
        label="Billed Amount"
        layout="vertical"
        formClass={styles.customTable}
        labelColor="mono-color-dark">
        <table>
          <tr>
            <td className={styles.label}>
              <BodyText level={5} fontFamily="Roboto">
                Unit Rate
              </BodyText>
            </td>
            <td
              style={{
                width: quantityWidth,
              }}>
              ${formatToMoneyValue(Number(detailData?.unit_rate))}
            </td>
          </tr>
          <tr className={styles.totalQuantity}>
            <td className={styles.label}>
              <BodyText level={5} fontFamily="Roboto">
                Quantity
              </BodyText>
              <CloseIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
            </td>
            <td
              style={{
                width: quantityWidth,
              }}>
              {formatCurrencyNumber(Number(detailData?.quantity))}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>
              <BodyText level={5} fontFamily="Roboto">
                Gross Total
              </BodyText>
              <EqualIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
            </td>
            <td
              style={{
                width: quantityWidth,
              }}>
              ${formatToMoneyValue(Number(detailData?.total_gross))}
            </td>
          </tr>
          <tr>
            <td className={styles.label}>
              <BodyText level={5} fontFamily="Roboto">
                Sales Tax (GST) - {detailData?.tax}%
              </BodyText>
              <PlusIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
            </td>
            <td
              style={{
                width: quantityWidth,
              }}>
              ${formatToMoneyValue(Number(detailData?.sale_tax_amount))}
            </td>
          </tr>
          <tr className={styles.total}>
            <td className={styles.label}>
              <Title level={8}>TOTAL AMOUNT</Title>
            </td>
            <td
              style={{
                width: quantityWidth,
              }}>
              <Title level={8}>${formatToMoneyValue(Number(detailData?.billing_amount))}</Title>
            </td>
          </tr>
        </table>
      </FormGroup>

      <FormGroup
        label="Due Date"
        layout="vertical"
        formClass={styles.customFormGroup}
        labelColor="mono-color-dark">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            height: '32px',
            alignItems: 'center',
          }}>
          <BodyText
            level={5}
            fontFamily="Roboto"
            style={{ paddingLeft: '16px', color: detailData?.due_date ? '' : '#BFBFBF' }}>
            {detailData?.due_date ? detailData.due_date : dueDate}
          </BodyText>
          <BodyText level={5} fontFamily="Roboto">
            (annual interest rate of 36.5% applies to late payment)
          </BodyText>
        </div>
      </FormGroup>
      <FormGroup
        label="Overdue Fines"
        layout="vertical"
        formClass={`${detailData?.status !== InvoiceStatus.Overdue ? styles.customFormGroup : ''}`}
        labelColor="mono-color-dark">
        <table className={styles.customTable} style={{ width: '100%' }}>
          <tr>
            <td className={styles.label}>
              <BodyText level={5} fontFamily="Roboto">
                as {moment().format('YYYY-MM-DD')}
              </BodyText>
              {showBillingAmount && (
                <PlusIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
              )}
            </td>
            <td
              className={`${showBillingAmount ? '' : styles.rightText}`}
              style={{
                width: quantityWidth,
              }}>
              ${formatToMoneyValue(Number(detailData?.overdue_amount))}
            </td>
          </tr>
          {showBillingAmount ? (
            <tr className={styles.total}>
              <td className={styles.label}>
                <Title level={8}>BILLING AMOUNT</Title>
              </td>
              <td
                style={{
                  width: quantityWidth,
                }}>
                <Title level={8}>
                  $
                  {formatToMoneyValue(
                    Number(detailData?.billing_amount) + Number(detailData?.overdue_amount),
                  )}
                </Title>
              </td>
            </tr>
          ) : null}
        </table>
      </FormGroup>
      <TextForm
        boxShadow
        label="Status"
        bodyTextClass={detailData?.status === InvoiceStatus.Overdue ? styles.overdue : ''}>
        {InvoiceStatus[detailData?.status as number]}
      </TextForm>
    </EntryFormWrapper>
  );
};
