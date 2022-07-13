import Popover from '@/components/Modal/Popover';
import { getStatesByCountryId } from '@/services/location.api';
import { IState } from '@/types/location.types';
import { Radio } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from '../styles/CountryModal.less';

const StateModal: FC<{
  countryId: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue, countryId }) => {
  const [states, setStates] = useState<IState[]>([]);

  const getStateList = () => {
    getStatesByCountryId(countryId).then((res) => {
      if (res) {
        if (!res.find((item) => item.id === chosenValue.value)) {
          setChosenValue({ value: '', label: '' });
        }
        setStates(res);
      }
    });
  };

  useEffect(() => {
    if (countryId) {
      getStateList();
    } else {
      setChosenValue({ value: '', label: '' });
    }
  }, [countryId]);

  return (
    <Popover
      title="SELECT STATE / PROVINCE"
      visible={visible}
      setVisible={setVisible}
      chosenValue={chosenValue}
      setChosenValue={setChosenValue}
      groupRadioList={[
        {
          heading: (
            <div className={styles.customHeading}>
              <span className={styles.customTitle}>Global</span>
              <Radio />
            </div>
          ),
          options: states.map((state) => {
            return {
              label: state.name,
              value: state.id,
            };
          }),
        },
      ]}
    />
  );
};

export default StateModal;
