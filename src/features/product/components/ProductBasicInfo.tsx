import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as RightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';

import { confirmDelete } from '@/helper/common';
import { useBoolean, useCheckPermission } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { createCollection, deleteCollection, getCollections } from '@/services';

import { setPartialProductDetail } from '@/features/product/reducers';
import { useAppSelector } from '@/reducers';
import type { Collection } from '@/types';
import { CollectionRelation } from '@/types';

import CustomCollapse from '@/components/Collapse';
import InputGroup from '@/components/EntryForm/InputGroup';
import { CustomInput } from '@/components/Form/CustomInput';
import Popover from '@/components/Modal/Popover';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './detail.less';

export const ProductBasicInfo: React.FC = () => {
  const dispatch = useDispatch();
  const editable = useCheckPermission('TISC Admin');

  const product = useAppSelector((state) => state.product);
  const { name, description, collection } = product.details;
  const [visible, setVisible] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollection, setNewCollection] = useState('');
  const disabled = useBoolean();

  const getCollectionList = () => {
    if (product.brand?.id) {
      getCollections(product.brand.id, CollectionRelation.Brand).then(setCollections);
    }
  };

  const handleCreateCollection = () => {
    if (!product.brand) {
      /// do nothing
      return;
    }
    disabled.setValue(true);
    createCollection({
      name: newCollection,
      relation_id: product.brand.id,
      relation_type: CollectionRelation.Brand,
    }).then((res) => {
      /// disable loading
      disabled.setValue(false);
      if (res) {
        // reset data collection
        setNewCollection('');
        /// reload collection list
        getCollectionList();
      }
    });
  };

  const handleRemoveCollection = (e: React.ChangeEvent<any>, id: string) => {
    /// prevent checked radio value
    e.stopPropagation();
    e.preventDefault();
    // call API
    confirmDelete(() => {
      deleteCollection(id).then((isSuccess) => {
        if (isSuccess) {
          getCollectionList();
        }
      });
    });
  };

  //
  useEffect(() => {
    if (product.brand?.id) {
      getCollectionList();
    }
  }, [product.brand]);

  return (
    <>
      <CustomCollapse
        showActiveBoxShadow
        defaultActiveKey={['1']}
        header={
          <div className="header-group">
            <BodyText level={4} customClass="brand-label">
              Brand
            </BodyText>
            <BodyText level={6} fontFamily="Roboto" customClass="brand-name">
              {product.brand?.name ?? 'N/A'}
            </BodyText>
            {product.brand?.logo ? <img src={showImageUrl(product.brand.logo)} /> : null}
          </div>
        }
        customHeaderClass={styles.productHeaderCollapse}>
        {/* Collection */}
        <InputGroup
          horizontal
          fontLevel={4}
          label="Collection"
          placeholder={editable ? 'create or assign from the list' : ''}
          rightIcon={editable ? <RightLeftIcon onClick={() => setVisible(true)} /> : undefined}
          noWrap
          value={collection?.name ?? ''}
          readOnly={editable === false}
          containerClass={!editable ? styles.viewInfo : ''}
        />

        {/* Product */}
        <InputGroup
          horizontal
          containerClass={!editable ? styles.viewInfo : ''}
          fontLevel={4}
          label="Product"
          placeholder={editable ? 'type max.100 characters short description' : ''}
          readOnly={editable === false}
          maxLength={100}
          noWrap
          value={name}
          onChange={(e) => {
            dispatch(
              setPartialProductDetail({
                name: e.target.value,
              }),
            );
          }}
        />
        {/* Product ID */}
        <InputGroup horizontal fontLevel={4} label="Product ID" readOnly={true} noWrap />
        {/* Description */}
        <InputGroup
          horizontal
          containerClass={!editable ? styles.viewInfo : ''}
          fontLevel={4}
          label="Description"
          placeholder={editable ? 'max.50 words of product summary' : ''}
          readOnly={editable === false}
          maxWords={50}
          noWrap
          value={description}
          onChange={(e) => {
            dispatch(
              setPartialProductDetail({
                description: e.target.value,
              }),
            );
          }}
        />
      </CustomCollapse>
      {editable && (
        <Popover
          title="SELECT COLLECTION"
          visible={visible}
          setVisible={setVisible}
          chosenValue={
            collection
              ? {
                  value: collection.id,
                  label: collection.name,
                }
              : undefined
          }
          setChosenValue={(selected) => {
            if (selected) {
              const selectedCollection = collections.find((col) => col.id === selected.value);
              if (selectedCollection) {
                dispatch(
                  setPartialProductDetail({
                    collection: {
                      name: selectedCollection.name,
                      id: selectedCollection.id,
                    },
                  }),
                );
              }
            }
          }}
          groupRadioList={[
            {
              heading: 'Assign bellow Collection',
              options: collections.map((item) => {
                return {
                  label: (
                    <span className={styles.collectionLabel}>
                      {item.name}
                      <RemoveIcon onClick={(e: any) => handleRemoveCollection(e, item.id)} />
                    </span>
                  ),
                  value: item.id,
                };
              }),
            },
          ]}
          extraTopAction={
            <div className={styles.extraAction}>
              <MainTitle level={3} customClass="extra-heading">
                Create new collection
              </MainTitle>
              <div className="extra-input-group">
                <CustomInput
                  className="extra-input"
                  placeholder="type new collection name"
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                />
                <div
                  className="extra-custom-button"
                  onClick={disabled.value ? undefined : handleCreateCollection}>
                  <MainTitle level={4} customClass="extra-custom-button-label">
                    Add
                  </MainTitle>
                  <CustomPlusButton size={18} />
                </div>
              </div>
            </div>
          }
        />
      )}
    </>
  );
};
