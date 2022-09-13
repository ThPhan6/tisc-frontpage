import type { FC } from 'react';

import { Tooltip } from 'antd';

import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import type { RadioValue } from '@/components/CustomRadio/types';
import { ProductAttributeFormInput } from '@/features/product/types';
import type { SpecificationAttributeGroup } from '@/features/project/types';

import { CustomRadio } from '@/components/CustomRadio';
import { Title } from '@/components/Typography';
import { ProductAttributeContainer } from '@/features/product/components/ProductAttributes';

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

interface SpecificationTabProps {
  onChangeSpecification: (specification_attribute_groups: SpecificationAttributeGroup[]) => void;
  onChangeReferToDocument: (isRefer: boolean) => void;
  specification_attribute_groups: SpecificationAttributeGroup[];
  is_refer_document: boolean;
  specifyingGroups: ProductAttributeFormInput[];
}

const SpecificationTab: FC<SpecificationTabProps> = ({
  onChangeReferToDocument,
  onChangeSpecification,
  is_refer_document = false,
}) => {
  const onCheckReferDocument = () => {
    onChangeReferToDocument(true);
    onChangeSpecification([]);
  };

  const ReferToDesignRadio: RadioValue = {
    value: true,
    label: <ReferToDesignLabel />,
  };

  return (
    <div className={styles.specificationTab}>
      <CustomRadio
        options={[ReferToDesignRadio]}
        isRadioList
        value={is_refer_document}
        onChange={onCheckReferDocument}
        containerStyle={{ boxShadow: 'inset 0 -.7px 0 #000' }}
        noPaddingLeft
      />

      <ProductAttributeContainer activeKey="specification" specifying noBorder />
    </div>
  );
};
export default SpecificationTab;
