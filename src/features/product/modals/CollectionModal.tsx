import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

import { confirmDelete } from '@/helper/common';
import { createCollection, deleteCollection, getCollections, updateCollection } from '@/services';
import { trimEnd, trimStart } from 'lodash';

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

  /// collection item
  const [selected, setSelected] = useState<DynamicRadioValue>({ value: '', label: '' });

  const [editable, setEditable] = useState<boolean>(false);

  /// for handle edit
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);

  const getCollectionList = (newData?: DynamicRadioValue, updateCurrentSelect: boolean = true) => {
    getCollections(brandId, collectionType).then((res) => {
      if (res) {
        const curCollectionSelect = newData?.value
          ? newData
          : selected.value
          ? selected
          : chosenValue;

        if (updateCurrentSelect) {
          const chosenOption = res.find(
            (item) =>
              item.id === curCollectionSelect.value && item.name === curCollectionSelect.label,
          );

          if (chosenOption) {
            setSelected({
              value: chosenOption.id,
              label: chosenOption.name,
            });
          }
        }

        setData(
          res.map((item) => ({
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

  /// set current selected value
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
    const newValue = trimStart(e.target.value);
    setNewOption(newValue);
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
      }).then((newData) => {
        if (newData) {
          // set empty input
          setNewOption(undefined);
          // get list after created new collection
          getCollectionList(
            {
              value: newData.id,
              label: newData.name,
              disabled: false,
              editLabel: false,
            },
            false,
          );
        }
      });
    }
  };

  const onChangeCollectionNameAssigned =
    (selectedValue: DynamicRadioValue, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const newData = [...data];
      newData[index] = {
        ...selectedValue,
        label: trimStart(e.target.value),
        editLabel: true,
        disabled: false,
      };

      setData(newData);
    };

  const handleEditNameAssigned =
    (type: 'save' | 'cancel', index: number, selectedValue: DynamicRadioValue) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      if (!selectedValue) {
        message.error('Please select one collection');
        return;
      }

      // set active select
      setDefaultStatusForItem(data);

      const newData = [...data];

      /// re-render data
      if (type === 'cancel') {
        setData(newData);
        return;
      }

      const newCollectionName = trimEnd(String(newData[index].label));

      if (type === 'save') {
        if (!newCollectionName) {
          message.error('Please, enter collection name');
          // set input focus
          setEditable(true);
          return;
        }

        newData[index] = {
          value: selectedValue.value,
          label: newCollectionName,
          editLabel: false,
          disabled: false,
        };

        // check if collection is existed
        const isCollectionExisted = data
          .map((item) => {
            if (item.value !== selectedValue.value) {
              return String(item.label).toLocaleLowerCase();
            }
          })
          .includes(newCollectionName.toLocaleLowerCase());

        if (isCollectionExisted) {
          message.error('Collection is existed');
          return;
        }

        updateCollection(String(selectedValue.value), newCollectionName).then((isSuccess) => {
          if (isSuccess) {
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
          if (chosenValue.value === collectionId) {
            // update data selected
            setChosenValue({
              value: '',
              label: '',
            });
          }

          /// update data
          setData(newData);
        }
      });
    });
  };

  const handleEdit = (selectedValue: DynamicRadioValue, index: number) => {
    // set default value for all items
    setDefaultStatusForItem(data);

    const foundedItem = data?.find((item) => item.value === selectedValue.value);

    if (foundedItem?.value) {
      // set input focus
      setEditable(true);
      /// disabled select another items
      data.forEach((collection) => {
        if (String(collection.value) !== String(selectedValue.value)) {
          collection.disabled = true;
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

      setData(newData);
    }
  };

  const handleCloseModal = (isClose: boolean) => (isClose ? undefined : setVisible(false));

  console.log('selected', selected);

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

        handleCloseModal(!visible);
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
              disabled: item.disabled || item.editLabel,
              value: item.value,
              label: (
                <div
                  className={`${styles.labelContent} ${
                    item.disabled || item.editLabel ? styles.inactiveMenu : ''
                  } ${item.disabled ? 'cursor-default' : ''} `}>
                  {!item.editLabel ? (
                    <RobotoBodyText level={6}>{item.label}</RobotoBodyText>
                  ) : (
                    <div className={styles.actionBtn} key={String(item.value) || index}>
                      <CustomInput
                        autoFocus={editable}
                        placeholder="type here"
                        className={styles.paddingLeftNone}
                        value={String(item.label)}
                        onChange={onChangeCollectionNameAssigned(item, index)}
                      />
                      <div
                        className="cursor-default flex-start"
                        style={{ height: '100%' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}>
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

                  <div
                    style={{ cursor: item.disabled || item.editLabel ? 'default' : 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}>
                    <ActionMenu
                      disabled={item.disabled || item.editLabel}
                      className={`${styles.marginSpace} ${
                        item.disabled ? 'mono-color-medium' : 'mono-color'
                      } `}
                      overlayClassName={styles.actionMenuOverLay}
                      offsetAlign={[14, -2]}
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
                </div>
              ),
            };
          }),
        },
      ]}
    />
  );
};
