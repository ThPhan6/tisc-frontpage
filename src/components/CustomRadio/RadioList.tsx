import React from 'react';

import { isString } from 'lodash';

import type { RadioValue } from '@/components/CustomRadio/types';

import { CustomRadio } from '@/components/CustomRadio';
import { MainTitle } from '@/components/Typography';

import styles from './styles/radioList.less';

export interface RadioListOption {
  options: RadioValue[];
  heading?: string | React.ReactNode;
}

interface GroupRadioListProps {
  data: RadioListOption[];
  selected?: RadioValue;
  onChange?: (value: RadioValue) => void;
}

const GroupRadioList: React.FC<GroupRadioListProps> = (props) => {
  const { data, selected, onChange } = props;

  return (
    <div className={`${styles.radioListContainer} radio-list-container`}>
      {data.map((item, key) => (
        <div className={styles.radioListItem} key={key}>
          {item.heading && isString(item.heading) ? (
            <MainTitle customClass="radio-list-heading" level={3}>
              {item.heading}
            </MainTitle>
          ) : (
            item.heading
          )}
          <div className="radio-list-options">
            <CustomRadio
              options={item.options}
              value={selected?.value}
              onChange={onChange}
              isRadioList
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupRadioList;
