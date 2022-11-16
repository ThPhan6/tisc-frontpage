import { FC, useEffect, useState } from 'react';

import { getAllCustomResource } from '../../services';

import { CustomResourceType } from '../../types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { useAppSelector } from '@/reducers';

import Popover from '@/components/Modal/Popover';

import styles from '../../CustomResource.less';

export const AssociateModal: FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue: CheckboxValue[];
  setChosenValue: (value: any) => void;
}> = ({ visible, setVisible, chosenValue, setChosenValue }) => {
  const [associates, setAssociates] = useState<{ id: string; name: string }[]>();

  const customResourceType = useAppSelector((state) => state.officeProduct.customResourceType);

  useEffect(() => {
    getAllCustomResource(
      customResourceType === CustomResourceType.Brand
        ? CustomResourceType.Distributor
        : CustomResourceType.Brand,
    ).then((res) => {
      if (res) {
        const selectedAssociate = chosenValue.map((checked) =>
          res.find((associate) => associate.id === checked.value),
        );
        if (selectedAssociate) {
          setChosenValue(
            selectedAssociate.map((item: any) => ({
              label: item.name,
              value: item.id,
            })),
          );
        }
        setAssociates(res);
      }
    });
  }, []);

  return (
    <Popover
      title={`select ${
        customResourceType === CustomResourceType.Brand ? 'distributor(s)' : 'brand(s)'
      }`}
      visible={visible}
      setVisible={setVisible}
      chosenValue={chosenValue}
      setChosenValue={setChosenValue}
      groupCheckboxList={associates?.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      })}
      hasOrtherInput={false}
      className={styles.customModal}
    />
  );
};
