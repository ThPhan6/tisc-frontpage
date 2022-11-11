import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

import { confirmDelete } from '@/helper/common';
import { trimStart, uniqueId } from 'lodash';

import { RadioValue } from '@/components/CustomRadio/types';

import CustomButton from '@/components/Button';
import GroupRadioList from '@/components/CustomRadio/RadioList';
import { CustomInput } from '@/components/Form/CustomInput';
import Popover from '@/components/Modal/Popover';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

const fData: RadioValue[] = [
  { value: 'default', label: 'Design Office Name(default)' },
  { value: '2', label: 'name 1' },
  { value: '3', label: 'name 2' },
];

interface DynamicRadioValue extends RadioValue {
  editLabel?: boolean;
}

interface CollectionModalRequestBody {
  name: string;
  collections: DynamicRadioValue[];
}

const DEFAULT_STATE: CollectionModalRequestBody = {
  name: '',
  collections: [],
};

interface CollectionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue: DynamicRadioValue;
  setChosenValue: (value: DynamicRadioValue) => void;
}

const setDefaultStatusForItem = (data: DynamicRadioValue[]) => {
  for (const element of data) {
    element.disabled = false;
    element.editLabel = false;
  }
};

export const CollectionModal: FC<CollectionModalProps> = ({
  visible,
  setVisible,
  chosenValue,
  setChosenValue,
}) => {
  const [data, setData] = useState<CollectionModalRequestBody>(DEFAULT_STATE);

  const [selected, setSelected] = useState<DynamicRadioValue>({ value: '', label: '' });

  const [editable, setEditable] = useState<boolean>(false);

  /// for handle edit
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);

  useEffect(() => {
    /// call api get list
    setData({
      name: '',
      collections: fData.map((item) => ({
        value: item.value,
        label: item.label,
        disabled: false,
        editLabel: false,
      })),
    });
  }, []);

  // set active submit btn when popup close
  useEffect(() => {
    setDisabledSubmit(false);
    setDefaultStatusForItem(data.collections);
  }, [visible]);

  /// first loading selected value
  useEffect(() => {
    const chosenOption = data.collections.find((item) => item.value === chosenValue.value);
    if (chosenOption) {
      setSelected({
        value: chosenValue.value,
        label: chosenValue.label,
      });
    } else {
      setSelected({
        value: fData[0].value,
        label: fData[0].label,
      });
    }
  }, [chosenValue]);

  const onChangeCreateNewCollection = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevState) => ({
      name: trimStart(e.target.value),
      collections: [...prevState.collections],
    }));
  };
  const handleCreateCollection = () => {
    const randomId = uniqueId();
    const newData: RadioValue = { value: randomId, label: data.name };
    setData((prevState) => ({
      name: '',
      collections: [...prevState.collections, newData],
    }));

    // set selected item, update UI
    setSelected(newData);
  };

  const onChangeCollectionNameAssigned =
    (selectedValue: DynamicRadioValue, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log('selectedValue', selectedValue);

      const newData = [...data.collections];
      newData[index] = { ...selectedValue, editLabel: true, disabled: false };

      setData({
        name: '',
        collections: newData,
      });

      /// only update UI
      setSelected({
        ...selectedValue,
        label: trimStart(e.target.value),
      });
    };

  const handleEditNameAssigned =
    (type: 'save' | 'cancel', index: number, selectedValue?: DynamicRadioValue) => () => {
      // set active select
      setDefaultStatusForItem(data.collections);

      // active submit btn
      // setDisabledSubmit(false);

      // keep previous data
      const newData = [...data.collections];

      if (type === 'cancel' && selectedValue) {
        newData[index] = { ...selectedValue, editLabel: false, disabled: false };
      }
      if (type === 'save') {
        if (!selected.label) {
          message.error('Please, enter new collection');
          // set input focus
          setEditable(true);
          return;
        }
        newData[index] = { ...selected, editLabel: false, disabled: false };
      }

      // set chosen value
      setChosenValue(newData[index]);
      setData((prevState) => ({
        ...prevState,
        collections: newData,
      }));
    };

  const onChangeSelectedCollection = (selectedValue: DynamicRadioValue) => {
    const foundedItem = data.collections?.find(
      (collection) => collection.value === selectedValue.value,
    );

    if (foundedItem) {
      /// disabled editting
      setDefaultStatusForItem(data.collections);

      // active submit btn to save current select
      setDisabledSubmit(false);

      setSelected({
        ...selected,
        label: foundedItem.label,
        value: foundedItem.value,
      });
    }
  };

  const handleDelete = (id: string) => {
    setDisabledSubmit(true);
    confirmDelete(() => {
      const newData = data.collections.filter((item) => item.value !== id);

      // clear item selected
      setChosenValue({
        value: '',
        label: '',
      });

      /// update data
      setData((prevState) => ({
        ...prevState,
        collections: newData,
      }));
    });
  };

  const handleEdit = (selectedValue: DynamicRadioValue, index: number) => {
    const foundedItem = data.collections?.find((item) => item.value === selectedValue.value);
    if (foundedItem?.value) {
      // disabled submit btn
      setDisabledSubmit(true);
      // set input focus
      setEditable(true);
      /// disabled select another items
      data.collections.forEach((collection) => {
        if (collection.value !== selectedValue.value) {
          collection.disabled = true /*  (collection.editLabel = false) */;
        }
      });

      const newData = [...data.collections];
      const chosenCollection: DynamicRadioValue = {
        label: foundedItem.label,
        value: foundedItem.value,
        disabled: false,
        editLabel: true,
      };
      newData[index] = chosenCollection;

      // set selected item
      setSelected(chosenCollection);

      setData((prevState) => ({
        ...prevState,
        collections: newData,
      }));
    }
  };

  const handleCloseModal = (isClose: boolean) => (isClose ? undefined : setVisible(false));

  return (
    <Popover
      title="SELECT COLLECTION"
      className={styles.modal}
      visible={visible}
      setVisible={handleCloseModal}
      disabledSubmit={!data.collections.length || disabledSubmit}
      chosenValue={selected}
      onFormSubmit={(selectedItem: RadioValue) => {
        const chosenItem = data.collections.find((item) => item.value === selectedItem.value);
        if (chosenItem) {
          // active submit btn
          setDisabledSubmit(false);

          // popup being closed, then
          // turned off edit and disabled
          setDefaultStatusForItem(data.collections);

          // actually, update data when click to submit
          setChosenValue({
            value: chosenItem.value,
            label: chosenItem.label,
          });
        }

        setTimeout(() => {
          handleCloseModal(!visible);
        }, 100);
      }}>
      <>
        <div className={styles.boxShadowBottom}>
          <MainTitle level={3}>Create new collection</MainTitle>
          <div className="flex-between">
            <CustomInput
              placeholder="type collection name, then click Add button"
              value={data.name}
              onChange={(e) => onChangeCreateNewCollection(e)}
            />
            <CustomPlusButton
              size={18}
              label="Add"
              disabled={!data.name}
              onClick={data.name ? handleCreateCollection : undefined}
            />
          </div>
        </div>

        <GroupRadioList
          selected={selected}
          onChange={onChangeSelectedCollection}
          data={[
            {
              heading: 'Assign bellow collection',
              options: data.collections?.map((item, index) => {
                return {
                  disabled: item.disabled,
                  value: item.value,
                  label: (
                    <div
                      className={`${styles.labelContent} ${
                        item.disabled || item.editLabel ? styles.inactiveMenu : ''
                      }`}>
                      {!item.editLabel ? (
                        <RobotoBodyText level={6}>{item.label}</RobotoBodyText>
                      ) : (
                        <div className={styles.actionBtn}>
                          <CustomInput
                            autoFocus={editable}
                            placeholder="type here"
                            className={styles.paddingLeftNone}
                            value={String(selected.label)}
                            onChange={onChangeCollectionNameAssigned(item, index)}
                          />
                          <div className="cursor-default flex-start">
                            <CustomButton
                              size="small"
                              variant="primary"
                              properties="rounded"
                              buttonClass={styles.btnSize}
                              onClick={handleEditNameAssigned('save', index)}>
                              Save
                            </CustomButton>
                            <CustomButton
                              size="small"
                              variant="primary"
                              properties="rounded"
                              buttonClass={styles.btnSize}
                              onClick={handleEditNameAssigned('cancel', index, item)}>
                              Cancel
                            </CustomButton>
                          </div>
                        </div>
                      )}

                      <ActionMenu
                        disabled={item.disabled || item.editLabel}
                        containerClass={styles.actionMenu}
                        actionItems={[
                          {
                            type: 'updated',
                            label: 'Edit',
                            onClick: () => handleEdit(item, index),
                          },
                          {
                            type: 'deleted',
                            onClick: () => handleDelete(String(item.value)),
                          },
                        ]}
                      />
                    </div>
                  ),
                };
              }),
            },
          ]}
        />
      </>
    </Popover>
  );
};
