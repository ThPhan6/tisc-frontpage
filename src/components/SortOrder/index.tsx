import { FC } from 'react';

import { DropdownProps } from 'antd';

import { setSortOrder } from '@/helper/utils';

import { SortOrder, SortParams } from '@/features/product/types';

import { CustomDropDown, FilterItem, TopBarItem } from '@/features/product/components';
import {
  SORTER_DROPDOWN_DATA,
  useProductListFilterAndSorter,
} from '@/features/product/components/FilterAndSorter';

interface SortOrderProps {
  order: SortOrder | undefined;
  sort: SortParams | undefined;
  dropDownDisabled?: boolean;
  onDelete?: () => void;
  bottomValue?: string;
  bottomEnable?: boolean;
  customClass?: string;
  topValueTitle?: string;
  style?: React.CSSProperties;
  placement?: DropdownProps['placement'];
}

const SortOrderPanel: FC<SortOrderProps> = ({
  order,
  sort,
  style,
  onDelete,
  dropDownDisabled,
  bottomEnable = true,
  bottomValue = 'Sort By',
  placement,
  topValueTitle = 'select',
  customClass = '',
}) => {
  const { resetProductListSorter } = useProductListFilterAndSorter();
  const resetSorter = () => {
    if (onDelete) {
      onDelete();
    } else {
      resetProductListSorter();
    }
  };

  return (
    <TopBarItem
      disabled
      customClass={customClass}
      bottomEnable={bottomEnable}
      style={style}
      topValue={
        sort ? <FilterItem title={setSortOrder(order)} onDelete={resetSorter} /> : topValueTitle
      }
      bottomValue={
        <CustomDropDown
          items={SORTER_DROPDOWN_DATA}
          placement={placement}
          menuStyle={{ width: 160, height: 'auto' }}
          disabled={dropDownDisabled}>
          {bottomValue}
        </CustomDropDown>
      }
    />
  );
};

export default SortOrderPanel;
