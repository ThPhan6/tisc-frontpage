import { FC, useState } from 'react';

import Modal, { ModalProps } from 'antd/lib/modal/Modal';
import { useLocation } from 'umi';

import { useImport } from './hooks/useImport';
import { useExport } from '@/features/Import/hooks/useExport';
import { isEmpty } from 'lodash';

import { ImportExportTab, LIST_TAB } from './types/tab.type';

import CustomButton from '@/components/Button';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import { BodyText } from '@/components/Typography';
import { ExportCSV } from '@/features/Import/components/Export';
import { Import } from '@/features/Import/components/Import';

import styles from './index.less';

interface ImportExportModalProps extends ModalProps {}

export const ImportExportModal: FC<ImportExportModalProps> = ({ ...props }) => {
  const [activeKey, setActiveKey] = useState<ImportExportTab>('import');

  const { handleImport } = useImport();
  const { selectedFiels, handleExport } = useExport();
  const location = useLocation<{
    categoryId: string;
  }>();

  const isImport = activeKey === 'import';
  const disabledImportBtn = true;
  const disabledExportBtn = isEmpty(selectedFiels);

  return (
    <div className={`${styles.container}`}>
      <Modal
        className={styles.container}
        width="30%"
        footer={null}
        title={
          <BodyText fontFamily="Cormorant-Garamond" level={3} customClass="font-semibold">
            Import/Export
          </BodyText>
        }
        {...props}
      >
        <div className="content">
          <div className="d-flex flex-col flex-1">
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

            <CustomTabPane active={activeKey === 'import'}>
              <Import />
            </CustomTabPane>

            <CustomTabPane active={activeKey === 'export'}>
              <ExportCSV />
            </CustomTabPane>
          </div>

          <div className="footer">
            <CustomButton
              size="small"
              variant="primary"
              properties="rounded"
              disabled={isImport ? disabledImportBtn : disabledExportBtn}
            >
              <BodyText
                fontFamily="Roboto"
                level={6}
                onClick={isImport ? handleImport : handleExport(location.state.categoryId)}
              >
                {isImport ? 'Import' : 'Export'}
              </BodyText>
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};
