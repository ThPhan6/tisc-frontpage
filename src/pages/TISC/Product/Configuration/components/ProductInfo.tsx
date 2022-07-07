import React, { useState, useEffect } from 'react';
import { useBoolean } from '@/helper/hook';
import { BodyText, MainTitle } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import InputGroup from '@/components/EntryForm/InputGroup';
import { CustomInput } from '@/components/Form/CustomInput';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { showImageUrl } from '@/helper/utils';
import { Collapse } from 'antd';
import styles from '../styles/details.less';
import { createCollection, getCollectionByBrandId } from '@/services';
import type { IBrandDetail, ICollection } from '@/types';
import type { RadioValue } from '@/components/CustomRadio/types';

interface IProductInfo {
  brand?: IBrandDetail;
}
const ProductInfo: React.FC<IProductInfo> = (props) => {
  const { brand } = props;
  const [collectionVisible, setCollectionVisible] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<RadioValue>();
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [newCollection, setNewCollection] = useState('');
  const disabled = useBoolean();

  const getCollectionList = () => {
    if (brand?.id) {
      getCollectionByBrandId(brand.id).then(setCollections);
    }
  };

  const handleCreateCollection = () => {
    if (!brand) {
      /// do nothing
      return;
    }
    disabled.setValue(true);
    createCollection({
      name: newCollection,
      brand_id: brand.id,
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

  //
  useEffect(() => {
    if (brand?.id) {
      getCollectionList();
    }
  }, [brand]);

  return (
    <>
      <Collapse
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
        expandIconPosition="right"
      >
        <Collapse.Panel
          key="1"
          className={styles.productHeaderCollapse}
          header={
            <div className="header-group">
              <BodyText level={4} customClass="brand-label">
                Brand
              </BodyText>
              <BodyText level={6} fontFamily="Roboto" customClass="brand-name">
                {brand?.name ?? 'N/A'}
              </BodyText>
              {brand?.logo ? <img src={showImageUrl(brand.logo)} /> : null}
            </div>
          }
        >
          <InputGroup
            horizontal
            fontLevel={4}
            label="Collection"
            placeholder="create or assign from the list"
            rightIcon
            noWrap
            value={(selectedCollection?.label as string) ?? ''}
            onRightIconClick={() => setCollectionVisible(true)}
          />
          <InputGroup
            horizontal
            fontLevel={4}
            label="Product"
            placeholder="type max.50 characters short description"
            maxLength={50}
            noWrap
          />
          <InputGroup horizontal fontLevel={4} label="Product ID" readOnly={true} noWrap />
          <InputGroup
            horizontal
            fontLevel={4}
            label="Description"
            placeholder="max.50 words of product summary"
            maxLength={50}
            noWrap
          />
        </Collapse.Panel>
      </Collapse>
      <Popover
        title="SELECT COLLECTION"
        visible={collectionVisible}
        setVisible={setCollectionVisible}
        chosenValue={selectedCollection}
        setChosenValue={setSelectedCollection}
        groupRadioList={[
          {
            heading: 'Assign bellow Collection',
            options: collections.map((collection) => {
              return {
                label: collection.name,
                value: collection.id,
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
                onClick={disabled.value ? undefined : handleCreateCollection}
              >
                <MainTitle level={4} customClass="extra-custom-button-label">
                  Add
                </MainTitle>
                <CustomPlusButton size={18} />
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};

export default ProductInfo;
