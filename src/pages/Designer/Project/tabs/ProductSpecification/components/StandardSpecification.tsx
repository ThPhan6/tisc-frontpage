import { FC } from 'react';

import { ReactComponent as FileSearchIcon } from '@/assets/icons/file-search-icon.svg';

import { TemplatesItem } from '../type';

import CustomButton from '@/components/Button';
import CollapseCheckboxList from '@/components/CustomCheckbox/CollapseCheckboxList';

import styles from '../index.less';

interface StandardSpecificationProps {
  standardSpecification: TemplatesItem[];
}
export const StandardSpecification: FC<StandardSpecificationProps> = ({
  standardSpecification,
}) => {
  const renderLabelHeader = (label: string) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginRight: '24px',
        }}>
        {label}
        <FileSearchIcon />
      </div>
    );
  };
  return (
    <>
      <div className={styles.specification}>
        {standardSpecification.map((specification: any) => (
          <CollapseCheckboxList
            options={specification.items.map((item: any) => {
              return {
                label: renderLabelHeader(item.name),
                value: item.value,
              };
            })}
            placeholder={specification.name}
            containerClass={styles.customTitle}
          />
        ))}
      </div>
      <div className={styles.actionButton}>
        <CustomButton size="small" properties="rounded">
          Preview
        </CustomButton>
      </div>
    </>
  );
};
