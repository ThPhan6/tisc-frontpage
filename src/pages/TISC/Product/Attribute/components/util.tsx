import { FC, useEffect, useState } from 'react';

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
  const [mainOptionKey, setMainOptionKey] = useState<string>('');
  const [optionKey, setOptionKey] = useState<string>('');

  useEffect(() => {
    let mainOptionKeyCollapse = '';
    let optionKeyCollapse = '';

    options.forEach((main) => {
      if (mainOptionKeyCollapse && optionKeyCollapse) {
        return;
      }

      main.subs?.forEach((option) => {
        if (mainOptionKeyCollapse && optionKeyCollapse) {
          return;
        }

        option.subs?.forEach((sub) => {
          if (mainOptionKeyCollapse && optionKeyCollapse) {
            return;
          }

          if (sub.id === value) {
            mainOptionKeyCollapse = main.id;
            optionKeyCollapse = option.id;
          }
        });
      });
    });

    setMainOptionKey(mainOptionKeyCollapse);
    setOptionKey(optionKeyCollapse);
  }, [options]);

  useEffect(() => {
    return () => {
      setMainOptionKey('');
      setOptionKey('');
    };
  }, []);

  const handleCollapseMainOption = (key: string | string[]) => {
    if (typeof key === 'string') {
      setMainOptionKey(key);
    } else {
      setMainOptionKey(key?.[0]);
    }
  };

  const handleCollapseOption = (key: string | string[]) => {
    if (typeof key === 'string') {
      setOptionKey(key);
    } else {
      setOptionKey(key?.[0]);
    }
  };

  return (
    <Collapse
      {...CollapseLevel1Props}
      activeKey={mainOptionKey}
      accordion
      onChange={handleCollapseMainOption}
    >
      {options.map((item) => (
        <Collapse.Panel
          key={item.id}
          collapsible={item.count === 0 ? 'disabled' : undefined}
          header={
            <div className="flex-center">
              <span className="text-uppercase">{item.name}</span>
              <span style={{ marginLeft: 8 }}>({item.count})</span>
            </div>
          }
        >
          <Collapse
            {...CollapseLevel1Props}
            accordion
            activeKey={optionKey}
            onChange={handleCollapseOption}
          >
            {item?.subs?.map((opt) => (
              <Collapse.Panel
                key={opt.id}
                collapsible={opt.count === 0 ? 'disabled' : undefined}
                header={
                  <div className="flex-center">
                    <span className="text-uppercase">{opt.name}</span>
                    <span style={{ marginLeft: 8 }}>({opt.count})</span>
                  </div>
                }
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
