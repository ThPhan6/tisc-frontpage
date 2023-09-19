import { FC } from 'react';

import { Collapse } from 'antd';

import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';

import { RadioValue } from '@/components/CustomRadio/types';
import { useCollapseGroupActiveCheck } from '@/reducers/active';
import { BasisConventionOption, BasisPresetOption, BasisText } from '@/types';

import CustomCollapse from '@/components/Collapse';
import { CollapseLevel1Props } from '@/components/Collapse/Expand';
import { CustomRadio } from '@/components/CustomRadio';

export const formatBasisText = (items: BasisText[]): RadioValue[] => {
  return items.map((item) => {
    return {
      label: <span className="basis-preset-option-group text-capitalize">{item.name}</span>,
      value: item.id,
    };
  });
};

export const formatPresetGroup = (items: BasisPresetOption[]): RadioValue[] => {
  return items.map((item) => {
    return {
      label: (
        <span className="basis-preset-option-group text-capitalize">
          <span>{item.name}</span>
          <span className="count-number" style={{ marginLeft: 8 }}>
            ({item.count})
          </span>
        </span>
      ),
      value: item.id,
    };
  });
};

export const formatConversionGroup = (items: BasisConventionOption[]): RadioValue[] => {
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

export const ContentTypeDetail: FC<{
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
        <div className="flex-center">
          <span className="text-uppercase">{option.name}</span>
          <span style={{ marginLeft: 8 }}>({option.count})</span>
        </div>
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

export const ContentOptionTypeDetail: FC<{
  options: BasisPresetOption[];
  onChange: (radioValue: RadioValue) => void;
  value: any;
}> = ({ options, onChange, value }) => {
  return (
    <Collapse {...CollapseLevel1Props}>
      {options.map((item, index) => (
        <Collapse.Panel
          header={
            <div className="flex-center">
              <span className="text-uppercase">{item.name}</span>
              <span style={{ marginLeft: 8 }}>({item.count})</span>
            </div>
          }
          key={index}
          collapsible={item.count === 0 ? 'disabled' : undefined}
        >
          <Collapse {...CollapseLevel1Props}>
            {item?.subs?.map((opt, idx) => (
              <Collapse.Panel
                header={
                  <div className="flex-center">
                    <span className="text-uppercase">{opt.name}</span>
                    <span style={{ marginLeft: 8 }}>({opt.count})</span>
                  </div>
                }
                key={`${index}-${idx}`}
                collapsible={opt.count === 0 ? 'disabled' : undefined}
              >
                <CustomRadio
                  options={
                    opt?.subs?.map((el: any) => ({
                      label: el.name,
                      value: el.id,
                    })) ?? []
                  }
                  value={value}
                  onChange={onChange}
                  isRadioList
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </Collapse.Panel>
      ))}
    </Collapse>
  );
};
