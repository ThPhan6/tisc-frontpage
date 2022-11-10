import { FC } from 'react';

import { Col, Row } from 'antd';
import { history } from 'umi';

import { ReactComponent as PlusIcon } from '@/assets/icons/action-plus-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as EqualIcon } from '@/assets/icons/equal-icon.svg';

import CustomButton from '@/components/Button';
import { FormGroup } from '@/components/Form';
import TextForm from '@/components/Form/TextForm';
import { TableHeader } from '@/components/Table/TableHeader';
import { BodyText, Title } from '@/components/Typography';

import styles from '../index.less';

interface ServiceDetailProps {
  type: 'tisc' | 'brand';
}
export const Detail: FC<ServiceDetailProps> = ({ type }) => {
  return (
    <Row>
      <Col span={12}>
        <div
          className={styles.detail}
          style={{ height: type === 'tisc' ? 'calc(100vh - 208px)' : 'calc(100vh - 158px)' }}>
          <TableHeader
            title="Brand Name"
            rightAction={<CloseIcon onClick={history.goBack} style={{ cursor: 'pointer' }} />}
          />
          <div
            style={{
              padding: '16px',
              height: type === 'tisc' ? 'calc(100vh - 304px)' : 'calc(100vh - 254px)',
              overflow: 'auto',
            }}>
            <TextForm boxShadow label="Billed Date">
              a
            </TextForm>
            <TextForm boxShadow label="Service Type">
              a
            </TextForm>
            <TextForm boxShadow label="Brand Company">
              a
            </TextForm>
            <TextForm boxShadow label="Ordered By">
              a
            </TextForm>
            <TextForm boxShadow label="Billing Number">
              a
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
                      Chargeable Rate
                    </BodyText>
                  </td>
                  <td className={styles.quantity}>$5.00</td>
                </tr>
                <tr className={styles.totalQuantity}>
                  <td className={styles.label}>
                    <BodyText level={5} fontFamily="Roboto">
                      Total Quantity
                    </BodyText>
                    <CloseIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
                  </td>
                  <td className={styles.quantity}>50</td>
                </tr>
                <tr>
                  <td className={styles.label}>
                    <BodyText level={5} fontFamily="Roboto">
                      Gross Total
                    </BodyText>
                    <EqualIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
                  </td>
                  <td className={styles.quantity}>$250.00</td>
                </tr>
                <tr>
                  <td className={styles.label}>
                    <BodyText level={5} fontFamily="Roboto">
                      Sales Tax (GST) - 0%
                    </BodyText>
                    <PlusIcon style={{ width: '18px', height: '18px', marginRight: '12px' }} />
                  </td>
                  <td className={styles.quantity}>$0.00</td>
                </tr>
                <tr className={styles.total}>
                  <td className={styles.label}>
                    <Title level={8}>TOTAL AMOUNT</Title>
                  </td>
                  <td className={styles.quantity}>
                    <Title level={8}>$0.00</Title>
                  </td>
                </tr>
              </table>
            </FormGroup>
            <TextForm boxShadow label="Due Date">
              a
            </TextForm>
            <TextForm boxShadow label="Status">
              a
            </TextForm>
            <TextForm boxShadow label="Overdue Fines">
              a
            </TextForm>
            <TextForm boxShadow label="Remark">
              a
            </TextForm>
          </div>
          <div className={styles.bottom}>
            <CustomButton size="small" variant="primary" properties="rounded">
              {type === 'tisc' ? 'Remind' : 'Pay'}
            </CustomButton>
          </div>
        </div>
      </Col>
    </Row>
  );
};
