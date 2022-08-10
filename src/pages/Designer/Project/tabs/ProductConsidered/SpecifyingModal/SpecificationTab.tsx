import { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { Title, RobotoBodyText } from '@/components/Typography';
import CustomCollapse from '@/components/Collapse';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { getProductByIdAndReturn } from '@/features/product/services';
import { ProductItem } from '@/features/product/types';
import type { RadioValue } from '@/components/CustomRadio/types';
// import type { CheckboxValue } from '@/components/CustomCheckbox/types';
import {
  AttributeOption,
  ProductAttributeLine,
} from '@/features/product/components/ProductAttributeComponent/AttributeComponent';
import { isEmpty } from 'lodash';
import type { FC } from 'react';
import type { SpecificationBodyRequest, SpecificationAttributeGroup } from '@/types';

import styles from './styles/specification-tab.less';

interface SpecificationTabProps {}
interface SpecificationHeaderProps {
  onCheckedSpecification: (attributeId: string, isChecked: boolean, index: number) => void;
  attributeId: string;
  index: number;
  label: string;
  specifiyData?: SpecificationAttributeGroup;
}

const ReferToDesignLabel = () => {
  const TooltipText = () => {
    return (
      <RobotoBodyText level={6} customClass={styles.referTooltipText}>
        Select this option if you can not find the listed options or the variants are different from
        your design specification.
      </RobotoBodyText>
    );
  };

  return (
    <Title level={9} customClass={styles.referText}>
      <span>Refer to Design Document</span>
      <Tooltip placement="bottom" title={<TooltipText />} overlayClassName={styles.referTooltip}>
        <WarningIcon />
      </Tooltip>
    </Title>
  );
};

const SpecificationHeader: FC<SpecificationHeaderProps> = (props) => {
  const { onCheckedSpecification, attributeId, index, label, specifiyData } = props;
  return (
    <div className={styles.specificationHeaderItem}>
      <CustomCheckbox
        options={[{ label, value: index }]}
        selected={specifiyData?.isChecked ? [{ label, value: index }] : []}
        onChange={(checkValue) => onCheckedSpecification(attributeId, !isEmpty(checkValue), index)}
      />
    </div>
  );
};

const SpecificationTab: FC<SpecificationTabProps> = () => {
  const [product, setProduct] = useState<ProductItem>();
  const [specifiyData, setSpecifyData] = useState<SpecificationBodyRequest>({
    is_refer_document: false,
    specification_attribute_groups: [],
  });

  const onChangeReferDocument = () => {
    setSpecifyData({
      is_refer_document: true,
      specification_attribute_groups: [],
    });
  };

  const onCheckedSpecification = (attributeId: string, isChecked: boolean, index: number) => {
    const newSpecificationAttributes = [...specifiyData.specification_attribute_groups];

    let indexOfAttribute = newSpecificationAttributes.findIndex((attr) => attr.id === attributeId);
    if (indexOfAttribute === -1) {
      indexOfAttribute = index;
    }

    newSpecificationAttributes[indexOfAttribute] = {
      id: attributeId,
      isChecked,
      attribute: newSpecificationAttributes[indexOfAttribute]
        ? newSpecificationAttributes[indexOfAttribute].attribute
        : [],
    };
    setSpecifyData({
      is_refer_document: false,
      specification_attribute_groups: newSpecificationAttributes,
    });
  };

  // const onSelectSpecificationOption = (
  //   _groupIndex: number,
  //   _id: string,
  //   _basis_option_id: string,
  // ) => {
  //   // const newSpecificationAttributes = [...specifiyData.specification_attribute_groups];
  //   //
  //   // newSpecificationAttributes[indexOfAttribute] = {
  //   //   id: attributeId,
  //   //   isChecked,
  //   //   attribute: newSpecificationAttributes[indexOfAttribute] ? newSpecificationAttributes[indexOfAttribute].attribute : [],
  //   // }
  // }

  console.log('specifiyData', specifiyData);
  console.log('product', product);

  useEffect(() => {
    getProductByIdAndReturn('c0a418b9-2476-4c05-a2e3-c31e31cc0843').then((res) => {
      if (res) {
        setProduct(res);
      }
    });
  }, []);

  const ReferToDesignRadio: RadioValue = {
    value: true,
    label: <ReferToDesignLabel />,
  };
  return (
    <div className={styles.specificationTab}>
      <CustomRadio
        options={[ReferToDesignRadio]}
        isRadioList
        value={specifiyData.is_refer_document}
        onChange={() => onChangeReferDocument()}
      />
      <div>
        {product?.specification_attribute_groups.map((group, index) => (
          <CustomCollapse
            key={index}
            defaultActiveKey={['1']}
            className={styles.specificationItem}
            header={
              <SpecificationHeader
                onCheckedSpecification={onCheckedSpecification}
                attributeId={group.id ?? ''}
                index={index}
                label={group.name}
                specifiyData={specifiyData[index]}
              />
            }
          >
            {group.attributes.map((attribute, attributeKey) => (
              <div className={styles.attributeOptionWrapper} key={attributeKey}>
                <ProductAttributeLine name={attribute.name} />
                <AttributeOption
                  title={group.name}
                  attributeName={attribute.name}
                  options={attribute.basis_options ?? []}
                  // chosenOption={{
                  //   label: '',
                  //   value: specifiyData.specification_attribute_groups[index]?.attribute[0]?.basis_option_id,
                  // }}
                  // setChosenOptions={(selectedValue) => onSelectSpecificationOption(
                  //   index,
                  //   attribute.id,
                  //   selectedValue.value as string,
                  // )}
                />
              </div>
            ))}
          </CustomCollapse>
        ))}
      </div>
    </div>
  );
};
export default SpecificationTab;
