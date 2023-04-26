import { FC, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { history } from 'umi';

import { ReactComponent as PlusIcon } from '@/assets/icons/action-plus-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as EqualIcon } from '@/assets/icons/equal-icon.svg';

import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
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
import { PaymentIntent } from '@/features/paymentIntent';
import moment from 'moment';

const DEFAULT_VALUE: ServicesResponse = {
  billed_date: '',
  created_at: '',
  created_by: '',
  due_date: '',
  id: '',
  name: '',
  ordered_by: '',
  payment_date: '',
  quantity: 0,
  relation_id: '',
  relation_type: 0,
  remark: '',
  service_type_id: '',
  status: 0,
  tax: 0,
  unit_rate: 0,
  updated_at: '',
  service_type_name: '',
  ordered_user: {
    id: '',
    location_id: '',
    firstname: '',
    lastname: '',
    email: '',
  },
  brand_name: '',
  billing_amount: 0,
  overdue_days: 0,
  overdue_amount: 0,
  billing_overdue_amount: 0,
  total_gross: 0,
  surcharge: 0,
  grand_total: 0,
  sale_tax_amount: 0,
  firstname: '',
  lastname: '',
};

interface ServiceDetailProps {
  type: 'tisc' | 'brand';
}
export const Detail: FC<ServiceDetailProps> = ({ type }) => {
  const [detailData, setDetailData] = useState<ServicesResponse>(DEFAULT_VALUE);

  const [visible, setVisible] = useState<boolean>(false);

  const isTablet = useScreen().isTablet;

  const id = useGetParamId();

  const dueDate = moment().add(7, 'days').format('YYYY-MM-DD');

  const submitButtonStatus = useBoolean();

  const quantityWidth =
    String(Number(detailData?.billing_amount) + Number(detailData?.overdue_amount)).length < 5
      ? '5%'
      : String(Number(detailData?.billing_amount) + Number(detailData?.overdue_amount)).length * 10;

  /* overdue fines */
  // const showBillingAmount = checkShowBillingAmount(detailData);

  // const hideOverdueFines =
  //   (detailData?.status === InvoiceStatus.Paid &&
  //     moment(detailData.due_date).diff(moment(detailData.payment_date)) > 0) ||
  //   detailData?.status === InvoiceStatus.Pending ||
  //   detailData?.status === InvoiceStatus.Outstanding;

  const getService = () => {
    getOneService(id).then((res) => {
      if (res) {
        setDetailData(res);
      }
    });
  };

  useEffect(() => {
    getService();

    return () => setDetailData(DEFAULT_VALUE);
  }, []);

  const handleSubmit = () => {
    const onSubmit = detailData?.status === InvoiceStatus.Pending ? sendBill : sendRemind;
    onSubmit(id).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
          getService();
        }, 1000);
      }
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
    if (!detailData) {
      return undefined;
    }
    if (type === 'tisc' && isTablet) {
      return <></>;
    }
    if (type === 'tisc') {
      /// paid
      if (detailData.status == 2) {
        return (
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            onClick={history.goBack}
          >
            Cancel
          </CustomButton>
        );
      }

      return (
        <>
          {detailData.status !== InvoiceStatus.Paid ? (
            <div className={styles.bottom}>
              <CustomSaveButton
                contentButton={detailData.status === InvoiceStatus.Pending ? 'Bill' : 'Remind'}
                isSuccess={submitButtonStatus.value}
                onClick={handleSubmit}
              />
              {detailData.status !== InvoiceStatus.Pending ? (
                <CustomButton
                  size="small"
                  variant="primary"
                  properties="rounded"
                  buttonClass={styles.leftSpace}
                  onClick={handleMarkAsPaid}
                >
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
        {detailData.status !== InvoiceStatus.Paid &&
        detailData.status !== InvoiceStatus.Processing ? (
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            buttonClass={styles.rightSpace}
            onClick={() => {
              setVisible(true);
            }}
          >
            Pay
          </CustomButton>
        ) : null}
        <CustomButton
          size="small"
          variant="primary"
          properties="rounded"
          onClick={handleDownloadPDF}
        >
          PDF
        </CustomButton>
      </div>
    );
  };

  const getContentHeight = () => {
    if (isTablet && type == 'tisc') {
      return 'calc(var(--vh) * 100 - 232px)';
    }

    if (isTablet && type == 'brand') {
      return 'calc(var(--vh) * 100 - 224px)';
    }

    if (type == 'tisc') {
      return 'calc(var(--vh) * 100 - 304px)';
    }

    return 'calc(var(--vh) * 100 - 248px)';
  };

  return (
    <div>
      <EntryFormWrapper
        title={detailData?.name || ''}
        textAlignTitle="left"
        titleClassName={styles.detailLabel}
        contentStyles={{
          height: getContentHeight(),
          overflow: 'auto',
        }}
        handleCancel={history.goBack}
        extraFooterButton={renderBottom()}
        isRenderFooterContent={!!detailData}
        footerStyles={{ display: isTablet && type == 'tisc' ? 'none' : '' }}
      >
        {/* status */}
        <TextForm
          boxShadow
          label="Status"
          bodyTextClass={detailData?.status === InvoiceStatus.Overdue ? styles.overdue : ''}
        >
          {InvoiceStatus[detailData?.status]}
        </TextForm>

        {/* billed date */}
        <TextForm boxShadow label="Billed Date">
          {moment(detailData?.created_at).format('YYYY-MM-DD')}
        </TextForm>

        {/* due date */}
        <FormGroup
          label="Due Date"
          layout="vertical"
          formClass={styles.customFormGroup}
          labelColor="mono-color-dark"
        >
          <div className="flex-between" style={{ minHeight: 32 }}>
            <BodyText
              level={5}
              fontFamily="Roboto"
              style={{
                paddingLeft: 16,
                paddingRight: 16,
                color: detailData?.due_date ? '' : '#BFBFBF',
                whiteSpace: 'nowrap',
              }}
            >
              {detailData?.due_date ? detailData.due_date : dueDate}
            </BodyText>
            <BodyText level={5} fontFamily="Roboto">
              (annual interest rate of 36.5% applies to late payment)
            </BodyText>
          </div>
        </FormGroup>

        {/* order by */}
        <TextForm boxShadow label="Ordered By">
          {getFullName(detailData?.ordered_user)}
        </TextForm>

        {/* billing number */}
        <TextForm boxShadow label="Billing Number">
          {detailData?.name}
        </TextForm>

        {/* service type */}
        <TextForm boxShadow label="Service Type">
          {detailData?.service_type_name}
        </TextForm>

        {/* TISC  - brand company */}
        {type === 'tisc' ? (
          <TextForm boxShadow label="Brand Company">
            {detailData?.brand_name}
          </TextForm>
        ) : null}

        {/* overdue fines */}
        {/* {hideOverdueFines ? null : (
          <FormGroup
            label="Overdue Fines"
            layout="vertical"
            formClass={`${
              detailData?.status !== InvoiceStatus.Overdue ? styles.customFormGroup : ''
            }`}
            labelColor="mono-color-dark"
          >
            <table className={styles.customTable} style={{ width: '100%' }}>
              <tr>
                <td className={styles.label}>
                  <BodyText level={5} fontFamily="Roboto">
                    {detailData?.status !== InvoiceStatus.Paid
                      ? `as ${moment().format('YYYY-MM-DD')} `
                      : ''}
                  </BodyText>
                  {showBillingAmount && (
                    <PlusIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
                  )}
                </td>
                <td
                  className={`${showBillingAmount ? '' : styles.rightText}`}
                  style={{
                    width: quantityWidth,
                  }}
                >
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
                    }}
                  >
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
        )} */}

        <FormGroup
          label="Billed Amount"
          layout="vertical"
          formClass={styles.customTable}
          labelColor="mono-color-dark"
        >
          <table style={{ width: '100%' }}>
            <tr>
              <td className={styles.label}>
                <BodyText level={5} fontFamily="Roboto">
                  Unit Rate
                </BodyText>
              </td>
              <td
                style={{
                  width: quantityWidth,
                }}
              >
                ${formatToMoneyValue(Number(detailData?.unit_rate))}
              </td>
            </tr>
            <tr className={styles.borderBottom}>
              <td className={styles.label}>
                <BodyText level={5} fontFamily="Roboto">
                  Quantity
                </BodyText>
                <CloseIcon className={styles.iconStyles} />
              </td>
              <td
                style={{
                  width: quantityWidth,
                }}
              >
                {formatCurrencyNumber(Number(detailData?.quantity))}
              </td>
            </tr>
            <tr>
              <td className={styles.label}>
                <BodyText level={5} fontFamily="Roboto">
                  Gross Total
                </BodyText>
                <EqualIcon className={styles.iconStyles} />
              </td>
              <td
                style={{
                  width: quantityWidth,
                }}
              >
                {/* ${formatToMoneyValue(Number(detailData?.total_gross))} */}$
                {Number(detailData?.total_gross)}
              </td>
            </tr>
            <tr>
              <td className={styles.label}>
                <BodyText level={5} fontFamily="Roboto">
                  Sales Tax (GST) - {detailData?.tax}%
                </BodyText>
                <PlusIcon className={styles.iconStyles} />
              </td>
              <td
                style={{
                  width: quantityWidth,
                }}
              >
                {/* {formatToMoneyValue(Number(detailData?.sale_tax_amount))} */}$
                {Number(detailData?.sale_tax_amount)}
              </td>
            </tr>
            <tr className={styles.borderBottom}>
              <td className={styles.label}>
                <BodyText level={5} fontFamily="Roboto">
                  Overdue Payment Charges
                </BodyText>
                <PlusIcon className={styles.iconStyles} />
              </td>
              <td
                style={{
                  width: quantityWidth,
                }}
              >
                {/* ${formatToMoneyValue(Number(detailData?.overdue_amount))} */}$
                {Number(detailData?.overdue_amount)}
              </td>
            </tr>
            <tr>
              <td className={styles.label}>
                <BodyText level={5} fontFamily="Roboto">
                  TOTAL
                </BodyText>
                <EqualIcon className={styles.iconStyles} />
              </td>
              <td
                style={{
                  width: quantityWidth,
                }}
              >
                {/* ${formatToMoneyValue(Number(detailData?.billing_overdue_amount))} */}$
                {Number(detailData?.billing_overdue_amount)}
              </td>
            </tr>
            <tr>
              <td className={styles.label}>
                <BodyText level={5} fontFamily="Roboto">
                  3rd Party Payment Gateway Surcharge @3.5%
                </BodyText>
                <PlusIcon className={styles.iconStyles} />
              </td>
              {/* <td>${formatToMoneyValue(Number(detailData?.surcharge))}</td> */}
              <td>${Number(detailData?.surcharge)}</td>
            </tr>
            <tr className={styles.total}>
              <td className={styles.label}>
                <Title level={8}>GRAND TOTAL</Title>
                <EqualIcon className={styles.iconStyles} />
              </td>
              <td
                style={{
                  width: quantityWidth,
                }}
              >
                {/* <Title level={8}>${formatToMoneyValue(Number(detailData?.grand_total))}</Title> */}
                <Title level={8}>${Number(detailData?.grand_total)}</Title>
              </td>
            </tr>
          </table>
        </FormGroup>
      </EntryFormWrapper>

      <PaymentIntent visible={visible} setVisible={setVisible} onPaymentSuccess={setDetailData} />
    </div>
  );
};
