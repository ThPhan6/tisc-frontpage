import { FC, useEffect } from 'react';

import { Tooltip } from 'antd';

import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { getProductById } from '@/features/product/services';
import { getOneCustomProduct } from '@/pages/Designer/Products/CustomLibrary/services';

import type { RadioValue } from '@/components/CustomRadio/types';
import { onCheckReferToDesignDocument } from '@/features/product/reducers';
import store from '@/reducers';

import { CustomRadio } from '@/components/CustomRadio';
import { Title } from '@/components/Typography';
import { ProductAttributeContainer } from '@/features/product/components/ProductAttributes/ProductAttributeContainer';
import { SpecificationTab } from '@/pages/Designer/Products/CustomLibrary/components/SpecificationTab';
import { onCheckCustomProductReferToDocument } from '@/pages/Designer/Products/CustomLibrary/slice';

import styles from './styles/specification-tab.less';

const ReferToDesignLabel = () => {
  return (
    <Title level={9} customClass={styles.referText}>
      <span>Refer to Design Document</span>
      <Tooltip
        placement="bottom"
        title={
          'Select this option if you cannot find the listed options or the variants are different from your design specification.'
        }
        overlayInnerStyle={{
          width: 197,
        }}
      >
        <WarningIcon />
      </Tooltip>
    </Title>
  );
};

const SpecifiedSpecificationTab: FC<{
  productId: string;
  referToDesignDocument: boolean;
  customProduct?: boolean;
  isSpecified?: boolean;
}> = ({ productId, customProduct, referToDesignDocument, isSpecified }) => {
  const checkReferToDesignDocument = () => {
    if (customProduct) {
      store.dispatch(onCheckCustomProductReferToDocument());
    } else {
      store.dispatch(onCheckReferToDesignDocument());
    }
  };

  const ReferToDesignRadio: RadioValue = {
    value: true,
    label: <ReferToDesignLabel />,
  };

  useEffect(() => {
    if (productId) {
      // This is where we set specification_attribute_groups data
      if (customProduct) {
        getOneCustomProduct(productId);
      } else {
        getProductById(productId, { isSpecified });
      }
    }
  }, [productId, customProduct]);

  return (
    <div className={styles.specificationTab}>
      <CustomRadio
        options={[ReferToDesignRadio]}
        isRadioList
        value={referToDesignDocument}
        onChange={checkReferToDesignDocument}
        containerStyle={{ boxShadow: 'inset 0 -.7px 0 #000' }}
        noPaddingLeft
      />

      {customProduct ? (
        <SpecificationTab productId={productId} activeKey="specification" viewOnly specifying />
      ) : (
        <ProductAttributeContainer
          activeKey="specification"
          // specifying
          noBorder
          productId={productId}
          isSpecifiedModal
          isSpecified={isSpecified}
        />
      )}
    </div>
  );
};
export default SpecifiedSpecificationTab;
