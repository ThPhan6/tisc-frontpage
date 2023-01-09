import { FC, useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useScreen } from '@/helper/common';

import { setServiceFormData } from '../reducer';
import store, { useAppSelector } from '@/reducers';
import { GeneralData } from '@/types';

import { MaskedNumberInput } from '@/components/CustomNumberInput.tsx';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { MainTitle, Title } from '@/components/Typography';

import { getServiceType } from '../api';
import styles from '../index.less';
import { formatToMoneyValue } from '../util';

interface ServicFormProps {
  handleCancel: () => void;
  setVisible: () => void;
  type: 'view' | 'update' | '';
}

export const ServiceEntryForm: FC<ServicFormProps> = ({ handleCancel, setVisible, type }) => {
  const serviceFormData = useAppSelector((state) => state.service.service);

  const [serviceType, setServiceType] = useState<GeneralData[]>([]);

  const isMobile = useScreen().isMobile;

  const serviceTypeValue = serviceType.find(
    (item) => item.id === serviceFormData.service_type_id,
  ) ?? {
    name: serviceFormData.service_type_id,
    id: '',
  };

  useEffect(() => {
    getServiceType().then((res) => {
      if (res) {
        setServiceType(res);
      }
    });
  }, []);

  const summaryBillingAmount = () => {
    const grossTotal = Number(serviceFormData.unit_rate) * Number(serviceFormData.quantity);
    const salesTax = (Number(serviceFormData.tax) / 100) * grossTotal;
    return formatToMoneyValue(grossTotal + salesTax);
  };

  const getContentHeight = () => {
    if (isMobile) {
      return 'calc(100vh - 280px)';
    }

    return 'calc(100vh - 304px)';
  };

  return (
    <>
      <div className={styles.header}>
        <MainTitle level={3} textAlign={'center'} customClass={styles.header__title}>
          Entry Form
        </MainTitle>
        <CloseIcon
          style={{ cursor: 'pointer', width: '18px', height: '18px' }}
          onClick={handleCancel}
        />
      </div>
      <div className={styles.customForm} style={{ height: getContentHeight() }}>
        <FormGroup
          label="Service type"
          required
          layout="vertical"
          formClass={`${serviceFormData.service_type_id !== '' ? styles.activeText : ''} ${
            type === 'view' ? styles.text : ''
          }  `}
          style={{ marginBottom: '16px' }}
        >
          <CollapseRadioList
            options={serviceType.map((item) => {
              return {
                label: item.name,
                value: item.id,
              };
            })}
            placeholder={
              serviceFormData.service_type_id === ''
                ? 'select from the list'
                : serviceTypeValue.name
            }
            otherInput
            inputPlaceholder="please specify"
            onChange={(checkedItem) => {
              store.dispatch(
                setServiceFormData({
                  ...serviceFormData,
                  service_type_id: String(
                    checkedItem.value === 'other' ? checkedItem.label : checkedItem.value,
                  ),
                }),
              );
            }}
            checked={serviceFormData.service_type_id}
            collapsible={type === 'view'}
          />
        </FormGroup>
        <InputGroup
          label="Brand Company"
          required
          fontLevel={3}
          value={serviceFormData.brand_name}
          hasPadding
          colorPrimaryDark={type !== 'view'}
          hasBoxShadow
          hasHeight
          rightIcon
          disabled={type === 'view'}
          onRightIconClick={type !== 'view' ? setVisible : undefined}
          placeholder={
            serviceFormData.brand_id === '' ? 'select from the list' : serviceFormData.brand_name
          }
        />
        <InputGroup
          label="Ordered By"
          required
          fontLevel={3}
          hasBoxShadow
          colorPrimaryDark={type !== 'view'}
          hasPadding
          hasHeight
          readOnly
          value={serviceFormData.ordered_by_name}
        />
        <FormGroup
          label="Chargeable Rate / Total Quantity / Sales Tax"
          layout="vertical"
          required
          style={{ marginBottom: '16px' }}
        >
          <Row gutter={[24, 8]}>
            <Col span={8}>
              <div className={styles.item}>
                <MainTitle level={4} style={{ width: '80%' }}>
                  Unit Rate
                </MainTitle>
                <MaskedNumberInput
                  placeholder="0.00"
                  value={serviceFormData.unit_rate}
                  onChange={(e) => {
                    store.dispatch(
                      setServiceFormData({
                        ...serviceFormData,
                        unit_rate: e.target.value.replaceAll(/,/g, ''),
                      }),
                    );
                  }}
                  readOnly={type === 'view'}
                  containerClass={type !== 'view' ? styles.customInput : ''}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.item}>
                <MainTitle level={4} style={{ width: '80%' }}>
                  Quantity
                </MainTitle>
                <MaskedNumberInput
                  placeholder="0"
                  integerLimit={6}
                  decimalLimit={0}
                  value={serviceFormData.quantity}
                  onChange={(e) => {
                    store.dispatch(
                      setServiceFormData({
                        ...serviceFormData,
                        quantity: Number(e.target.value.replaceAll(/,/g, '')),
                      }),
                    );
                  }}
                  readOnly={type === 'view'}
                  containerClass={type !== 'view' ? styles.customInput : ''}
                />
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <DropupIcon
                    onClick={() =>
                      store.dispatch(
                        setServiceFormData({
                          ...serviceFormData,
                          quantity: Number(serviceFormData.quantity) + 1,
                        }),
                      )
                    }
                  />
                  <DropdownIcon
                    onClick={() => {
                      if (serviceFormData.quantity === 0) return;
                      store.dispatch(
                        setServiceFormData({
                          ...serviceFormData,
                          quantity: Number(serviceFormData.quantity) - 1,
                        }),
                      );
                    }}
                  />
                </span>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.item}>
                <MainTitle level={4} style={{ width: '50%' }}>
                  Tax (%)
                </MainTitle>
                <MaskedNumberInput
                  placeholder="0"
                  value={serviceFormData.tax}
                  onChange={(e) => {
                    store.dispatch(
                      setServiceFormData({
                        ...serviceFormData,
                        tax: e.target.value.replaceAll(/,/g, ''),
                      }),
                    );
                  }}
                  readOnly={type === 'view'}
                  containerClass={type !== 'view' ? styles.customInput : ''}
                />
              </div>
            </Col>
          </Row>
        </FormGroup>
        <FormGroup label="Billing Amount" layout="vertical" formClass={styles.borderBottom}>
          <Row gutter={[24, 8]}>
            <Col span={16}></Col>
            <Col span={8}>
              <div className={styles.bill}>
                <Title level={8}>US$</Title>
                <Title
                  level={8}
                  style={{
                    marginLeft: '16px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {summaryBillingAmount()}
                </Title>
              </div>
            </Col>
          </Row>
        </FormGroup>
        <InputGroup
          label="Remark :"
          fontLevel={3}
          hasBoxShadow
          hasPadding
          hasHeight
          placeholder="type text"
          colorPrimaryDark={type !== 'view'}
          value={serviceFormData.remark}
          onChange={(e) =>
            store.dispatch(setServiceFormData({ ...serviceFormData, remark: e.target.value }))
          }
          readOnly={type === 'view'}
        />
      </div>
    </>
  );
};
