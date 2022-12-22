import React from 'react';

import { GlobalFilter } from '@/pages/Designer/Project/constants/filter';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

import { DropDownFilterValueProps } from '@/components/TopBar/types';

import { HeaderDropdown } from '@/components/HeaderDropdown';
import { BodyText } from '@/components/Typography';

import styles from './index.less';

export interface TopBarDropDownFilterProps {
  isShowFilter?: boolean;
  selectedFilter: DropDownFilterValueProps;
  setSelectedFilter: (filter: DropDownFilterValueProps) => void;
  filterLabel: string;
  globalFilter: DropDownFilterValueProps;
  dynamicFilter: DropDownFilterValueProps[];
}

const TopBarDropDownFilter: React.FC<TopBarDropDownFilterProps> = ({
  filterLabel,
  selectedFilter,
  setSelectedFilter,
  globalFilter,
  dynamicFilter,
  isShowFilter,
}) => {
  if (!isShowFilter) {
    return null;
  }

  const isGlobalFilter = selectedFilter?.id === globalFilter.id;

  const handleOnChangeFilter = (changedFilter: DropDownFilterValueProps) => {
    if (setSelectedFilter) {
      setSelectedFilter(changedFilter);
    }
  };

  return (
    <div className={styles.projectFilter}>
      <BodyText
        level={5}
        fontFamily="Roboto"
        customClass={`${styles.topFilter} ${isGlobalFilter ? '' : 'active-filter'}`}>
        {isGlobalFilter ? (
          'view'
        ) : (
          <>
            {selectedFilter?.name}
            <DeleteIcon onClick={() => handleOnChangeFilter(GlobalFilter)} />
          </>
        )}
      </BodyText>
      <HeaderDropdown
        align={{ offset: [0, 7] }}
        placement="bottomRight"
        containerClass={styles.filterDropdown}
        trigger={['click']}
        items={dynamicFilter.map((item) => {
          return {
            onClick: () => handleOnChangeFilter(item),
            label: (
              <span className={styles.filterItemLabel}>
                {item.icon ?? ''} {item.name ?? ''}
              </span>
            ),
          };
        })}>
        <BodyText level={6} fontFamily="Roboto" customClass={styles.projectFilterLabel}>
          <span style={{ userSelect: 'none', whiteSpace: 'nowrap' }}>{filterLabel ?? ''}</span>
          <DropdownIcon />
        </BodyText>
      </HeaderDropdown>
    </div>
  );
};
export default TopBarDropDownFilter;
