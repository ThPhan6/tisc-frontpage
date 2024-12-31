import { FC } from 'react';
import { useDispatch } from 'react-redux';

import { QUERY_KEY } from '@/constants/util';
import { DropdownProps } from 'antd';

import { removeUrlParams, setSortOrder } from '@/helper/utils';

import { setProductList } from '@/features/product/reducers';
import { SortOrder, SortParams } from '@/features/product/types';

import { CustomDropDown, FilterItem, TopBarItem } from '@/features/product/components';
import { SORTER_DROPDOWN_DATA } from '@/features/product/components/BrandProductFilterAndSorter';

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
  const dispatch = useDispatch();

  const resetSorter = () => {
    if (onDelete) {
      onDelete();
    } else {
      removeUrlParams([QUERY_KEY.sort_order, QUERY_KEY.sort_name]);
      dispatch(setProductList({ sort: undefined }));
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
          disabled={dropDownDisabled}
        >
          {bottomValue}
        </CustomDropDown>
      }
    />
  );
};

export default SortOrderPanel;
