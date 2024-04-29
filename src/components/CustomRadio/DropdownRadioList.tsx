import React from 'react';

import { Collapse } from 'antd';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useDropdropRadioList } from '../hook';
import { isEmpty } from 'lodash';

import type { DropdownRadioItem, DropdownRadioListProps } from '@/components/CustomRadio/types';

import { CustomRadio } from '@/components/CustomRadio';

import { CollapseLevel2Props } from '../Collapse/Expand';
import styles from './styles/dropdownList.less';

const DropdownRadioList: React.FC<DropdownRadioListProps> = (props) => {
  const {
    data,
    selected,
    chosenItem,
    onChange,
    renderTitle,
    radioDisabled,
    collapseLevel = '1',
  } = props;

  const { activeKey, optionKey, handleCollapseMain, handleCollapseOption } =
    useDropdropRadioList(props);

  const renderHeader = (item: DropdownRadioItem, index: number) => {
    if (renderTitle) {
      return (
        <span>
          {renderTitle(item)}
          <span
            className={styles.dropdownCount}
            style={{
              marginLeft: item.margin ? item.margin : 8,
            }}
          >
            ({item?.count ?? item?.options?.length ?? 0})
          </span>
        </span>
      );
    }
    return index;
  };

  const renderRadioItem = (item: DropdownRadioItem) => {
    return (
      <CustomRadio
        options={item.options}
        value={selected?.value}
        onChange={onChange}
        isRadioList
        disabled={radioDisabled}
      />
    );
  };

  if (collapseLevel === '1') {
    return (
      <Collapse
        bordered={false}
        expandIconPosition="right"
        expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
        className={`dropdownList`}
        onChange={handleCollapseMain}
        activeKey={activeKey}
      >
        {data?.map((item, index) => (
          <Collapse.Panel
            header={renderHeader(item, index)}
            key={index}
            collapsible={isEmpty(item.options) ? 'disabled' : undefined}
            className="site-collapse-custom-panel"
          >
            {renderRadioItem(item)}
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  }

  return (
    <Collapse
      bordered={false}
      expandIconPosition="right"
      expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
      className={`dropdownList dropdownListV2`}
      onChange={handleCollapseMain}
      activeKey={activeKey}
    >
      {data?.map((item, index) => (
        <Collapse.Panel
          header={renderHeader(item, index)}
          key={index}
          collapsible={isEmpty(item.options) ? 'disabled' : undefined}
          className="site-collapse-custom-panel"
        >
          <Collapse
            {...CollapseLevel2Props}
            accordion
            activeKey={optionKey}
            onChange={handleCollapseOption}
            className={`dropdownListLevelTwo`}
          >
            {item?.subs?.map((opt: DropdownRadioItem, optIndex: number) => (
              <Collapse.Panel
                className="site-collapse-custom-panel-level-2"
                key={optIndex}
                collapsible={opt?.count === 0 || isEmpty(item.subs) ? 'disabled' : undefined}
                header={
                  <div className="flex-center">
                    <span className="text-uppercase">{opt.name}</span>
                    <span style={{ marginLeft: 8, fontWeight: 300 }}>
                      ({opt?.count ?? item?.subs?.length ?? 0})
                    </span>
                  </div>
                }
              >
                {renderRadioItem(opt)}
              </Collapse.Panel>
            ))}
          </Collapse>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};

export default DropdownRadioList;
