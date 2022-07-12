import React, { useState, useEffect } from 'react';
// import { MainTitle } from '@/components/Typography';
import GeneralFeatureAttribute from './GeneralFeatureAttribute';
import SpecificationAttribute from './SpecificationAttribute';
import { CustomTabs } from '@/components/Tabs';
// import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { getAllAttribute } from '@/services';
import { IAttributebyType } from '@/types';
import styles from '../styles/details.less';
import { LIST_TAB } from '../constants';
import type { ACTIVE_KEY } from '../types';
// import {showImageUrl} from '@/helper/utils';
// import { useDispatch } from 'react-redux';
// import { useAppSelector } from '@/reducers';
// import {
//   setPartialProductDetail,
// } from '@/reducers/product';

const ProductAttribute: React.FC = () => {
  const [activeKey, setActiveKey] = useState<ACTIVE_KEY>('specification');
  const [attribute, setAttribute] = useState<IAttributebyType>({
    general: [],
    feature: [],
    specification: [],
  });

  useEffect(() => {
    getAllAttribute().then(setAttribute);
  }, []);

  return (
    <div className={styles.productTabContainer}>
      <CustomTabs
        listTab={LIST_TAB}
        centered={true}
        tabPosition="top"
        tabDisplay="space"
        onChange={(key) => setActiveKey(key as ACTIVE_KEY)}
        activeKey={activeKey}
      />
      {activeKey !== 'vendor' && activeKey !== 'specification' ? (
        <GeneralFeatureAttribute attributes={attribute[activeKey]} activeKey={activeKey} />
      ) : activeKey === 'specification' ? (
        <SpecificationAttribute attributes={attribute.specification} />
      ) : null}
    </div>
  );
};

export default ProductAttribute;
