import { FC, useEffect, useState } from 'react';

import { getAllCustomResource } from '../../services';

import Popover from '@/components/Modal/Popover';

export const AssociateModal: FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue?: any;
  setChosenValue: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue }) => {
  const [associate, setAssociated] = useState<{ id: string; name: string }[]>();

  useEffect(() => {
    getAllCustomResource(0).then((res) => {
      if (res) {
        setAssociated(res);
      }
    });
  }, []);

  return (
    <Popover
      title={'select distributor(s)'}
      visible={visible}
      setVisible={setVisible}
      chosenValue={chosenValue}
      setChosenValue={setChosenValue}
      groupCheckboxList={associate?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      })}
    />
  );
};
