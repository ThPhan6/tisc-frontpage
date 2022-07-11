import React from 'react';
import { CustomRadio } from '@/components/CustomRadio';
import type { RadioValue } from '@/components/CustomRadio/types';
import { MainTitle } from '@/components/Typography';
// import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
// import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
// import { isEmpty } from 'lodash';
import styles from './styles/radioList.less';

export interface IRadioListOption {
  options: RadioValue[];
  heading: string;
}

interface IRadioList {
  data: IRadioListOption[];
  selected?: RadioValue;
  chosenItem?: RadioValue;
  onChange?: (value: RadioValue) => void;
  noCollapse?: boolean;
}

const GroupRadioList: React.FC<IRadioList> = (props) => {
  const { data, selected, onChange } = props;

  return (
    <div className={styles.radioListContainer}>
      {data.map((item, key) => (
        <div className={styles.radioListItem} key={key}>
          <MainTitle customClass="radio-list-heading" level={3}>
            {item.heading}
          </MainTitle>
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
