import { FC, useEffect, useState } from 'react';

import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import { useLocation } from 'umi';

import { useScreen } from '@/helper/common';
import { downloadFile, throttleAction } from '@/helper/utils';
import { exportInventoryCSV, importInventoryCSV } from '@/services/inventory.api';
import { isEmpty, pick } from 'lodash';

import { ImportStep } from './types/import.type';
import { ImportExportTab, LIST_TAB } from './types/tab.type';
import { resetState, setStep } from '@/features/Import/reducers';
import { ExportRequest } from '@/features/Import/types/export.type';
import store, { useAppSelector } from '@/reducers';

import CustomButton from '@/components/Button';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { BodyText } from '@/components/Typography';
import { Export } from '@/features/Import/components/Export';
import { Step as Import } from '@/features/Import/components/Step';

import styles from './index.less';

interface ImportExportModalProps extends ModalProps {
  onSave?: (type: 'import' | 'export', isSaved?: boolean) => void;
}

export const ImportExportModal: FC<ImportExportModalProps> = ({ onSave, ...props }) => {
  const { isTablet } = useScreen();
  const location = useLocation<{ categoryId: string }>();

  const fileUploaded = useAppSelector((s) => s.import.fileUploaded);
  const step = useAppSelector((s) => s.import.step);
  const error = useAppSelector((s) => s.import.error ?? {});
  const dataImport = useAppSelector((s) => s.import.dataImport);
  const exportType = useAppSelector((s) => s.import.exportType);

  const [activeKey, setActiveKey] = useState<ImportExportTab>('import');
  const [importError, setImportError] = useState(false);

  const isImport = activeKey === 'import';
  const disabledImportBtn = !dataImport.length || step !== ImportStep.STEP_3;
  const disabledExportBtn = isEmpty(exportType);

  const hasError =
    (importError || Object.keys(error).length > 0) && isImport && step === ImportStep.STEP_3;

  const clearState = () => {
    setActiveKey('import');
    setImportError(false);
    store.dispatch(resetState());
  };

  useEffect(() => {
    setImportError(false);
  }, [JSON.stringify(fileUploaded), step]);

  useEffect(() => {
    return () => {
      clearState();
    };
  }, []);

  const handleImport = async () => {
    const imported = await importInventoryCSV(
      dataImport.map((item) => ({
        ...pick(item, ['sku', 'description', 'unit_price', 'unit_type']),
        description: item?.description ?? '',
        on_order: item?.on_order || 0,
        back_order: item?.back_order || 0,
        volume_prices: item?.volume_prices ?? [],
        inventory_category_id: location.state?.categoryId,
      })),
    );

    if (imported) {
      clearState();
    }

    setImportError(!imported);
    onSave?.('import', imported);
  };

  const handleExport = async () => {
    const payload: ExportRequest = {
      category_id: location.state.categoryId,
      types: exportType,
    };
    const res = await exportInventoryCSV(payload);
    downloadFile([res], `inventory-export-${new Date().toISOString()}.csv`, { type: 'text/csv' });

    onSave?.('export', !!res);
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

  return (
    <Modal
      className={styles.container}
      width={!isTablet ? '30%' : '80%'}
      footer={null}
      title={
        <BodyText fontFamily="Cormorant-Garamond" level={3} customClass="font-semibold">
          Import/Export
        </BodyText>
      }
      maskClosable={false}
      {...props}
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

        <div className="footer" style={{ justifyContent: hasError ? 'space-between' : 'flex-end' }}>
          {hasError ? (
            <BodyText fontFamily="Roboto" level={5}>
              No data error or <span className="red-magenta">Data error!</span>
            </BodyText>
          ) : null}

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
              disabled={isImport ? disabledImportBtn : disabledExportBtn}
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
