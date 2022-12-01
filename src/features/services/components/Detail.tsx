import { FC, useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row } from 'antd';
import { history } from 'umi';

import { ReactComponent as PlusIcon } from '@/assets/icons/action-plus-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as EqualIcon } from '@/assets/icons/equal-icon.svg';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { formatNumberDisplay, getFullName } from '@/helper/utils';

import { InvoiceStatus, ServicesResponse } from '../type';

import CustomButton from '@/components/Button';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { FormGroup } from '@/components/Form';
import TextForm from '@/components/Form/TextForm';
import { TableHeader } from '@/components/Table/TableHeader';
import { BodyText, Title } from '@/components/Typography';

import { getOneService, getServicePDF, markAsPaid, sendBill, sendRemind } from '../api';
import styles from '../index.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';
import moment from 'moment';

interface ServiceDetailProps {
  type: 'tisc' | 'brand';
  id: string;
}
export const Detail: FC<ServiceDetailProps> = ({ type, id }) => {
  const [detailData, setDetailData] = useState<ServicesResponse>();

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
          {detailData?.status !== InvoiceStatus.Paid && (
            <>
              <CustomSaveButton
                contentButton={detailData?.status === InvoiceStatus.Pending ? 'Bill' : 'Remind'}
                isSuccess={submitButtonStatus.value}
                onClick={handleSubmit}
              />
              {detailData?.status !== InvoiceStatus.Pending && (
                <CustomButton
                  size="small"
                  variant="primary"
                  properties="rounded"
                  buttonClass={styles.rightButton}
                  onClick={handleMarkAsPaid}>
                  Mark as Paid
                </CustomButton>
              )}
            </>
          )}
        </>
      );
    }

    return (
      <>
        {detailData?.status !== InvoiceStatus.Paid && (
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            onClick={() => alert('Coming soon!')}>
            Pay
          </CustomButton>
        )}
        <CustomButton
          size="small"
          variant="primary"
          properties="rounded"
          buttonClass={styles.rightButton}
          onClick={handleDownloadPDF}>
          PDF
        </CustomButton>
      </>
    );
  };

  return (
    <Row>
      <Col span={12}>
        <div
          className={styles.detail}
          style={{ height: type === 'tisc' ? 'calc(100vh - 208px)' : 'calc(100vh - 158px)' }}>
          <TableHeader
            title={detailData?.name}
            rightAction={<CloseIcon onClick={history.goBack} style={{ cursor: 'pointer' }} />}
          />
          <div
            style={{
              padding: '16px',
              height: type === 'tisc' ? 'calc(100vh - 304px)' : 'calc(100vh - 254px)',
              overflow: 'auto',
            }}>
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
                  <td className={styles.quantity}>
                    ${formatNumberDisplay(Number(detailData?.unit_rate))}
                  </td>
                </tr>
                <tr className={styles.totalQuantity}>
                  <td className={styles.label}>
                    <BodyText level={5} fontFamily="Roboto">
                      Total Quantity
                    </BodyText>
                    <CloseIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
                  </td>
                  <td className={styles.quantity}>{detailData?.quantity}</td>
                </tr>
                <tr>
                  <td className={styles.label}>
                    <BodyText level={5} fontFamily="Roboto">
                      Gross Total
                    </BodyText>
                    <EqualIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
                  </td>
                  <td className={styles.quantity}>
                    {formatNumberDisplay(Number(detailData?.total_gross))}
                  </td>
                </tr>
                <tr>
                  <td className={styles.label}>
                    <BodyText level={5} fontFamily="Roboto">
                      Sales Tax (GST) - {detailData?.tax}%
                    </BodyText>
                    <PlusIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
                  </td>
                  <td className={styles.quantity}>
                    ${formatNumberDisplay(Number(detailData?.sale_tax_amount))}
                  </td>
                </tr>
                <tr className={styles.total}>
                  <td className={styles.label}>
                    <Title level={8}>TOTAL AMOUNT</Title>
                  </td>
                  <td className={styles.quantity}>
                    <Title level={8}>
                      ${formatNumberDisplay(Number(detailData?.billing_amount))}
                    </Title>
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
                <BodyText level={5} fontFamily="Roboto" style={{ paddingLeft: '16px' }}>
                  {detailData?.due_date}
                </BodyText>
                <BodyText level={5} fontFamily="Roboto">
                  (annual interest rate of 36.5% applies to late payment)
                </BodyText>
              </div>
            </FormGroup>
            <FormGroup
              label="Overdue Fines"
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
                <BodyText level={5} fontFamily="Roboto" style={{ paddingLeft: '16px' }}>
                  as {moment().format('YYYY-MM-DD')}
                </BodyText>
                <BodyText level={5} fontFamily="Roboto">
                  ${formatNumberDisplay(Number(detailData?.overdue_amount))}
                </BodyText>
              </div>
            </FormGroup>
            <TextForm
              boxShadow
              label="Status"
              bodyTextClass={detailData?.status === InvoiceStatus.Overdue ? styles.overdue : ''}>
              {InvoiceStatus[detailData?.status as number]}
            </TextForm>
          </div>
          <div className={styles.bottom}>{renderBottom()}</div>
        </div>
      </Col>
    </Row>
  );
};
