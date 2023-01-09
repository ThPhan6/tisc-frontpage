import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row, message } from 'antd';

import { createService, getOneService, updateService } from '@/features/services/api';
import { ServiceEntryForm } from '@/features/services/components/ServiceEntryForm';
import { ServiceHeader } from '@/features/services/components/ServiceHeader';
import styles from '@/features/services/index.less';
import { resetServiceFormData, setServiceFormData } from '@/features/services/reducer';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import { getFullName } from '@/helper/utils';

import store, { useAppSelector } from '@/reducers';
import { openModal } from '@/reducers/modal';

import CustomButton from '@/components/Button';
import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const ServiceCreatePage = () => {
  const submitButtonStatus = useBoolean();

  const serviceFormData = useAppSelector((state) => state.service.service);

  const idService = useGetParamId();

  const [typeHandleSubmit, setTypeHandleSubmit] = useState<'view' | 'update' | ''>('');

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
    return;
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

  const handleCancel = () => {
    pushTo(PATH.tiscRevenueService);
    store.dispatch(resetServiceFormData());
  };

  return (
    <ServiceHeader>
      <div className={styles.serviceForm}>
        <TableHeader title="SERVICES" rightAction={<CustomPlusButton disabled />} />
        <Row style={{ marginTop: '8px' }}>
          <Col span={24} lg={{ span: 12 }} style={{ background: '#fff' }}>
            <ServiceEntryForm
              handleCancel={handleCancel}
              setVisible={() =>
                store.dispatch(
                  openModal({
                    type: 'Brand Company',
                    title: 'SELECT COMPANY',
                  }),
                )
              }
              type={typeHandleSubmit}
            />
            <div className={styles.bottom}>
              {!idService ? (
                <>
                  <CustomButton
                    size="small"
                    variant="primary"
                    properties="rounded"
                    buttonClass={styles.cancel}
                    onClick={handleCancel}
                  >
                    Cancel
                  </CustomButton>
                  <CustomSaveButton
                    onClick={handleCreateService}
                    isSuccess={submitButtonStatus.value}
                    contentButton="Create"
                  />
                </>
              ) : (
                <CustomSaveButton
                  onClick={handleUpdateService}
                  isSuccess={submitButtonStatus.value}
                  contentButton={typeHandleSubmit === 'view' ? 'Edit' : 'Save'}
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
    </ServiceHeader>
  );
};
export default ServiceCreatePage;
