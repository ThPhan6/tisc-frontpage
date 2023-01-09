import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row, message } from 'antd';
import { history } from 'umi';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import {
  createService,
  deleteService,
  getOneService,
  getServiceType,
  updateService,
} from '@/features/services/api';
import { ServiceHeader } from '@/features/services/components/ServiceHeader';
import styles from '@/features/services/index.less';
import { resetServiceFormData, setServiceFormData } from '@/features/services/reducer';
import { formatToMoneyValue } from '@/features/services/util';
import { confirmDelete, useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { getFullName } from '@/helper/utils';

import store, { useAppSelector } from '@/reducers';
import { openModal } from '@/reducers/modal';
import { GeneralData } from '@/types';

import CustomButton from '@/components/Button';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { MaskedNumberInput } from '@/components/CustomNumberInput.tsx';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import { EntryFormWrapper } from '@/components/EntryForm';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { MainTitle, Title } from '@/components/Typography';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const ServiceCreatePage = () => {
  const { isMobile } = useScreen();

  const submitButtonStatus = useBoolean();

  const serviceFormData = useAppSelector((state) => state.service.service);

  const idService = useGetParamId();

  const [serviceType, setServiceType] = useState<GeneralData[]>([]);

  const [typeHandleSubmit, setTypeHandleSubmit] = useState<'view' | 'update' | ''>('');

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

  useEffect(() => {
    if (idService) {
      setTypeHandleSubmit('view');
      getOneService(idService).then((res) => {
        if (res) {
          store.dispatch(
            setServiceFormData({
              service_type_id: res.service_type_id,
              brand_name: res.brand_name,
              brand_id: res.relation_id,
              ordered_by: res.ordered_by,
              unit_rate: res.unit_rate,
              quantity: res.quantity,
              tax: res.tax,
              remark: res.remark,
              ordered_by_name: getFullName(res.ordered_user),
            }),
          );
        }
      });
    }
  }, []);

  const validateValueServices = () => {
    if (!serviceFormData.service_type_id) {
      return message.error('Service type is required');
    }
    if (!serviceFormData.brand_id) {
      return message.error('Brand is required');
    }
    if (!serviceFormData.ordered_by) {
      return message.error('Ordered by is required');
    }
    if (serviceFormData.unit_rate === '') {
      return message.error('Please enter unit rate');
    }
    if (Number(serviceFormData.unit_rate) === 0) {
      return message.error('Unit rate must be greater than 0');
    }
    if (serviceFormData.quantity === '') {
      return message.error('Please enter quantity');
    }
    if (Number(serviceFormData.quantity) === 0) {
      return message.error('Quantity must be greater than 0');
    }
    if (serviceFormData.tax === '') {
      return message.error('Please enter tax number');
    }

    return undefined;
  };

  const summaryBillingAmount = () => {
    const grossTotal = Number(serviceFormData.unit_rate) * Number(serviceFormData.quantity);
    const salesTax = (Number(serviceFormData.tax) / 100) * grossTotal;
    return formatToMoneyValue(grossTotal + salesTax);
  };

  const handleCancel = () => {
    pushTo(PATH.tiscRevenueService);
    store.dispatch(resetServiceFormData());
  };

  const handleDeleteService = () => {
    if (!idService) {
      message.error('Service not found');
      return;
    }

    confirmDelete(() => {
      deleteService(idService).then((isSuccess) => {
        if (isSuccess) {
          history.goBack();
        }
      });
    });
  };

  const handleCreateService = () => {
    showPageLoading();
    createService(serviceFormData).then((isSuccess) => {
      validateValueServices();
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.tiscRevenueService);
          store.dispatch(resetServiceFormData());
        }, 1000);
      }
      hidePageLoading();
    });
  };

  const handleUpdateService = () => {
    if (typeHandleSubmit === 'view') {
      setTypeHandleSubmit('update');
      return;
    }
    showPageLoading();
    updateService(idService, serviceFormData).then((isSuccess) => {
      validateValueServices();
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 1000);
      }
      hidePageLoading();
    });
  };

  const getContentHeight = () => {
    if (isMobile) {
      return 'calc(100vh - 280px)';
    }

    return 'calc(100vh - 304px)';
  };

  const renderFooterButton = () => {
    if (!idService) {
      return (
        <div className="flex-start">
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            onClick={handleCancel}
            style={{ marginRight: 16 }}>
            Cancel
          </CustomButton>
          <CustomSaveButton
            onClick={handleCreateService}
            isSuccess={submitButtonStatus.value}
            contentButton="Create"
          />
        </div>
      );
    }

    return (
      <div className="flex-start">
        {isMobile ? (
          <CustomButton
            size="small"
            variant="secondary"
            properties="rounded"
            onClick={handleDeleteService}
            style={{ marginRight: 16 }}>
            Delete
          </CustomButton>
        ) : null}
        <CustomSaveButton
          onClick={handleUpdateService}
          isSuccess={submitButtonStatus.value}
          contentButton={typeHandleSubmit === 'view' ? 'Edit' : 'Save'}
        />
      </div>
    );
  };

  return (
    <ServiceHeader>
      <div className={styles.serviceForm}>
        <TableHeader title="SERVICES" rightAction={<CustomPlusButton disabled />} />
        <EntryFormWrapper
          submitButtonStatus={submitButtonStatus.value}
          handleCancel={handleCancel}
          contentStyles={{
            height: getContentHeight(),
            overflow: 'auto',
          }}
          extraFooterButton={renderFooterButton()}>
          <FormGroup
            label="Service type"
            required
            layout="vertical"
            formClass={`${serviceFormData.service_type_id !== '' ? styles.activeText : ''} ${
              typeHandleSubmit === 'view' ? styles.text : ''
            }  `}
            style={{ marginBottom: '16px' }}>
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
              collapsible={typeHandleSubmit === 'view'}
            />
          </FormGroup>
          <InputGroup
            label="Brand Company"
            required
            fontLevel={3}
            value={serviceFormData.brand_name}
            hasPadding
            colorPrimaryDark={typeHandleSubmit !== 'view'}
            hasBoxShadow
            hasHeight
            rightIcon
            disabled={typeHandleSubmit === 'view'}
            onRightIconClick={
              typeHandleSubmit !== 'view'
                ? () =>
                    store.dispatch(
                      openModal({
                        type: 'Brand Company',
                        title: 'SELECT COMPANY',
                      }),
                    )
                : undefined
            }
            placeholder={
              serviceFormData.brand_id === '' ? 'select from the list' : serviceFormData.brand_name
            }
          />
          <InputGroup
            label="Ordered By"
            required
            fontLevel={3}
            hasBoxShadow
            colorPrimaryDark={typeHandleSubmit !== 'view'}
            hasPadding
            hasHeight
            readOnly
            value={serviceFormData.ordered_by_name}
          />
          <FormGroup
            label="Chargeable Rate / Total Quantity / Sales Tax"
            layout="vertical"
            required
            style={{ marginBottom: '16px' }}>
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
                    readOnly={typeHandleSubmit === 'view'}
                    containerClass={typeHandleSubmit !== 'view' ? styles.customInput : ''}
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
                    readOnly={typeHandleSubmit === 'view'}
                    containerClass={typeHandleSubmit !== 'view' ? styles.customInput : ''}
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
                    readOnly={typeHandleSubmit === 'view'}
                    containerClass={typeHandleSubmit !== 'view' ? styles.customInput : ''}
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
                    }}>
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
            colorPrimaryDark={typeHandleSubmit !== 'view'}
            value={serviceFormData.remark}
            onChange={(e) =>
              store.dispatch(setServiceFormData({ ...serviceFormData, remark: e.target.value }))
            }
            readOnly={typeHandleSubmit === 'view'}
          />
        </EntryFormWrapper>
      </div>
    </ServiceHeader>
  );
};
export default ServiceCreatePage;
