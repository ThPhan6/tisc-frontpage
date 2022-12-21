import { FC } from 'react';

import { Switch } from 'antd';

import { countBy } from 'lodash';

import { ProductAttributeProps } from '../../types';

import { RobotoBodyText } from '@/components/Typography';

import styles from './SpecificationChoice.less';

interface SpecificationChoiceProps {
  data: ProductAttributeProps[];
  switchChecked: boolean;
  onClick?: (toggle: boolean, event: MouseEvent) => void;
}

export const SpecificationChoice: FC<SpecificationChoiceProps> = ({
  data,
  switchChecked,
  onClick,
}) => {
  const isOptionType = countBy(data, (attr) => attr.type === 'Options').true >= 2;

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
