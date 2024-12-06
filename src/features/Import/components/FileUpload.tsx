import { FC } from 'react';

import { Upload, type UploadProps } from 'antd';

import { ReactComponent as UploadIcon } from '@/assets/icons/upload-48.svg';

import { useImport } from '../hooks/useImport';

import CustomButton from '@/components/Button';
import { BodyText, RobotoBodyText } from '@/components/Typography';

const { Dragger } = Upload;

interface FileUploadProps extends UploadProps {}

export const FileUpload: FC<FileUploadProps> = ({ ...props }) => {
  const { fileUploaded, handleBeforeUpload, handleChangeUpload, handleCustomRequest } = useImport();

  return (
    <Dragger
      accept=".csv"
      multiple={false}
      maxCount={1}
      showUploadList={false}
      {...props}
      beforeUpload={handleBeforeUpload}
      onChange={handleChangeUpload}
      customRequest={handleCustomRequest}
    >
      <div className="d-flex flex-col items-center" style={{ gap: 32 }}>
        <UploadIcon />

        <div className="d-flex flex-col">
          <BodyText fontFamily="Roboto" level={2} customClass="font-medium">
            Drag and drop the file here
          </BodyText>
          <BodyText fontFamily="Roboto" level={5}>
            Support only CSV files
          </BodyText>
        </div>

        {fileUploaded?.name ? (
          <BodyText
            fontFamily="Roboto"
            level={5}
            style={{ position: 'absolute', bottom: '12.5rem' }}
          >
            {fileUploaded.name}
          </BodyText>
        ) : null}

        <CustomButton
          style={{
            width: 'fit-content',
            padding: '4px 16px',
            height: 32,
          }}
        >
          Choose file
        </CustomButton>
        <div style={{ transform: 'translateY(96px)' }}>
          <RobotoBodyText level={4} customClass="font-medium red-magenta">
            Warning Instruction
          </RobotoBodyText>
          <RobotoBodyText level={5} customClass="red-magenta">
            <span className="block">
              1. All CSV files should be prepared ahead of the importing.
            </span>
            <span className="block">
              2.Ensure the correct product code (SKU) column list is included.
            </span>
            <span className="block">
              3. System will overwrite all figures, including “0”, from your CSV table cell.
            </span>
            4. If not sure, please consult Team TISC at hello@tisc.global.
          </RobotoBodyText>
        </div>
      </div>
    </Dragger>
  );
};
