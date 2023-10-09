import React, { useEffect, useState } from 'react';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';

import { isEmpty, isUndefined, lowerCase } from 'lodash';

import type { RadioValue } from '@/components/CustomRadio/types';
import type { TabItem } from '@/components/Tabs/types';
import type {
  AttributeContentType,
  AttributeSubForm,
  BasisConvention,
  BasisPresetOption,
  BasisText,
} from '@/types';

import CustomButton from '@/components/Button';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomModal } from '@/components/Modal';
import { CustomTabs } from '@/components/Tabs';

import styles from '../styles/contentTypeModal.less';
import { SPECIFICATION_TYPE } from '../utils';
import { SelectedItem } from './AttributeEntryForm';
import { ContentOptionTypeDetail, ContentTypeDetail, formatBasisText } from './util';

type ACTIVE_TAB = 'conversions' | 'presets' | 'options' | 'text';

interface ContentTypeOptionProps {
  data: BasisConvention[] | BasisPresetOption[] | BasisText[];
  type: ACTIVE_TAB;
  selectedOption: Omit<AttributeSubForm, 'id' | 'name'>;
  setSelectedOption: (selected: Omit<AttributeSubForm, 'id' | 'name'>) => void;
  // index: number;
}

const ContentTypeOption: React.FC<ContentTypeOptionProps> = ({
  data,
  type,
  selectedOption,
  setSelectedOption,
}) => {
  /// basis TEXT
  if (type === 'text') {
    const onChangeBasisText = (basisId: string) => {
      const basistexts = [...data] as BasisText[];
      const selected = basistexts.find((item) => {
        return item.id === basisId;
      });
      if (selected) {
        setSelectedOption({
          basis_id: basisId,
          content_type: type,
          description: selected.name,
        });
      }
    };

    return (
      <div /* style={{ paddingRight: 16 }} */>
        <CustomRadio
          options={formatBasisText(data)}
          value={selectedOption.basis_id}
          onChange={(radioValue) => onChangeBasisText(String(radioValue.value))}
          isRadioList
        />
      </div>
    );
  }

  const onChangeConversion = (basisId: string) => {
    const conversions = [...data] as BasisConvention[];
    conversions.forEach((conversion) => {
      const selected = conversion.subs.find((sub) => {
        return sub.id === basisId;
      });
      if (selected) {
        setSelectedOption({
          basis_id: basisId,
          content_type: type,
          description_1: selected.name_1,
          description_2: selected.name_2,
        });
      }
    });
  };

  const onChangePreset = (basisId: string) => {
    const presetData = [...data] as BasisPresetOption[];
    presetData.forEach((preset) => {
      const selected = preset.subs?.find((sub) => {
        return sub.id === basisId;
      });
      if (selected) {
        setSelectedOption({
          basis_id: basisId,
          content_type: type,
          description: selected.name,
        });
      }
    });
  };

  const onChangeOption = (basisId: string) => {
    const optionData = [...data] as BasisPresetOption[];
    optionData.forEach((option) => {
      option.subs?.forEach((subItem) => {
        const selected = subItem.subs?.find((sub) => {
          return sub.id === basisId;
        });
        if (selected) {
          setSelectedOption({
            basis_id: basisId,
            content_type: type,
            description: selected.name,
          });
        }
      });
    });
  };

  const onChange = (radioValue: RadioValue) => {
    if (type === 'conversions') {
      onChangeConversion(String(radioValue.value));
      return;
    }

    if (type === 'presets') {
      onChangePreset(String(radioValue.value));
      return;
    }

    if (type === 'options') {
      onChangeOption(String(radioValue.value));
      return;
    }

    return;
  };

  const newData = [...data].filter((item: any) => !isEmpty(item.subs));

  if (type === 'options') {
    return (
      <ContentOptionTypeDetail
        onChange={onChange}
        value={selectedOption.basis_id}
        options={newData as BasisPresetOption[]}
      />
    );
  }

  /// type conversion or preset
  return (
    <ContentTypeDetail
      onChange={onChange}
      options={newData as BasisPresetOption[]}
      type={type}
      // options={renderOptions(option.subs)}
      value={selectedOption.basis_id}
    />
  );
};

interface ContentTypeModalProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  contentType: AttributeContentType | undefined;
  selectedItem: SelectedItem;
  onSubmit: (data: Omit<AttributeSubForm, 'id' | 'name'>) => void;
  type: number;
}
const ContentTypeModal: React.FC<ContentTypeModalProps> = (props) => {
  const { visible, setVisible, contentType, selectedItem, onSubmit, type } = props;

  const { subAttribute } = selectedItem;
  let listTab: TabItem[] = [
    { tab: 'TEXT', key: 'text' },
    { tab: 'CONVERSIONS', key: 'conversions' },
    { tab: 'PRESETS', key: 'presets' },
    { tab: 'OPTIONS', key: 'options' },
  ];
  listTab = listTab.map((itemTab) => {
    if (type === SPECIFICATION_TYPE) {
      if (itemTab.key == 'presets') {
        itemTab.disable = true;
      }
    } else {
      if (itemTab.key == 'options') {
        itemTab.disable = true;
      }
    }
    return itemTab;
  });

  /// default selected option
  const [selectedOption, setSelectedOption] = useState<Omit<AttributeSubForm, 'id' | 'name'>>({
    basis_id: subAttribute.basis_id,
  });
  /// set active tab
  let selectedTab = listTab[0];

  const [activeTab, setActiveTab] = useState<ACTIVE_TAB>(selectedTab.key as ACTIVE_TAB);

  const tab = activeTab === 'text' ? 'texts' : activeTab;

  useEffect(() => {
    /// update option selected
    setSelectedOption({ basis_id: subAttribute.basis_id });

    if (!isUndefined(subAttribute.content_type)) {
      const selected = listTab.find((item) => {
        return item.key.indexOf(lowerCase(subAttribute.content_type)) >= 0;
      });

      if (selected) {
        selectedTab = selected;
      }
    }

    setActiveTab(selectedTab.key as ACTIVE_TAB);
  }, [subAttribute]);

  return (
    <>
      <CustomModal
        title="SELECT CONTENT TYPE"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        secondaryModal
        noHeaderBorder={false}
        width={576}
        className={styles.contentTypeModalWrapper}
        closeIcon={<CloseIcon />}
        footer={
          <div className={styles.contentTypeFooter}>
            <CustomButton
              size="small"
              buttonClass={styles.contentTypeSubmitBtn}
              onClick={() => onSubmit(selectedOption)}
              properties="rounded"
            >
              Done
            </CustomButton>
          </div>
        }
      >
        <div>
          <CustomTabs
            listTab={listTab}
            tabPosition="top"
            tabDisplay="space"
            onChange={(tabActived) => {
              setActiveTab(tabActived as ACTIVE_TAB);
            }}
            activeKey={activeTab}
          />
          <div
            className={`${styles.contentTypeModalBody} ${
              activeTab === 'text' ? styles.contentTypeText : ''
            } ${activeTab === 'options' ? styles.contentTypeOption : ''}`}
          >
            <ContentTypeOption
              type={activeTab as ACTIVE_TAB}
              data={contentType ? contentType[tab] : []}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default ContentTypeModal;
