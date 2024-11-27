import { FC, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { message } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon.svg';

import { confirmDelete } from '@/helper/common';
import { createCollection, deleteCollection, getCollections, updateCollection } from '@/services';
import { createLabel, deleteLabel, getLabels, updateLabel } from '@/services/label.api';
import { trimEnd, trimStart } from 'lodash';

import {
  onShowRelatedProductByCollection,
  setPartialProductDetail,
  setRelatedProduct,
} from '../reducers';
import { RelatedCollection } from '../types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import store, { RootState, useAppSelector } from '@/reducers';
import { setLabels } from '@/reducers/label';
import { Collection, CollectionRelationType } from '@/types';

import CustomButton from '@/components/Button';
import { CustomInput } from '@/components/Form/CustomInput';
import Popover from '@/components/Modal/Popover';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import tableHeaderStyle from '@/components/Table/styles/TableHeader.less';
import { ActionMenu } from '@/components/TableAction';
import { MainTitle, RobotoBodyText } from '@/components/Typography';
import { CustomDropDown } from '@/features/product/components/ProductTopBarItem';

import styles from './index.less';

export interface DynamicCheckboxValue extends CheckboxValue, Partial<Collection> {
  editLabel?: boolean;
  brand_id?: string;
  subs?: {
    id: string;
    name: string;
    brand_id: string;
    parent_id: string;
  }[];
}

interface MultiCollectionModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  chosenValue: DynamicCheckboxValue[];
  setChosenValue: (value: DynamicCheckboxValue[]) => void;
  chosenLabel: DynamicCheckboxValue[];
  setChosenLabel: (value: DynamicCheckboxValue[]) => void;
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

export const CollectionAndLabelModal: FC<MultiCollectionModalProps> = ({
  visible,
  setVisible,
  chosenValue,
  setChosenValue,
  chosenLabel,
  setChosenLabel,
  brandId,
  collectionType,
  categoryIds,
  isCateSupported,
}) => {
  const { relatedProductOnView, relatedProduct } = useAppSelector((state) => state.product);
  const [data, setData] = useState<DynamicCheckboxValue[]>([]);
  // const [labels, setLabels] = useState<DynamicCheckboxValue[]>([]);
  const curData = useRef<DynamicCheckboxValue[]>([]);
  const [newOption, setNewOption] = useState<string>();
  const [newLabel, setNewLabel] = useState<string>();
  const [newSubLabel, setNewSubLabel] = useState<string>();

  /// collection item
  const [selected, setSelected] = useState<DynamicCheckboxValue[]>([]);

  const [editable, setEditable] = useState<boolean>(false);

  /// for handle edit
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(false);

  /// for X Collection
  const [isX, setIsX] = useState<boolean>(false);

  const dispatch = useDispatch();
  const labels = useSelector((state: RootState) => state.label.labels);

  const getLabelList = async () => {
    const labelList = await getLabels(brandId);
    const currentData = labelList.map((item) => ({
      ...item,
      value: item.id,
      label: item.name,
      disabled: false,
      editLabel: false,
    }));

    dispatch(setLabels(currentData));
  };
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

        const collSelected = res
          .map((item) => {
            if (curCollectionSelect?.some((el) => el.value === item.id && item.name === el.label)) {
              return {
                value: item.id,
                label: item.name,
              };
            }

            return undefined;
          })
          .filter(Boolean) as DynamicCheckboxValue[];
        if (updateCurrentSelect) {
          if (collSelected.length > 0) setSelected(collSelected);
          else {
            setSelected([{ value: '-1', label: 'X Collection', name: 'X Collection' }]);
            setIsX(true);
          }
        }

        const currentData = res.map((item) => ({
          ...item,
          value: item.id,
          label: item.name,
          disabled: false,
          editLabel: false,
        }));

        const addedCurrentData = [
          {
            value: '-1',
            label: 'X Collection',
            name: 'X Collection',
            disabled: false,
            editLabel: false,
            relation_type: 2,
          },
          ...currentData,
        ];

        const newCurrentData =
          collSelected.length == 0
            ? addedCurrentData.map((coll) =>
                coll.value === '-1' ? coll : { ...coll, disabled: true },
              )
            : addedCurrentData;

        curData.current = newCurrentData;

        setData(newCurrentData);
      }
    });
  };
  const onCollClick = (value: string) => {
    if (value === '-1') {
      const newIsX = !isX;
      setIsX(newIsX);
      if (!newIsX) setData(data.map((coll) => ({ ...coll, disabled: false })));
      else {
        setData(data.map((coll) => (coll.value === '-1' ? coll : { ...coll, disabled: true })));
        setSelected([{ value: '-1', label: 'X Collection', name: 'X Collection' }]);
      }
    }
  };
  useEffect(() => {
    getCollectionList();
    getLabelList();

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
  const onChangeCreateNewLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = trimStart(e.target.value);
    setNewLabel(newValue);
  };

  const handleOnChangeCreateNewSubLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = trimStart(event.target.value);
    setNewSubLabel(newValue);
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
  const handleCreateLabel = () => {
    if (newLabel) {
      // check if value is existed
      const isExisted = labels
        .map((item: any) => {
          return {
            ...item,
            name: String(item.name).toLocaleLowerCase(),
          };
        })
        .find((item: any) => item.name == newLabel.toLocaleLowerCase() && item.parent_id == null);

      if (isExisted) {
        message.error('Label is existed');
        return;
      }

      createLabel({
        name: newLabel,
        brand_id: brandId,
      }).then((newData) => {
        if (newData) {
          // set empty input
          setNewLabel(undefined);
          // get list after created new
          getLabelList();
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
  const onChangeLabelNameAssigned =
    (selectedValue: DynamicCheckboxValue, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const newData = [...labels];
      newData[index] = {
        ...selectedValue,
        label: trimStart(e.target.value),
        editLabel: true,
        disabled: false,
      };

      dispatch(setLabels(newData));
    };

  const handleEditNameAssigned =
    (
      type: 'save' | 'cancel',
      index: number,
      selectedValue: DynamicCheckboxValue,
      entity?: 'label' | 'collection',
    ) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      e.stopPropagation();

      let tempData = data;
      let tempFunction = updateCollection;
      let tempSet = setData;
      if (entity === 'label') {
        tempData = labels;
        tempFunction = updateLabel;
        tempSet = setLabels;
      }
      if (!selectedValue) {
        message.error('Please select one collection');
        return;
      }

      // set active select
      setDefaultStatusForItem(tempData);

      const newData = [...tempData];

      /// re-render data
      if (type === 'cancel') {
        if (entity === 'label') {
          tempData.forEach((label) => {
            if (String(label.value) !== String(selectedValue.value)) {
              label.disabled = false;
            }
          });
          const temp = [...tempData];
          tempSet(temp);
          return;
        }
        setData(curData.current);
        return;
      }

      const newName = trimEnd(String(newData[index].label));

      if (type === 'save') {
        if (!newName) {
          message.error(`Please enter ${entity} name`);
          // set input focus
          setEditable(true);
          return;
        }

        newData[index] = {
          value: selectedValue.value,
          label: newName,
          editLabel: false,
          disabled: false,
        };

        // check if collection is existed
        const isExisted = tempData
          .map((item) => {
            if (item.value !== selectedValue.value) {
              return String(item.label).toLocaleLowerCase();
            }
          })
          .includes(newName.toLocaleLowerCase());

        if (isExisted) {
          message.error('Item is existed');
          return;
        }

        tempFunction(String(selectedValue.value), { name: newName }).then((isSuccess) => {
          if (isSuccess) {
            tempSet(newData);
          }
        });
      }
    };

  const handleDelete = (id: string, type?: 'label' | 'collection') => {
    let tempData = data;
    let tempFunction = deleteCollection;
    if (type === 'label') {
      tempData = labels;
      tempFunction = deleteLabel;
    }
    confirmDelete(() => {
      const newData = tempData.filter((item) => item.value !== id);

      tempFunction(id).then((isSuccess) => {
        if (isSuccess) {
          if (chosenValue?.some((el) => el.value === id)) {
            // update data selected
            setChosenValue(chosenValue.filter((el) => el.value === id));
          }

          /// update data
          if (type === 'label') {
            dispatch(setLabels(newData));
          } else {
            setData(newData);
          }
        }
      });
    });
  };

  const handleEdit = (
    selectedValue: DynamicCheckboxValue,
    index: number,
    type?: 'label' | 'collection',
  ) => {
    // set default value for all items
    let tempData = data;
    if (type === 'label') {
      tempData = labels;
    }
    setDefaultStatusForItem(tempData);

    const foundedItem = tempData?.find((item) => item.value === selectedValue.value);

    if (foundedItem?.value) {
      // set input focus
      setEditable(true);
      /// disabled select another items
      tempData.forEach((item) => {
        if (String(item.value) !== String(selectedValue.value)) {
          item.disabled = true;
        }
      });

      const newData = [...tempData];
      const chosenItem: DynamicCheckboxValue = {
        label: foundedItem.label,
        value: foundedItem.value,
        disabled: false,
        editLabel: true,
      };

      newData[index] = chosenItem;

      if (type === 'label') {
        dispatch(setLabels(newData));
      } else {
        setData(newData);
      }
    }
  };

  const handleCloseModal = (isClose: boolean) => (isClose ? undefined : setVisible(false));

  /**
   * Assigns a new sub-label to a main label
   *
   * @param brand_id - The ID of the brand to assign the sub-label to.
   * @param parent_id - The optional ID of the parent label for the new sub-label.
   */
  const handleAssignSubLabel = (brand_id: string, parent_id: string | undefined) => async () => {
    const subLabeldata = { name: newSubLabel || '', brand_id, parent_id };

    const res = await createLabel(subLabeldata);

    if (res) {
      const newSubLabelData: DynamicCheckboxValue = {
        label: res.name,
        value: res.id,
        brand_id: res.brand_id,
      };

      dispatch(setLabels([...labels, newSubLabelData]));
      setNewSubLabel('');
      getLabelList();
    }
  };

  const subLabelItems: ItemType[] = labels.map(({ id, name, brand_id }: DynamicCheckboxValue) => {
    return {
      key: `label-${id}`,
      label: name,
      onClick: handleAssignSubLabel(brand_id!, id),
    };
  });

  return (
    <Popover
      title="SELECT COLLECTION & LABEL"
      notScrollWholeContent
      onCollClick={onCollClick}
      className={styles.modal}
      visible={visible}
      setVisible={handleCloseModal}
      secondaryModal
      disabledSubmit={!data.length || disabledSubmit}
      chosenValue={selected}
      rightChosenValue={chosenLabel}
      width={576 * 2}
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
            .filter(Boolean)
            .filter((item) => item?.value !== '-1') as DynamicCheckboxValue[],
        );

        if (relatedProductOnView?.id) {
          /// update product related data by collection chosen
          store.dispatch(onShowRelatedProductByCollection({} as any));
        }

        if (selectedItem.length == 1) {
          const newRelatedProductData: RelatedCollection[] = [];
          const newCollectionIds = selectedItem.map((el) => el.value);

          relatedProduct.forEach((el) => {
            el.collection_ids.forEach((item) => {
              if (newCollectionIds.includes(item)) {
                newRelatedProductData.push(el);
              }
            });
          });
          store.dispatch(setRelatedProduct(newRelatedProductData));
        }

        handleCloseModal(!visible);
      }}
      setRightChosenValue={(selectedItem) => {
        dispatch(
          setPartialProductDetail({
            label_ids: selectedItem ? selectedItem.map((item: any) => String(item.value)) : [],
          }),
        );
        setChosenLabel(
          labels
            .map((el) => {
              if (selectedItem?.some((item: any) => item.value === el.value)) {
                return el;
              }

              return undefined;
            })
            .filter(Boolean) as DynamicCheckboxValue[],
        );
      }}
      extraTopAction={
        <div className={`${styles.boxShadowBottom} d-flex justify-between`}>
          <div className={'side-container '}>
            <div className={`side-container-wrapper`}>
              <MainTitle level={3}>Create New Collection</MainTitle>
              <div className={`flex-between flex-grow border-bottom-light mr-16`}>
                <CustomInput
                  placeholder="type new collection name"
                  value={newOption}
                  onChange={onChangeCreateNewCollection}
                  style={{ fontSize: 14 }}
                />
                <CustomPlusButton
                  size={18}
                  label="Add"
                  disabled={!newOption}
                  onClick={newOption ? handleCreateCollection : undefined}
                />
              </div>
            </div>
          </div>
          <div className={'side-container'}>
            <div className={'sub-side-container border-bottom-light'}>
              <MainTitle level={3}>Create New Label</MainTitle>
              <div className="flex-between flex-grow">
                <CustomInput
                  placeholder="type main-label name"
                  value={newLabel}
                  onChange={onChangeCreateNewLabel}
                  style={{ fontSize: 14 }}
                />
                <CustomPlusButton
                  size={18}
                  label="Add"
                  disabled={!newLabel}
                  onClick={newLabel ? handleCreateLabel : undefined}
                />
              </div>
            </div>
            <div className={'sub-side-container border-bottom-light'}>
              <MainTitle customClass={`mb-24`}></MainTitle>
              <div className="flex-between flex-grow">
                <CustomInput
                  placeholder="type sub-label name"
                  value={newSubLabel}
                  onChange={handleOnChangeCreateNewSubLabel}
                  style={{ fontSize: 14 }}
                />

                <CustomDropDown
                  items={subLabelItems}
                  menuStyle={{ width: 'max-content', height: 'fit-content' }}
                  placement="bottomRight"
                  disabled={!newSubLabel}
                  className={styles.dropdown}
                  hideDropdownIcon
                  dropDownStyles={{ cursor: `${!newSubLabel ? 'not-allowed' : 'pointer'}` }}
                >
                  <div
                    className={`${!newSubLabel ? 'mono-color-dark ' : 'pure-black '} ${
                      styles.dropdown__text
                    }`}
                  >
                    Add To
                    <div
                      className={`  ${
                        !newSubLabel
                          ? tableHeaderStyle.customContentDisable
                          : tableHeaderStyle.customContent
                      } `}
                    >
                      <span
                        style={{ width: 18, height: 18 }}
                        className={`inline-block ${
                          !newSubLabel
                            ? tableHeaderStyle.customButtonDisable
                            : tableHeaderStyle.customButton
                        } ${tableHeaderStyle.customContent} 
                      
                   `}
                      >
                        <PlusIcon />
                      </span>
                    </div>
                  </div>
                </CustomDropDown>
              </div>
            </div>
          </div>
        </div>
      }
      leftCheckboxList={{
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
                  <RobotoBodyText level={5}>{item.label}</RobotoBodyText>
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
      rightCheckboxList={{
        isSelectAll: false,
        heading: (
          <MainTitle customClass="title" level={3}>
            Assign bellow label
          </MainTitle>
        ),
        options: labels?.map((item, index) => {
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
                      onChange={onChangeLabelNameAssigned(item, index)}
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
                        onClick={handleEditNameAssigned('save', index, item, 'label')}
                      >
                        Save
                      </CustomButton>
                      <CustomButton
                        size="small"
                        variant="primary"
                        properties="rounded"
                        buttonClass={styles.btnSize}
                        onClick={handleEditNameAssigned('cancel', index, item, 'label')}
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
                          onClick: () => handleEdit(item, index, 'label'),
                        },
                        {
                          type: 'deleted',
                          onClick: () => handleDelete(String(item.value), 'label'),
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
