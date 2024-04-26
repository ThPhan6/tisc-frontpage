import React from 'react';

import { Collapse, Radio } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useDropdropList } from '../hook';
import { isEmpty } from 'lodash';

import type {
  CheckboxValue,
  DropdownCheckboxItem,
  DropdownCheckboxListProps,
} from '@/components/CustomCheckbox/types';

import { CustomCheckbox } from '@/components/CustomCheckbox';

import { CollapseLevel2Props } from '../Collapse/Expand';
import { MainTitle } from '../Typography';
import styles from './styles/dropdownList.less';

const DropdownCheckboxList: React.FC<DropdownCheckboxListProps> = (props) => {
  const {
    data,
    selected,
    onChange,
    onOneChange,
    renderTitle,
    chosenItem,
    combinable,
    noCollapse,
    showCount = true,
    customClass = '',
    canActiveMultiKey,
    forceEnableCollapse = true,
    isSelectAll,
    showCollapseIcon,
    additionalSelected,
    collapseLevel = '1',
    onChangeAdditionalSelected,
  } = props;

  const {
    selectAll,
    curSelect,
    activeKey,
    optionKey,
    setActiveKey,
    setOptionKey,
    handleCollapseMain,
    handleCollapseOption,
    setActiveKeysToEnableCollapseOnCheckboxList,
    handleSelectAll,
  } = useDropdropList(props);

  const renderHeader = (item: DropdownCheckboxItem, index: number) => {
    return (
      <div className="flex-start w-full">
        <div className="flex-start w-full">
          {renderTitle?.(item) ?? index}

          {showCount ? (
            <span
              style={{
                marginLeft: item.margin ? item.margin : 8,
                fontWeight: 300,
              }}
            >
              ({item?.count ?? item?.options?.length ?? 0})
            </span>
          ) : (
            ''
          )}

          {showCollapseIcon ? (
            (
              typeof activeKey === 'string' || typeof activeKey === 'number'
                ? String(activeKey) === item?.id ?? String(index)
                : activeKey.includes(item?.id ?? String(index))
            ) ? (
              <div className="flex-start drop-up-icon">
                <DropupIcon />
              </div>
            ) : (
              <div className="flex-start drop-down-icon">
                <DropdownIcon />
              </div>
            )
          ) : null}
        </div>

        {isSelectAll ? (
          <div
            className={styles.selectAll}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Radio
              className="select-all-radio"
              checked={
                selectAll?.includes(item?.id) ||
                (selected?.length === item.options.length && selectAll?.includes(item?.id))
              }
              onClick={handleSelectAll(item, index)}
            >
              <MainTitle level={4} customClass="select-label">
                Select all
              </MainTitle>
            </Radio>
          </div>
        ) : null}
        {item.rightHeader}
      </div>
    );
  };

  const renderItemCheckbox = (item: DropdownCheckboxItem) => {
    return (
      <CustomCheckbox
        options={item.options}
        selected={curSelect}
        isCheckboxList
        onOneChange={onOneChange}
        onChange={(changedData) => {
          let otherSelected: CheckboxValue[] = [];

          if (combinable && selected) {
            otherSelected = selected.reduce((finalData, selectedItem) => {
              if (!item.options.find((option) => option.value === selectedItem.value)) {
                finalData.push(selectedItem);
              }
              return finalData;
            }, [] as CheckboxValue[]);
          }

          onChange?.([...changedData, ...otherSelected]);
        }}
        additionalSelected={additionalSelected}
        onChangeAdditionalSelected={onChangeAdditionalSelected}
      />
    );
  };

  if (collapseLevel === '1') {
    return (
      <Collapse
        bordered={false}
        expandIconPosition="right"
        expandIcon={({ isActive }) =>
          showCollapseIcon ? undefined : isActive ? <DropupIcon /> : <DropdownIcon />
        }
        className={`dropdownList ${isSelectAll ? styles.collapseSelectAll : ''} ${customClass}`}
        onChange={handleCollapseMain}
        activeKey={activeKey}
      >
        {data.map((item, index) => (
          <Collapse.Panel
            header={renderHeader(item, index)}
            key={item?.id ?? index}
            collapsible={isEmpty(item.options) || noCollapse ? 'disabled' : undefined}
            className="site-collapse-custom-panel"
          >
            {renderItemCheckbox(item)}
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  }

  return (
    <Collapse
      bordered={false}
      expandIconPosition="right"
      expandIcon={({ isActive }) =>
        showCollapseIcon ? undefined : isActive ? <DropupIcon /> : <DropdownIcon />
      }
      className={`dropdownList dropdownListV2 ${
        isSelectAll ? styles.collapseSelectAll : ''
      } ${customClass}`}
      onChange={handleCollapseMain}
      activeKey={activeKey}
    >
      {data.map((item, index) => (
        <Collapse.Panel
          header={renderHeader(item, index)}
          key={item?.id ?? index}
          collapsible={isEmpty(item.options) || noCollapse ? 'disabled' : undefined}
          className="site-collapse-custom-panel"
        >
          <Collapse
            {...CollapseLevel2Props}
            accordion
            activeKey={optionKey}
            onChange={handleCollapseOption}
            className={`dropdownListLevelTwo`}
          >
            {item?.subs?.map((opt: DropdownCheckboxItem, optIndex: number) => (
              <Collapse.Panel
                key={opt?.id ?? optIndex}
                collapsible={opt?.count === 0 || isEmpty(item.subs) ? 'disabled' : undefined}
                className="site-collapse-custom-panel-level-2"
                header={
                  <div className="flex-center">
                    <span className="text-uppercase">{opt.name}</span>
                    <span style={{ marginLeft: 8, fontWeight: 300 }}>
                      ({opt?.count ?? item?.subs?.length ?? 0})
                    </span>
                  </div>
                }
              >
                {renderItemCheckbox(opt)}
              </Collapse.Panel>
            ))}
          </Collapse>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default DropdownCheckboxList;
