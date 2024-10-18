import React, { ReactNode, useState } from 'react';

import { Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadListType } from 'antd/lib/upload/interface';

import { ReactComponent as PhotoIcon } from '@/assets/icons/photo.svg';

import { getBase64 } from '@/helper/utils';

import styles from '@/components/EntryForm/styles/UploadImageInput.less';
import { BodyText } from '@/components/Typography';

interface UploadImageInputProps extends Omit<UploadProps, 'onChange'> {
  action?: string;
  name?: string;
  fileList?: UploadFile[];
  maxFileCount?: number;
  maxSize?: number;
  accept?: string;
  fieldName: ReactNode;
  showUploadList?: boolean;
  listType?: UploadListType;
  multiple?: boolean;
  onChange?: (fileList: UploadFile[]) => void;
  onRemove?: (file: UploadFile) => void;
  onPreview?: (file: UploadFile) => void;
}

const UploadImageInput: React.FC<UploadImageInputProps> = ({
  action = '',
  name = 'file',
  fileList = [],
  maxFileCount = 1,
  maxSize = 5,
  accept = 'image/*',
  showUploadList = true,
  multiple = false,
  onChange,
  onRemove,
  onPreview,
  listType,
  fieldName,
}) => {
  const [files, setFiles] = useState<UploadFile[]>(fileList);

  // useEffect(() => {
  //   setFiles(fileList);
  // }, [fileList]);

  const handleBeforeUpload = (file: UploadFile) => {
    const isImage = file.type?.startsWith('image/');
    const isLtMaxSize = file.size! / 1024 / 1024 < maxSize;

    if (!isImage) {
      message.warn(`Only images are allowed.`);
      return Upload.LIST_IGNORE;
    }

    if (!isLtMaxSize) {
      message.warn(`Image must be smaller than ${maxSize}MB!`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    let updatedFileList = [...info.fileList];

    if (maxFileCount && updatedFileList.length > maxFileCount) {
      // Keep only the latest files
      updatedFileList = updatedFileList.slice(-maxFileCount);
    }

    setFiles(updatedFileList);
    if (onChange) onChange(updatedFileList);
  };

  const handleRemove = (file: UploadFile) => {
    const updatedFileList = files.filter((f) => f.uid !== file.uid);
    setFiles(updatedFileList);
    if (onRemove) onRemove(file);
  };

  const handlePreview = async (file: UploadFile) => {
    if (onPreview) {
      onPreview(file);
      return;
    }

    const src = file.url || (await getBase64(file.originFileObj as Blob));
    const imgWindow = window.open(src);
    imgWindow?.document.write(`<img src="${src}" style="width:100%" />`);
  };

  return (
    <section className={styles.upload_image}>
      <BodyText level={3} customClass={styles.upload_image_name}>
        {fieldName}
      </BodyText>
      <Upload
        action={action}
        name={name}
        fileList={files}
        accept={accept}
        beforeUpload={handleBeforeUpload}
        onChange={handleChange}
        onRemove={handleRemove}
        onPreview={handlePreview}
        showUploadList={showUploadList}
        multiple={multiple}
        listType={listType}
      >
        {files.length < maxFileCount && <PhotoIcon />}
      </Upload>
    </section>
  );
};

export default UploadImageInput;
