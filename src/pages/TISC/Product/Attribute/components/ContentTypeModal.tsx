import { Collapse, Modal } from 'antd';
import React, { useState } from 'react';
import { CustomTabs } from '@/components/Tabs';
import { CustomRadio } from '@/components/CustomRadio';
import CustomButton from '@/components/Button';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';
import { snakeCase, isEmpty } from 'lodash';
import { SPECIFICATION_TYPE } from '../utils';

import type { RadioValue } from '@/components/CustomRadio/types';
import type { TabProp } from '@/components/Tabs/types';
import type {
  IBasisConvention,
  IBasisConventionOption,
  IAttributeContentType,
  IBasisPresetOption,
  IBasisText,
  IAttributeSubForm,
} from '../types';

import type { ISelectedItem } from './AttributeEntryForm';

import styles from '../styles/contentTypeModal.less';

interface IContentTypeModal {
  setVisible: (value: boolean) => void;
  contentType: IAttributeContentType | undefined;
  selectedItem: ISelectedItem;
  onSubmit: (data: Omit<IAttributeSubForm, 'id' | 'name'>) => void;
  type: number;
}
type ACTIVE_TAB = 'conversions' | 'presets' | 'options' | 'text';

interface IContentTypeOption {
  data: IBasisConvention[] | IBasisPresetOption[] | IBasisText[];
  type: ACTIVE_TAB;
  selectedOption: Omit<IAttributeSubForm, 'id' | 'name'>;
  setSelectedOption: (selected: Omit<IAttributeSubForm, 'id' | 'name'>) => void;
}

const ContentTypeOption: React.FC<IContentTypeOption> = (props) => {
  const { data, type, selectedOption, setSelectedOption } = props;
  /// default open content type dropdown
  const [activeKey, setActiveKey] = useState<string | string[]>(
    selectedOption.activeKey ? [selectedOption.activeKey] : [],
  );

  const formatConventionGroup = (items: IBasisConventionOption[]): RadioValue[] => {
    return items.map((item) => {
      return {
        label: (
          <span className="basis-conversion-group">
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
  const formatPresetOptionGroup = (items: IBasisPresetOption[]): RadioValue[] => {
    return items.map((item) => {
      return {
        label: (
          <span className="basis-preset-option-group">
            <span>{item.name}</span>
            <span className="count-number">({item.count})</span>
          </span>
        ),
        value: item.id,
      };
    });
  };
  //
  const formatBasisText = (items: IBasisText[]): RadioValue[] => {
    return items.map((item) => {
      return {
        label: <span className="basis-preset-option-group">{item.name}</span>,
        value: item.id,
      };
    });
  };
  //
  const onChangeConversion = (basisId: string, selectedKey: string) => {
    const conversions = [...data] as IBasisConvention[];
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
          activeKey: snakeCase(selectedKey),
        });
      }
    });
  };
  const onChangePresetOption = (basisId: string, selectedKey: string) => {
    const presetOptions = [...data] as IBasisPresetOption[];
    presetOptions.forEach((presetOption) => {
      const selected = presetOption.subs?.find((sub) => {
        return sub.id === basisId;
      });
      if (selected) {
        setSelectedOption({
          basis_id: basisId,
          content_type: type,
          description: selected.name,
          activeKey: snakeCase(selectedKey),
        });
      }
    });
  };

  const onChangeBasisText = (basisId: string) => {
    const basistexts = [...data] as IBasisText[];
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
      <div style={{ paddingRight: 16 }}>
        <CustomRadio
          options={formatBasisText(data)}
          value={selectedOption.basis_id}
          onChange={(radioValue) => onChangeBasisText(radioValue.value)}
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
                <span>{option.name}</span>
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
                  return onChangeConversion(radioValue.value, option.name);
                }
                return onChangePresetOption(radioValue.value, option.name);
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
  let listTab: TabProp[] = [
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
  const [selectedOption, setSelectedOption] = useState<Omit<IAttributeSubForm, 'id' | 'name'>>({
    basis_id: subAttribute.basis_id,
    activeKey: subAttribute.activeKey,
  });
  /// set active tab
  let selectedTab = listTab[0];
  if (subAttribute.content_type) {
    const selected = listTab.find((tab) => {
      return tab.key === subAttribute.content_type;
    });
    if (selected) {
      selectedTab = selected;
    }
  }
  const [activeTab, setActiveTab] = useState<TabProp>(selectedTab);

  return (
    <>
      <Modal
        title="SELECT CONTENT TYPE"
        centered
        visible={true}
        onCancel={() => setVisible(false)}
        width={576}
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
            activeTab={activeTab}
          />
          <div className={styles.contentTypeOption}>
            <ContentTypeOption
              type={activeTab.key as ACTIVE_TAB}
              data={
                contentType ? contentType[activeTab.key === 'text' ? 'texts' : activeTab.key] : []
              }
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
