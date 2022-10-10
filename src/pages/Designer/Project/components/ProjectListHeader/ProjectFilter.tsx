import React from 'react';

import { GlobalFilter } from '../../constants/filter';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

import { ProjectFilterValueProps } from '@/features/project/types';

import { HeaderDropdown } from '@/components/HeaderDropdown';
import { BodyText } from '@/components/Typography';

import styles from '../../styles/project-filter.less';

export interface ProjectFilterProps {
  selectedFilter: ProjectFilterValueProps;
  setSelectedFilter: (filter: ProjectFilterValueProps) => void;
  data: ProjectFilterValueProps[];
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  selectedFilter,
  setSelectedFilter,
  data,
}) => {
  const handleOnChangeFilter = (changedFilter: ProjectFilterValueProps) => {
    setSelectedFilter(changedFilter);
  };

  const isGlobalFilter = selectedFilter.id === GlobalFilter.id;

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
            {selectedFilter.name}
            <DeleteIcon onClick={() => handleOnChangeFilter(GlobalFilter)} />
          </>
        )}
      </BodyText>
      <HeaderDropdown
        align={{ offset: [0, 7] }}
        placement="bottomRight"
        containerClass={styles.filterDropdown}
        items={data.map((item) => {
          return {
            onClick: () => handleOnChangeFilter(item),
            label: (
              <span className={styles.filterItemLabel}>
                {item.icon ? item.icon : ''} {item.name}
              </span>
            ),
          };
        })}
        trigger={['click']}>
        <BodyText level={6} fontFamily="Roboto" customClass={styles.projectFilterLabel}>
          <span>Project Status</span>
          <DropdownIcon />
        </BodyText>
      </HeaderDropdown>
    </div>
  );
};
export default ProjectFilter;
