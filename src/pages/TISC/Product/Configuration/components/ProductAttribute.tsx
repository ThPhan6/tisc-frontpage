import React, { useState, useEffect } from 'react';
import { MainTitle } from '@/components/Typography';
import AttributeItem from './AttributeItem';
import { CustomTabs } from '@/components/Tabs';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { getProductAttributeByType } from '@/services';
import { IAttributeListResponse } from '@/types';
import styles from '../styles/details.less';
import { map } from 'lodash';

interface IAttributeSelectList {
  general: IAttributeListResponse[];
  feature: IAttributeListResponse[];
  specification: IAttributeListResponse[];
}

const LIST_TAB = [
  { tab: 'GENERAL', key: 'general' },
  { tab: 'FEATURE', key: 'feature' },
  { tab: 'SPECIFICATION', key: 'specification' },
  { tab: 'VENDOR', key: 'vendor' },
];

const ATTRIBUTE_TYPE = {
  general: 1,
  feature: 2,
  specification: 3,
};
const ProductConfigurationCreate: React.FC = () => {
  const [activeKey, setActiveKey] = useState('general');
  const [attribute, setAttribute] = useState<IAttributeSelectList>({
    general: [],
    feature: [],
    specification: [],
  });

  const loadAttributes = async () => {
    /// load all 3 type of attribute
    const finalData = await Promise.all(
      map(ATTRIBUTE_TYPE, async (type, key) => {
        return getProductAttributeByType(type).then((response) => {
          return {
            key: key,
            data: response,
          };
        });
      }),
    );

    /// re-format to match with attribute state
    setAttribute(
      finalData.reduce((finalItem, newItem) => {
        finalItem[newItem.key] = newItem.data;
        return finalItem;
      }, {} as IAttributeSelectList),
    );
  };

  useEffect(() => {
    loadAttributes();
  }, []);

  console.log('attribute', attribute);

  return (
    <div className={styles.productTabContainer}>
      <CustomTabs
        listTab={LIST_TAB}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        onChange={setActiveKey}
        activeKey={activeKey}
      />
      <div className={styles.addAttributeBtn}>
        <MainTitle level={4} customClass="add-attribute-text">
          Add Attribute
        </MainTitle>
        <CustomPlusButton size={18} />
      </div>
      <AttributeItem />
    </div>
  );
};

export default ProductConfigurationCreate;
