import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

import { confirmDelete } from '@/helper/common';
import { createCollection, deleteCollection, getCollections, updateCollection } from '@/services';
import { trimEnd, trimStart, uniqueId } from 'lodash';

import { RadioValue } from '@/components/CustomRadio/types';
import { CollectionRelationType } from '@/types';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import Popover from '@/components/Modal/Popover';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

interface DynamicRadioValue extends RadioValue {
  editLabel?: boolean;
}

interface CollectionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue: DynamicRadioValue;
  setChosenValue: (value: DynamicRadioValue) => void;
  brandId: string;
  collectionType: CollectionRelationType;
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
  brandId,
  collectionType,
}) => {
  const [data, setData] = useState<DynamicRadioValue[]>([]);
  const [newOption, setNewOption] = useState<string>();

  const [selected, setSelected] = useState<DynamicRadioValue>({ value: '', label: '' });

  const [editable, setEditable] = useState<boolean>(false);

  /// for handle edit
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);

  const getCollectionList = () => {
    getCollections(brandId, collectionType).then((res) => {
      if (res) {
        const collectionData = [{ id: 'other', name: 'default design name' }, ...res];

        const chosenOption = res.find((item) => item.id && item.name === selected.label);

        if (chosenOption) {
          setSelected({
            value: chosenOption.id,
            label: chosenOption.name,
          });
        }

        setData(
          collectionData.map((item) => ({
            value: item.id,
            label: item.name,
            disabled: false,
            editLabel: false,
          })),
        );
      }
    });
  };

  useEffect(() => {
    getCollectionList();
  }, [brandId]);

  /// set selected value
  useEffect(() => {
    if (data.length) {
      const chosenOption = data.find((item) => item.value === chosenValue.value);
      if (chosenOption) {
        setSelected({
          value: chosenOption.value,
          label: chosenOption.label,
        });
      } else {
        setSelected({
          value: '',
          label: '',
        });
      }
    }
  }, [chosenValue.value]);

  // set default value when close popup
  useEffect(() => {
    if (visible === false) {
      setDisabledSubmit(false);
      setDefaultStatusForItem(data);
    }
  }, [visible === false]);

  const onChangeCreateNewCollection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const randomId = uniqueId();
    const newValue = trimStart(e.target.value);
    setNewOption(newValue);

    setSelected({
      label: newValue,
      value: randomId,
    });
  };

  const handleCreateCollection = () => {
    if (newOption) {
      // check if value is existed
      const isCollectionExisted = data
        .map((item) => String(item.label).toLocaleLowerCase())
        .includes(newOption.toLocaleLowerCase());

      if (isCollectionExisted) {
        message.error('Collection is existed');
        return;
      }

      createCollection({
        relation_id: brandId,
        relation_type: collectionType,
        name: newOption,
      }).then((isSuccess) => {
        if (isSuccess) {
          // set empty input
          setNewOption(undefined);
          // get list after created new collection
          getCollectionList();
        }
      });
    }
  };
  const onChangeCollectionNameAssigned =
    (selectedValue: DynamicRadioValue, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newData = [...data];
      newData[index] = { ...selectedValue, editLabel: true, disabled: false };

      setData(newData);

      /// only update UI
      setSelected({
        ...selectedValue,
        label: trimStart(e.target.value),
      });
    };

  const handleEditNameAssigned =
    (type: 'save' | 'cancel', index: number, selectedValue: DynamicRadioValue) => () => {
      if (!selectedValue) {
        message.error('Please select one collection');
        return;
      }

      // set active select
      setDefaultStatusForItem(data);

      //  previous data
      const newData = [...data];

      if (type === 'cancel') {
        newData[index] = { ...selectedValue, editLabel: false, disabled: false };
        // set chosen value
        setChosenValue(newData[index]);
        setData(newData);
      }

      if (type === 'save') {
        if (!selected.label) {
          message.error('Please, enter collection name');
          // set input focus
          setEditable(true);
          return;
        }
        const newCollectionName = trimEnd(String(selected.label));

        newData[index] = {
          value: selected.value,
          label: newCollectionName,
          editLabel: false,
          disabled: false,
        };

        // check if value is existed
        const isCollectionExisted = data
          .map((item) => String(item.label).toLocaleLowerCase())
          .includes(newCollectionName.toLocaleLowerCase());

        if (isCollectionExisted) {
          message.error('Collection is existed');
          return;
        }

        updateCollection(String(selectedValue.value), newCollectionName).then((isSuccess) => {
          if (isSuccess) {
            /// set chosen value
            setChosenValue(newData[index]);
            setData(newData);
          }
        });
      }
    };

  const handleDelete = (collectionId: string) => {
    confirmDelete(() => {
      const newData = data.filter((item) => item.value !== collectionId);

      deleteCollection(collectionId).then((isSuccess) => {
        if (isSuccess) {
          // update data selected
          setChosenValue({
            value: '',
            label: '',
          });

          /// update data
          setData(newData);
        }
      });
    });
  };

  const handleEdit = (selectedValue: DynamicRadioValue, index: number) => {
    const foundedItem = data?.find((item) => item.value === selectedValue.value);
    if (foundedItem?.value) {
      // disabled submit btn
      setDisabledSubmit(true);
      // set input focus
      setEditable(true);
      /// disabled select another items
      data.forEach((collection) => {
        if (collection.value !== selectedValue.value) {
          collection.disabled = true /*  (collection.editLabel = false) */;
        }
      });

      const newData = [...data];
      const chosenCollection: DynamicRadioValue = {
        label: foundedItem.label,
        value: foundedItem.value,
        disabled: false,
        editLabel: true,
      };
      newData[index] = chosenCollection;

      // set selected item
      setSelected(chosenCollection);

      setData(newData);
    }
  };

  const handleCloseModal = (isClose: boolean) => (isClose ? undefined : setVisible(false));

  return (
    <Popover
      title="SELECT COLLECTION"
      className={styles.modal}
      visible={visible}
      setVisible={handleCloseModal}
      disabledSubmit={!data.length || disabledSubmit}
      chosenValue={selected}
      setChosenValue={(selectedItem: RadioValue) => {
        const chosenItem = data.find((item) => item.value === selectedItem.value);
        if (chosenItem) {
          // active submit btn
          setDisabledSubmit(false);

          // popup being closed, then
          // set default each collection's edit and disabled status
          setDefaultStatusForItem(data);

          // update data when click to submit
          setChosenValue({
            value: chosenItem.value,
            label: chosenItem.label,
          });
        }

        setTimeout(() => {
          handleCloseModal(!visible);
        }, 100);
      }}
      extraTopAction={
        <div className={styles.boxShadowBottom}>
          <MainTitle level={3}>Create new collection</MainTitle>
          <div className="flex-between">
            <CustomInput
              placeholder="type collection name, then click Add button"
              value={newOption}
              onChange={(e) => onChangeCreateNewCollection(e)}
            />
            <CustomPlusButton
              size={18}
              label="Add"
              disabled={!newOption}
              onClick={newOption ? handleCreateCollection : undefined}
            />
          </div>
        </div>
      }
      groupRadioList={[
        {
          heading: 'Assign bellow collection',
          options: data?.map((item, index) => {
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
                          onClick={handleEditNameAssigned('save', index, item)}>
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
  );
};
