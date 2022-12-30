import { FC } from 'react';

import { Switch } from 'antd';

import { checkedOptionType } from './hooks';

import { ProductAttributeProps } from '../../types';

import { RobotoBodyText } from '@/components/Typography';

import styles from './SpecificationChoice.less';

interface SpecificationChoiceProps {
  data: ProductAttributeProps[];
  switchChecked: boolean;
  onClick?: (toggle: boolean, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const SpecificationChoice: FC<SpecificationChoiceProps> = ({
  data,
  switchChecked,
  onClick,
}) => {
  const isOptionType = checkedOptionType(data);

  if (!isOptionType) return null;

  return (
    <div className={styles.content}>
      <RobotoBodyText level={6} customClass="text">
        Make the specification as a choice
      </RobotoBodyText>
      <Switch
        size="small"
        checkedChildren="ON"
        unCheckedChildren="OFF"
        className="switchBtn"
        checked={switchChecked}
        onClick={(toggle, e) => {
          e.stopPropagation();

          onClick?.(toggle, e);
        }}
      />
    </div>
  );
};
