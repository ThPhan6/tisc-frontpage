import { FC, useEffect } from 'react';

import { Tooltip } from 'antd';

import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import { getProductById } from '@/features/product/services';

import type { RadioValue } from '@/components/CustomRadio/types';
import { onCheckReferToDesignDocument } from '@/features/product/reducers';
import store, { useAppSelector } from '@/reducers';

import { CustomRadio } from '@/components/CustomRadio';
import { Title } from '@/components/Typography';
import { ProductAttributeContainer } from '@/features/product/components/ProductAttributes/ProductAttributeContainer';

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
        }}>
        <WarningIcon />
      </Tooltip>
    </Title>
  );
};

const SpecificationTab: FC<{ productId: string }> = ({ productId }) => {
  const referToDesignDocument = useAppSelector(
    (state) => state.product.details.referToDesignDocument,
  );

  const checkReferToDesignDocument = () => {
    store.dispatch(onCheckReferToDesignDocument());
  };

  const ReferToDesignRadio: RadioValue = {
    value: true,
    label: <ReferToDesignLabel />,
  };

  useEffect(() => {
    if (productId) {
      // This is where we set specification_attribute_groups data
      getProductById(productId);
    }
  }, [productId]);

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

      <ProductAttributeContainer
        activeKey="specification"
        specifying
        noBorder
        productId={productId}
        isSpecifiedModal
      />
    </div>
  );
};
export default SpecificationTab;
