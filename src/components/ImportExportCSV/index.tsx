import { useState } from 'react';

import {
  Button,
  Modal,
  Select,
  Steps,
  Table,
  Tabs,
  TabsProps,
  Upload,
  UploadFile,
  message,
} from 'antd';

import { ReactComponent as CloseIcon } from '@/assets/icons/action-close-open-icon.svg';
import { ReactComponent as UploadIcon } from '@/assets/icons/action-upload-icon.svg';
import { ReactComponent as ActionRight } from '@/assets/icons/line-right-blue-24.svg';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import styles from '@/components/ImportExportCSV/ImportExportCSV.less';
import { CormorantBodyText, RobotoBodyText } from '@/components/Typography';

const { Dragger } = Upload;
const { Step } = Steps;
const { Option } = Select;

type UploadStatus = 'success' | 'error' | '';

interface ColumnMapping {
  csvHeader: string;
  dbHeader: string;
  status: UploadStatus;
}

interface ImportExportCSVProps {
  open: boolean;
  onCancel: () => void;
  dbHeaders: string[];
  onExport: () => void;
  onImport: (data: ColumnMapping[] | undefined) => void;
}

const ImportExportCSV = ({
  open,
  onCancel,
  dbHeaders,
  onExport,
  onImport,
}: ImportExportCSVProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping[]>();

  const handleFileUpload = (info: any) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.fileName} file uploaded successfully.`);
      setFileList([info.file]);

      const dummyMappings: ColumnMapping[] = [
        { csvHeader: 'Part', dbHeader: '', status: '' },
        { csvHeader: 'Description', dbHeader: '', status: '' },
        { csvHeader: 'Price Rate', dbHeader: '', status: '' },
        { csvHeader: 'UOM', dbHeader: '', status: '' },
        { csvHeader: 'Available', dbHeader: '', status: '' },
        { csvHeader: 'On Order', dbHeader: '', status: '' },
        { csvHeader: 'Short', dbHeader: '', status: '' },
        { csvHeader: 'Backorder', dbHeader: '', status: '' },
      ];
      setColumnMapping(dummyMappings);
      setCurrentStep(1);
    }

    if (status === 'error') message.error(`${info.file.fileName} file update failed.`);
  };

  const handleColumnMapping = (csvHeader: string, dbHeader: string) => {
    setColumnMapping((prev) =>
      prev?.map((mapping) =>
        mapping.csvHeader === csvHeader
          ? { ...mapping, dbHeader, status: dbHeader ? 'success' : '' }
          : mapping,
      ),
    );
  };

  const handleImport = () => {
    message.success('Data imported successfully');
    onImport(columnMapping);
    setCurrentStep(0);
    setFileList([]);
    setColumnMapping([]);
  };

  const steps = [
    {
      title: (
        <div className={`d-flex items-center gap-8 `}>
          File Upload
          <ActionRight width={24} height={24} />
        </div>
      ),
      content: (
        <Dragger
          accept=".csv"
          fileList={fileList}
          onChange={handleFileUpload}
          beforeUpload={() => false}
        >
          <p className={styles.ant_upload_drag_icon}>
            <UploadIcon />
          </p>
          <p className={styles.ant_upload_text}>Drag and drop the file here</p>
          <p className={styles.ant_upload_hint}>Support only CSV files</p>
        </Dragger>
      ),
    },
    {
      title: 'Data Matching',
      content: (
        <Table
          dataSource={columnMapping}
          columns={[
            {
              title: 'Imported CSV Header',
              dataIndex: 'csvHeader',
              key: 'csvHeader',
            },
            {
              title: 'Database Header Matching',
              dataIndex: 'dbHeader',
              key: 'dbHeader',
              render: (_, record) => (
                <Select
                  style={{ width: 200 }}
                  onChange={(value) => handleColumnMapping(record.csvHeader, value)}
                  value={record.dbHeader}
                >
                  {dbHeaders.map((header) => (
                    <Option key={header} value={header}>
                      {header}
                    </Option>
                  ))}
                </Select>
              ),
            },
            {
              title: 'Status',
            },
          ]}
        />
      ),
    },
    {
      title: 'Verifying & Import',
      content: (
        <div>
          <Table
            dataSource={columnMapping}
            columns={[
              {
                title: 'Imported CSV Header',
                dataIndex: 'csvHeader',
                key: 'csvHeader',
              },
              {
                title: 'Database Header Matching',
                dataIndex: 'dbHeader',
                key: 'dbHeader',
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status) => {
                  switch (status) {
                    case 'success':
                      return '✅';
                    case 'error':
                      return '❌';
                    case 'warning':
                      return '⚠️';
                    default:
                      return '';
                  }
                },
              },
            ]}
          />
          <div style={{ marginTop: 16 }}>
            <span>
              {columnMapping?.some((mapping) => mapping.status === 'error')
                ? 'Data error!'
                : 'No data error'}
            </span>
            <Button onClick={() => setCurrentStep(2)} style={{ marginRight: 8 }}>
              Back
            </Button>
            <Button type="primary" onClick={handleImport}>
              Import
            </Button>
          </div>
        </div>
      ),
    },
  ];

  console.log(currentStep);

  const items: TabsProps['items'] = [
    {
      key: 'import',
      label: (
        <RobotoBodyText customClass={styles.import_export_csv_tab_label} level={6}>
          IMPORT CSV FILE
        </RobotoBodyText>
      ),
      children: (
        <div className="p-16">
          <Steps current={currentStep}>
            {steps.map((item, index) => (
              <Step
                key={index}
                title={
                  <RobotoBodyText
                    level={5}
                    customClass={`${
                      currentStep === index ? 'font-medium primary-color-dark' : 'primary-color'
                    }`}
                  >
                    {item.title}
                  </RobotoBodyText>
                }
              />
            ))}
          </Steps>
          <div style={{ marginTop: 24 }}>{steps[currentStep].content}</div>
        </div>
      ),
    },
    {
      key: 'export',
      label: (
        <RobotoBodyText customClass={styles.import_export_csv_tab_label} level={6}>
          EXPORT CSV FILE
        </RobotoBodyText>
      ),
      children: <Button onClick={onExport}>Export CSV</Button>,
    },
  ];

  return (
    <Modal
      title={
        <article className="d-flex items-center justify-between">
          <CormorantBodyText customClass="common-cormorant-garamond-text">
            IMPORT/EXPORT
          </CormorantBodyText>
          <CloseIcon />
        </article>
      }
      open={open}
      closable={false}
      onCancel={onCancel}
      footer={<CustomSaveButton content="Import" />}
      width={576}
      className={styles.import_export_csv}
    >
      <Tabs items={items} />
    </Modal>
  );
};

export default ImportExportCSV;
