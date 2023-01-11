import { FC, useState } from 'react';

import { MESSAGE_ERROR } from '@/constants/message';
import { Switch } from 'antd';

import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-icon.svg';

import { useScreen } from '@/helper/common';
import { useBoolean } from '@/helper/hook';
import { messageError, messageErrorType, validateDocumentTitle } from '@/helper/utils';

import { PdfDetail } from '../type';

import CustomButton from '@/components/Button';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import styles from '../index.less';
import { PreviewModal } from './PreviewModal';

interface CoverStandardProps {
  data: PdfDetail;
  onChangeData: (newData: PdfDetail) => void;
  type: 'cover' | 'standard';
  onPreview?: () => void;
}
const StandardCoverPage: FC<CoverStandardProps> = ({ data, onChangeData, type, onPreview }) => {
  const isMobile = useScreen().isMobile;
  const openModal = useBoolean();
  const [previewURL, setPreviewURL] = useState<string>('');

  const onChangeCoverPage = (checked: boolean) => {
    onChangeData({
      ...data,
      config: {
        ...data.config,
        has_cover: checked,
      },
    });
  };

  const onChangeDocumentTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!validateDocumentTitle(e.target.value)) {
      return;
    }
    onChangeData({
      ...data,
      config: {
        ...data.config,
        document_title: e.target.value,
      },
    });
  };

  const renderLabelHeader = (label: string, url: string) => {
    return (
      <div
        style={{
          marginRight: isMobile ? undefined : 12,
        }}
        className="flex-between"
      >
        <RobotoBodyText
          level={5}
          customClass="text-overflow"
          style={{
            maxWidth: 'calc(100% - 26px)',
          }}
        >
          {label}
        </RobotoBodyText>
        <FileSearchIcon
          onClick={(e) => {
            e.preventDefault();
            setPreviewURL(url);
            openModal.setValue(true);
          }}
          style={{ width: 18, height: 18 }}
        />
      </div>
    );
  };

  return (
    <>
      {type === 'cover' ? (
        <div className={styles.cover}>
          <div className={styles.customTitle}>
            <MainTitle level={3}>Cover Page</MainTitle>
            <Switch
              checkedChildren="Yes"
              unCheckedChildren="No"
              checked={data.config.has_cover}
              className={styles.switch}
              onChange={onChangeCoverPage}
            />
          </div>
          {data.config.has_cover ? (
            <FormGroup label="Document Title" required formClass={styles.customForm}>
              <CustomInput
                placeholder="e.g. Room Schedule (max.50.characters) "
                value={data.config.document_title}
                onChange={onChangeDocumentTitle}
                containerClass={styles.document}
                message={messageError(data.config.document_title, MESSAGE_ERROR.DOCUMENT_TITLE, 50)}
                messageType={messageErrorType(data.config.document_title, 50, 'error', 'normal')}
              />
            </FormGroup>
          ) : (
            ''
          )}
          <DropdownCheckboxList
            data={data.templates.cover.map((cover) => {
              return {
                name: cover.name,
                options: cover.items.map((item) => ({
                  label: renderLabelHeader(item.name, item.preview_url),
                  value: item.id,
                })),
              };
            })}
            renderTitle={(dropdownData) => dropdownData.name}
            selected={
              data.config.has_cover
                ? data.config.template_cover_ids.map((item) => ({ label: '', value: item }))
                : []
            }
            onChange={(checkedItem) => {
              if (data.config.has_cover) {
                onChangeData({
                  ...data,
                  config: {
                    ...data.config,
                    template_cover_ids: checkedItem.map((opt) => String(opt.value)),
                  },
                });
              }
            }}
            noCollapse={data.config.has_cover ? false : true}
            showCount={false}
            combinable
            customClass={data.config.has_cover ? '' : styles.customHeaderText}
          />
        </div>
      ) : (
        <div>
          <div
            className={styles.cover}
            style={{ paddingBottom: 16, height: 'calc(var(--vh) * 100 - 352px)' }}
          >
            <DropdownCheckboxList
              data={data.templates.specification.map((specification) => {
                return {
                  name: specification.name,
                  options: specification.items.map((item) => ({
                    label: renderLabelHeader(item.name, item.preview_url),
                    value: item.id,
                  })),
                };
              })}
              renderTitle={(dropdownData) => dropdownData.name}
              selected={data.config.template_standard_ids?.map((item) => ({
                label: '',
                value: item,
              }))}
              onChange={(checkedItem) => {
                onChangeData({
                  ...data,
                  config: {
                    ...data.config,
                    template_standard_ids: checkedItem.map((opt) => String(opt.value)),
                  },
                });
              }}
              showCount={false}
              combinable
            />
          </div>
          <div className={styles.actionButton}>
            <CustomButton size="small" properties="rounded" onClick={onPreview}>
              Preview
            </CustomButton>
          </div>
        </div>
      )}
      <PreviewModal visible={openModal} previewURL={previewURL} />
    </>
  );
};
export default StandardCoverPage;
