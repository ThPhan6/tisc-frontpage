import React, { FC, useState } from 'react';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';

import { isEmpty, isUndefined, lowerCase } from 'lodash';

import type { RadioValue } from '@/components/CustomRadio/types';
import type { TabItem } from '@/components/Tabs/types';
import { useCollapseGroupActiveCheck } from '@/reducers/active';
import type {
  AttributeContentType,
  AttributeSubForm,
  BasisConvention,
  BasisConventionOption,
  BasisPresetOption,
  BasisText,
} from '@/types';

import CustomButton from '@/components/Button';
import CustomCollapse from '@/components/Collapse';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomModal } from '@/components/Modal';
import { CustomTabs } from '@/components/Tabs';

import styles from '../styles/contentTypeModal.less';
import { SPECIFICATION_TYPE } from '../utils';
import { SelectedItem } from './AttributeEntryForm';

type ACTIVE_TAB = 'conversions' | 'presets' | 'options' | 'text';

interface ContentTypeOptionProps {
  data: BasisConvention[] | BasisPresetOption[] | BasisText[];
  type: ACTIVE_TAB;
  selectedOption: Omit<AttributeSubForm, 'id' | 'name'>;
  setSelectedOption: (selected: Omit<AttributeSubForm, 'id' | 'name'>) => void;
  index: number;
}

const ContentTypeDetail: FC<{
  index: number;
  option: any;
  options: any[];
  onChange: (radioValue: RadioValue) => void;
  value: any;
}> = ({ option, options, index, onChange, value }) => {
  const { curActiveKey, onKeyChange } = useCollapseGroupActiveCheck('content-type', index);

  return (
    <CustomCollapse
      header={
        <span className="text-uppercase">
          {option.name} ({option.count})
        </span>
      }
      className="site-collapse-custom-panel"
      arrowAlignRight
      noBorder
      noPadding
      activeKey={curActiveKey}
      onChange={onKeyChange}
    >
      <CustomRadio options={options} value={value} onChange={onChange} isRadioList />
    </CustomCollapse>
  );
};

const ContentTypeOption: React.FC<ContentTypeOptionProps> = ({
  data,
  type,
  selectedOption,
  setSelectedOption,
}) => {
  const formatConventionGroup = (items: BasisConventionOption[]): RadioValue[] => {
    return items.map((item) => {
      return {
        label: (
          <span className="basis-conversion-group text-capitalize">
            {item.name_1}
            <SwapIcon />
            {item.name_2}
          </span>
        ),
        value: item.id,
      };
    });
  };
  //
  const formatPresetOptionGroup = (items: BasisPresetOption[]): RadioValue[] => {
    return items.map((item) => {
      return {
        label: (
          <span className="basis-preset-option-group text-capitalize">
            <span>{item.name}</span>
            <span className="count-number">({item.count})</span>
          </span>
        ),
        value: item.id,
      };
    });
  };
  //
  const formatBasisText = (items: BasisText[]): RadioValue[] => {
    return items.map((item) => {
      return {
        label: <span className="basis-preset-option-group text-capitalize">{item.name}</span>,
        value: item.id,
      };
    });
  };
  //
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
  const onChangePresetOption = (basisId: string) => {
    const presetOptions = [...data] as BasisPresetOption[];
    presetOptions.forEach((presetOption) => {
      const selected = presetOption.subs?.find((sub) => {
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

  /// basis TEXT
  if (type === 'text') {
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
  /// the others
  return (
    [...data]
      .filter((item: any) => !isEmpty(item.subs))
      .map((option: any, idx) => (
        <ContentTypeDetail
          key={idx}
          index={idx}
          onChange={(radioValue) => {
            if (type === 'conversions') {
              return onChangeConversion(String(radioValue.value));
            }
            return onChangePresetOption(String(radioValue.value));
          }}
          options={
            type === 'conversions'
              ? formatConventionGroup(option.subs)
              : formatPresetOptionGroup(option.subs)
          }
          value={selectedOption.basis_id}
          option={option}
        />
      )) || null
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
  if (!isUndefined(subAttribute.content_type)) {
    const selected = listTab.find((item) => {
      return item.key.indexOf(lowerCase(subAttribute.content_type!)) >= 0;
    });
    if (selected) {
      selectedTab = selected;
    }
  }
  const [activeTab, setActiveTab] = useState<string>(selectedTab.key);

  const tab = activeTab === 'text' ? 'texts' : activeTab;

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
        className={styles.contentTypeModalWrapper}
      >
        <div>
          <CustomTabs
            listTab={listTab}
            tabPosition="top"
            tabDisplay="space"
            onChange={setActiveTab}
            activeKey={activeTab}
          />
          <div className={styles.contentTypeOption}>
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
