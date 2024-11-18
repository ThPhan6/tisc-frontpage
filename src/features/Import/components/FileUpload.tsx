import { FC } from 'react';

import { Upload, type UploadProps } from 'antd';

import { ReactComponent as UploadIcon } from '@/assets/icons/upload-48.svg';

import { useImport } from '../hooks/useImport';

import CustomButton from '@/components/Button';
import { BodyText } from '@/components/Typography';

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
      style={{ width: 'fit-content', margin: '116px auto', border: 'none', background: '#fff' }}
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
          <BodyText fontFamily="Roboto" level={5}>
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
      </div>
    </Dragger>
  );
};
