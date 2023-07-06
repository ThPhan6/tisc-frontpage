import { FC, useEffect, useRef, useState } from 'react';

import { message } from 'antd';

import { confirmDelete } from '@/helper/common';
import { createCollection, deleteCollection, getCollections, updateCollection } from '@/services';
import { trimEnd, trimStart } from 'lodash';

import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { Collection, CollectionRelationType } from '@/types';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import Popover from '@/components/Modal/Popover';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ActionMenu } from '@/components/TableAction';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import styles from './index.less';

export interface DynamicCheckboxValue extends CheckboxValue, Partial<Collection> {
  editLabel?: boolean;
}

interface MultiCollectionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue: DynamicCheckboxValue[];
  setChosenValue: (value: DynamicCheckboxValue[]) => void;
  brandId: string;
  collectionType: CollectionRelationType;
  categoryIds?: string[];
  isCateSupported?: boolean;
}

const setDefaultStatusForItem = (data: DynamicCheckboxValue[]) => {
  for (const element of data) {
    element.disabled = false;
    element.editLabel = false;
  }
};

export const MultiCollectionModal: FC<MultiCollectionModalProps> = ({
  visible,
  setVisible,
  chosenValue,
  setChosenValue,
  brandId,
  collectionType,
  categoryIds,
  isCateSupported,
}) => {
  const [data, setData] = useState<DynamicCheckboxValue[]>([]);
  const curData = useRef<DynamicCheckboxValue[]>([]);
  const [newOption, setNewOption] = useState<string>();

  /// collection item
  const [selected, setSelected] = useState<DynamicCheckboxValue[]>([]);

  const [editable, setEditable] = useState<boolean>(false);

  /// for handle edit
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);

  const getCollectionList = (
    newData?: DynamicCheckboxValue,
    updateCurrentSelect: boolean = true,
  ) => {
    getCollections(brandId, collectionType, categoryIds).then((res) => {
      if (res) {
        const curCollectionSelect = newData?.value
          ? [newData]
          : selected?.length
          ? selected
          : chosenValue;

        if (updateCurrentSelect) {
          setSelected(
            res
              .map((item) => {
                if (
                  curCollectionSelect?.some((el) => el.value === item.id && item.name === el.label)
                ) {
                  return {
                    value: item.id,
                    label: item.name,
                  };
                }

                return undefined;
              })
              .filter(Boolean) as DynamicCheckboxValue[],
          );
        }

        const currentData = res.map((item) => ({
          ...item,
          value: item.id,
          label: item.name,
          disabled: false,
          editLabel: false,
        }));

        curData.current = currentData;

        setData(currentData);
      }
    });
  };

  useEffect(() => {
    getCollectionList();

    return () => {
      curData.current = [];
    };
  }, [brandId, isCateSupported]);

  /// set current selected value
  useEffect(() => {
    if (data.length) {
      const chosenOption: DynamicCheckboxValue[] = [];

      data.forEach((el) => {
        if (chosenValue.find((item) => item.value === el.value)) {
          chosenOption.push(el);
        }
      });

      if (chosenOption.length) {
        setSelected(
          data
            .map((el) => {
              if (chosenValue.some((item) => item.value === el.value)) {
                return el;
              }

              return undefined;
            })
            .filter(Boolean) as DynamicCheckboxValue[],
        );
      }
    }
  }, [chosenValue]);

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
    (selectedValue: DynamicCheckboxValue, index: number) =>
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
    (type: 'save' | 'cancel', index: number, selectedValue: DynamicCheckboxValue) =>
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
        setData(curData.current);
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

        updateCollection(String(selectedValue.value), { name: newCollectionName }).then(
          (isSuccess) => {
            if (isSuccess) {
              setData(newData);
            }
          },
        );
      }
    };

  const handleDelete = (collectionId: string) => {
    confirmDelete(() => {
      const newData = data.filter((item) => item.value !== collectionId);

      deleteCollection(collectionId).then((isSuccess) => {
        if (isSuccess) {
          if (chosenValue?.some((el) => el.value === collectionId)) {
            // update data selected
            setChosenValue(chosenValue.filter((el) => el.value === collectionId));
          }

          /// update data
          setData(newData);
        }
      });
    });
  };

  const handleEdit = (selectedValue: DynamicCheckboxValue, index: number) => {
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
      const chosenCollection: DynamicCheckboxValue = {
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

  return (
    <Popover
      title="SELECT COLLECTION"
      className={styles.modal}
      visible={visible}
      setVisible={handleCloseModal}
      secondaryModal
      disabledSubmit={!data.length || disabledSubmit}
      chosenValue={selected}
      setChosenValue={(selectedItem: CheckboxValue[]) => {
        // active submit btn
        setDisabledSubmit(false);

        // popup being closed, then
        // set default each collection's edit and disabled status
        setDefaultStatusForItem(data);

        // update data when click to submit
        setChosenValue(
          data
            .map((el) => {
              if (selectedItem.some((item) => item.value === el.value)) {
                return el;
              }

              return undefined;
            })
            .filter(Boolean) as DynamicCheckboxValue[],
        );

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
      checkboxList={{
        isSelectAll: false,
        heading: (
          <MainTitle customClass="title" level={3}>
            Assign bellow collection
          </MainTitle>
        ),
        options: data?.map((item, index) => {
          return {
            disabled: item.disabled || item.editLabel,
            value: item.value,
            label: (
              <div
                className={`${styles.labelContent} ${
                  item.disabled || item.editLabel ? styles.inactiveMenu : ''
                } ${item.disabled ? 'cursor-default' : ''} `}
              >
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
                      style={{ height: '100%', marginLeft: 8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <CustomButton
                        size="small"
                        variant="primary"
                        properties="rounded"
                        buttonClass={styles.btnSize}
                        onClick={handleEditNameAssigned('save', index, item)}
                      >
                        Save
                      </CustomButton>
                      <CustomButton
                        size="small"
                        variant="primary"
                        properties="rounded"
                        buttonClass={styles.btnSize}
                        onClick={handleEditNameAssigned('cancel', index, item)}
                      >
                        Cancel
                      </CustomButton>
                    </div>
                  </div>
                )}

                {item.relation_type !== CollectionRelationType.Color ? (
                  <div
                    style={{ cursor: 'default' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    <ActionMenu
                      disabled={item.disabled || item.editLabel}
                      className={`${styles.marginSpace} ${
                        item.disabled ? 'mono-color-medium' : 'mono-color'
                      } `}
                      overlayClassName={styles.actionMenuOverLay}
                      editActionOnMobile={false}
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
                ) : null}
              </div>
            ),
          };
        }),
      }}
    />
  );
};
