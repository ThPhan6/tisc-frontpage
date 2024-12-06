import { FC, useEffect, useState } from 'react';

import { CompanyFunctionGroup } from '@/constants/util';
import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import { useLocation } from 'umi';

import { useScreen } from '@/helper/common';
import { downloadFile, throttleAction } from '@/helper/utils';
import { exportInventoryCSV, importInventoryCSV } from '@/services/inventory.api';
import { pick } from 'lodash';

import { ImportStep } from './types/import.type';
import { ImportExportTab, LIST_TAB } from './types/tab.type';
import { resetState, setStep, setWarehouses } from '@/features/Import/reducers';
import { ExportRequest } from '@/features/Import/types/export.type';
import store, { useAppSelector } from '@/reducers';

import CustomButton from '@/components/Button';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { BodyText } from '@/components/Typography';
import { Export } from '@/features/Import/components/Export';
import { Step as Import } from '@/features/Import/components/Step';

import { getLocationPagination } from '../locations/api';
import styles from './index.less';
import moment from 'moment';

interface ImportExportModalProps extends Omit<ModalProps, 'open'> {
  onSave?: (type: 'import' | 'export', isSaved?: boolean) => void;
}

export const ImportExportModal: FC<ImportExportModalProps> = ({ onSave, ...props }) => {
  const isTablet = useScreen().isTablet;
  const location = useLocation<{ categoryId: string }>();
  const queryParams = new URLSearchParams(location.search);
  const brandName = store.getState().user.user?.brand?.name;
  const categoryName = queryParams.get('categories')?.split(' / ').pop();

  const open = useAppSelector((s) => s.import.open);
  const warehouses = useAppSelector((s) => s.import.warehouses);
  const step = useAppSelector((s) => s.import.step);
  const error = useAppSelector((s) => s.import.error ?? {});
  const dataImport = useAppSelector((s) => s.import.dataImport);
  const selectedExportTypes = useAppSelector((s) => s.import.selectedExportTypes);

  const [activeKey, setActiveKey] = useState<ImportExportTab>('import');

  const isImport = activeKey === 'import';
  const hasError = Object.keys(error).length > 0 && isImport && step === ImportStep.STEP_3;

  const disabledImportBtn = hasError || !dataImport.length || step !== ImportStep.STEP_3;

  const clearState = () => {
    setActiveKey('import');
    store.dispatch(resetState());
  };

  useEffect(() => {
    getLocationPagination(
      {
        sort: 'business_name',
        order: 'ASC',
      },
      (ws) => {
        store.dispatch(
          setWarehouses(
            ws?.data.filter((warehouse: any) =>
              warehouse.functional_type.toLowerCase().includes(CompanyFunctionGroup.warehouse),
            ) ?? [],
          ),
        );
      },
    );
  }, []);

  useEffect(() => {
    return () => {
      clearState();
    };
  }, []);

  const handleImport = async () => {
    const imported = await importInventoryCSV(
      dataImport.map((item) => ({
        ...pick(item, [
          'sku',
          'description',
          'unit_price',
          'unit_type',
          'on_order',
          'back_order',
          'warehouses',
        ]),
        inventory_category_id: location.state?.categoryId,
      })),
    );

    if (imported) {
      clearState();
    }

    onSave?.('import', imported);
  };

  const generateFileName = () => {
    const date = moment().format('YYYYMMDD');
    const randomCode = moment().unix();
    return `${brandName}-${categoryName}-${date}-${randomCode}`;
  };

  const handleExport = async () => {
    const payload: ExportRequest = {
      types: selectedExportTypes,
      category_id: location.state.categoryId,
    };

    const res = await exportInventoryCSV(payload);
    if (res) {
      downloadFile([res], generateFileName(), { type: 'text/csv' });
      onSave?.('export', !!res);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
    clearState();
    props.onCancel?.(e);
  };

  const handleSave = () => {
    if (activeKey === 'import') {
      handleImport();
      return;
    }

    handleExport();
  };

  const handleBack = () => {
    store.dispatch(setStep(ImportStep.STEP_2));
  };

  const renderErrorMessage = () => {
    if (step !== ImportStep.STEP_3 || !isImport) return null;

    return hasError ? (
      <BodyText fontFamily="Roboto" level={5} customClass="red-magenta">
        Data error!
      </BodyText>
    ) : (
      <BodyText fontFamily="Roboto" level={5}>
        No data error
      </BodyText>
    );
  };

  return (
    <Modal
      className={styles.container}
      width={!isTablet ? '60%' : '80%'}
      footer={null}
      title={
        <BodyText fontFamily="Cormorant-Garamond" level={3} customClass="font-semibold">
          Import/Export
        </BodyText>
      }
      maskClosable={false}
      {...props}
      visible={open}
      onCancel={handleCancel}
    >
      <div className="content">
        <div className="d-flex flex-col flex-1 overflow-auto">
          <CustomTabs
            listTab={LIST_TAB}
            centered={true}
            tabPosition="top"
            tabDisplay="space"
            activeKey={activeKey}
            onChange={(key) => {
              setActiveKey(key as ImportExportTab);
            }}
          />

          <CustomTabPane active={activeKey === 'import'} className="overflow-auto h-full">
            <Import />
          </CustomTabPane>

          <CustomTabPane active={activeKey === 'export'} className="overflow-auto h-full">
            <Export />
          </CustomTabPane>
        </div>

        <div
          className="footer"
          style={{
            justifyContent: step === ImportStep.STEP_3 && isImport ? 'space-between' : 'flex-end',
          }}
        >
          {renderErrorMessage()}

          <div className="d-flex items-center" style={{ gap: 16 }}>
            {activeKey === 'import' && step === ImportStep.STEP_3 ? (
              <CustomButton
                size="small"
                variant="text"
                properties="rounded"
                buttonClass="back-button"
              >
                <BodyText fontFamily="Roboto" level={6} onClick={handleBack}>
                  Back
                </BodyText>
              </CustomButton>
            ) : null}

            <CustomButton
              size="small"
              variant="primary"
              properties="rounded"
              disabled={isImport && disabledImportBtn}
            >
              <BodyText fontFamily="Roboto" level={6} onClick={throttleAction(handleSave)}>
                {activeKey === 'import' ? 'Import' : 'Export'}
              </BodyText>
            </CustomButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};
