import { Collapse, Modal } from 'antd';
import React, { useState } from 'react';
import { CustomTabs } from '@/components/Tabs';
import { CustomRadio } from '@/components/CustomRadio';
import CustomButton from '@/components/Button';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';
import { snakeCase, isEmpty, isUndefined, lowerCase } from 'lodash';
import { SPECIFICATION_TYPE } from '../utils';
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';

import type { RadioValue } from '@/components/CustomRadio/types';
import type { TabItem } from '@/components/Tabs/types';
import type {
  BasisConvention,
  BasisConventionOption,
  AttributeContentType,
  BasisPresetOption,
  BasisText,
  AttributeSubForm,
} from '@/types';

import type { ISelectedItem } from './AttributeEntryForm';

import styles from '../styles/contentTypeModal.less';

interface IContentTypeModal {
  setVisible: (value: boolean) => void;
  contentType: AttributeContentType | undefined;
  selectedItem: ISelectedItem;
  onSubmit: (data: Omit<AttributeSubForm, 'id' | 'name'>) => void;
  type: number;
}
type ACTIVE_TAB = 'conversions' | 'presets' | 'options' | 'text';

interface IContentTypeOption {
  data: BasisConvention[] | BasisPresetOption[] | BasisText[];
  type: ACTIVE_TAB;
  selectedOption: Omit<AttributeSubForm, 'id' | 'name'>;
  setSelectedOption: (selected: Omit<AttributeSubForm, 'id' | 'name'>) => void;
}

const ContentTypeOption: React.FC<IContentTypeOption> = (props) => {
  const { data, type, selectedOption, setSelectedOption } = props;
  /// default open content type dropdown
  let selectedKeys: string | string[] = [];
  /// active key for conversions
  if (type == 'conversions') {
    const conversions = [...data] as BasisConvention[];
    conversions.forEach((conversion) => {
      const selected = conversion.subs.find((sub) => {
        return sub.id === selectedOption.basis_id;
      });
      if (selected) {
        selectedKeys = [snakeCase(conversion.name)];
      }
    });
  }
  /// active key for presets and options
  if (type === 'presets' || type === 'options') {
    const presetOptions = [...data] as BasisConvention[];
    presetOptions.forEach((presetOption) => {
      const selected = presetOption.subs.find((sub) => {
        return sub.id === selectedOption.basis_id;
      });
      if (selected) {
        selectedKeys = [snakeCase(presetOption.name)];
      }
    });
  }

  const [activeKey, setActiveKey] = useState<string | string[]>(selectedKeys);

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
    <Collapse
      bordered={false}
      expandIconPosition="right"
      expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
      className={styles.contentTypeCollapse}
      onChange={setActiveKey}
      activeKey={activeKey}
    >
      {[...data]
        .filter((item: any) => !isEmpty(item.subs))
        .map((option: any) => (
          <Collapse.Panel
            header={
              <span className={activeKey.includes(snakeCase(option.name)) ? 'activated' : ''}>
                <span className="text-uppercase">{option.name}</span>
                <span className="count-number">({option.count})</span>
              </span>
            }
            key={snakeCase(option.name)}
            className="site-collapse-custom-panel"
          >
            <CustomRadio
              options={
                type === 'conversions'
                  ? formatConventionGroup(option.subs)
                  : formatPresetOptionGroup(option.subs)
              }
              value={selectedOption.basis_id}
              onChange={(radioValue) => {
                if (type === 'conversions') {
                  return onChangeConversion(String(radioValue.value));
                }
                return onChangePresetOption(String(radioValue.value));
              }}
              isRadioList
            />
          </Collapse.Panel>
        ))}
    </Collapse>
  );
};

const ContentTypeModal: React.FC<IContentTypeModal> = (props) => {
  const { setVisible, contentType, selectedItem, onSubmit, type } = props;
  const { subAttribute } = selectedItem;
  let listTab: TabItem[] = [
    { tab: 'TEXT', key: 'text' },
    { tab: 'CONVERSIONS', key: 'conversions' },
    { tab: 'PRESETS', key: 'presets' },
    { tab: 'OPTIONS', key: 'options' },
  ];
  listTab = listTab.map((tab) => {
    if (type === SPECIFICATION_TYPE) {
      if (tab.key == 'presets') {
        tab.disable = true;
      }
    } else {
      if (tab.key == 'options') {
        tab.disable = true;
      }
    }
    return tab;
  });

  /// default selected option
  const [selectedOption, setSelectedOption] = useState<Omit<AttributeSubForm, 'id' | 'name'>>({
    basis_id: subAttribute.basis_id,
  });
  /// set active tab
  let selectedTab = listTab[0];
  if (!isUndefined(subAttribute.content_type)) {
    const selected = listTab.find((tab) => {
      return tab.key.indexOf(lowerCase(subAttribute.content_type!)) >= 0;
    });
    if (selected) {
      selectedTab = selected;
    }
  }
  const [activeTab, setActiveTab] = useState<string>(selectedTab.key);

  return (
    <>
      <Modal
        title="SELECT CONTENT TYPE"
        centered
        visible={true}
        onCancel={() => setVisible(false)}
        width={576}
        closeIcon={<CloseIcon />}
        footer={
          <div className={styles.contentTypeFooter}>
            <CustomButton
              size="small"
              buttonClass={styles.contentTypeSubmitBtn}
              onClick={() => onSubmit(selectedOption)}
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
              data={contentType ? contentType[activeTab === 'text' ? 'texts' : activeTab] : []}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ContentTypeModal;
