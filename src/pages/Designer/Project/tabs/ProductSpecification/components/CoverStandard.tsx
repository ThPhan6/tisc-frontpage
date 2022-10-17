import { FC, useState } from 'react';

import { Switch } from 'antd';

import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-icon.svg';

import { useBoolean } from '@/helper/hook';

import { DetailPDF } from '../type';

import CustomButton from '@/components/Button';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { MainTitle } from '@/components/Typography';

import styles from '../index.less';
import { Modal } from './Modal';

interface CoverStandardProps {
  data: DetailPDF;
  onChangeData: (newData: DetailPDF) => void;
  type: 'cover' | 'standard';
}

const CoverStandard: FC<CoverStandardProps> = ({ data, onChangeData, type }) => {
  const openModal = useBoolean();
  const [checkedCover, setCheckedCover] = useState<string[]>([]);
  const [documentTitle, setDocumentTitle] = useState<string>('');

  const onChangeCoverPage = (checked: boolean) => {
    onChangeData({
      ...data,
      config: {
        ...data.config,
        has_cover: checked,
        document_title: checked ? documentTitle : '',
        template_cover_ids: checked ? checkedCover : [],
      },
    });
  };

  const renderLabelHeader = (label: string) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: '24px',
        }}>
        {label}
        <FileSearchIcon onClick={() => openModal.setValue(true)} />
      </div>
    );
  };

  const onPreview = () => {
    onChangeData({
      ...data,
      config: {
        ...data.config,
        template_ids: data.config.has_cover
          ? [...data.config.template_cover_ids, ...data.config.template_standard_ids]
          : data.config.template_standard_ids,
      },
    });
    console.log('data', data);
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
              defaultChecked={data.config.has_cover}
              className={styles.switch}
              onChange={onChangeCoverPage}
            />
          </div>
          {data.config.has_cover ? (
            <FormGroup label="Document Title" required formClass={styles.customForm}>
              <CustomInput
                placeholder="e.g. Room Schedule (max.50.characters) "
                value={data.config.document_title}
                onChange={(e) => {
                  setDocumentTitle(e.target.value);
                  onChangeData({
                    ...data,
                    config: {
                      ...data.config,
                      document_title: e.target.value,
                    },
                  });
                }}
                containerClass={styles.document}
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
                  label: renderLabelHeader(item.name),
                  value: item.id,
                })),
              };
            })}
            renderTitle={(dropdownData) => dropdownData.name}
            selected={
              data.config.has_cover ? checkedCover.map((item) => ({ label: '', value: item })) : []
            }
            onChange={(checkedItem) => {
              setCheckedCover(checkedItem.map((opt) => String(opt.value)));
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
          />
        </div>
      ) : (
        <div>
          <div className={styles.specification}>
            <DropdownCheckboxList
              data={data.templates.specification.map((specification) => {
                return {
                  name: specification.name,
                  options: specification.items.map((item) => ({
                    label: renderLabelHeader(item.name),
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
            />
          </div>
          <div className={styles.actionButton}>
            <CustomButton size="small" properties="rounded" onClick={onPreview}>
              Preview
            </CustomButton>
          </div>
        </div>
      )}
      <Modal visible={openModal} />
    </>
  );
};
export default CoverStandard;
