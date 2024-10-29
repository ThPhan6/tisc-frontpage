import {
  CSSProperties,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { Upload, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadListType } from 'antd/lib/upload/interface';

import { ReactComponent as PhotoIcon } from '@/assets/icons/photo.svg';

import { getBase64 } from '@/helper/utils';

import styles from '@/components/EntryForm/styles/UploadImageInput.less';
import { BodyText } from '@/components/Typography';

interface UploadImageInputProps extends Omit<UploadProps, 'onChange'> {
  isHaveboxShadow?: boolean;
  action?: string;
  name?: string;
  fileList?: UploadFile[];
  maxFileCount?: number;
  maxSize?: number;
  accept?: string;
  fieldName?: ReactNode;
  showUploadList?: boolean;
  listType?: UploadListType;
  multiple?: boolean;
  onChange?: (fileList: UploadFile[]) => void;
  onRemove?: (file: UploadFile) => void;
  additonalContainerStyle?: CSSProperties;
}

const UploadImageInput = forwardRef<any, UploadImageInputProps>(
  (
    {
      isHaveboxShadow = false,
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
      listType,
      fieldName,
      additonalContainerStyle,
    },
    ref,
  ) => {
    const [files, setFiles] = useState<UploadFile[]>(fileList);
    const uploadRef = useRef<any>(null);

    useEffect(() => {
      if (fileList && fileList.length > 0) setFiles(fileList);
    }, [fileList]);

    useImperativeHandle(ref, () => ({
      triggerUpload: () => {
        if (uploadRef.current) uploadRef.current.querySelector('input').click();
      },
    }));

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
      let src = file.url;

      if (!src) src = await getBase64(file.originFileObj as Blob);

      const imgWindow = window.open(src);
      imgWindow?.document.write(
        `<img src="${src}" style="width:100%; height:100%; max-width:100%; max-height:100%;" />`,
      );
    };

    return (
      <section
        className={`${styles.upload_image}  ${isHaveboxShadow ? 'border-bottom-light' : ''}`}
        style={additonalContainerStyle}
        ref={uploadRef}
      >
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
          {files.length < maxFileCount && (
            <figure className={styles.upload_image_wrapper}>
              <PhotoIcon />
            </figure>
          )}
        </Upload>
      </section>
    );
  },
);

export default UploadImageInput;
