import { FC, useEffect, useState } from 'react';

import { State } from '../type';

import Popover from '@/components/Modal/Popover';

import { getStatesByCountryId } from '../api';

const StateModal: FC<{
  countryId: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue, countryId }) => {
  const [states, setStates] = useState<State[]>([]);

  const getStateList = () => {
    getStatesByCountryId(countryId).then((res) => {
      if (res) {
        const checked = res.find((item) => item.id === chosenValue.value);
        if (!checked) {
          setChosenValue({ value: '', label: '' });
        } else {
          setChosenValue({ value: checked.id, label: checked.name });
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
      secondaryModal
      setVisible={setVisible}
      chosenValue={chosenValue}
      setChosenValue={setChosenValue}
      groupRadioList={[
        {
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
