import type { FC } from 'react';

import { Tooltip } from 'antd';

import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';

import type { RadioValue } from '@/components/CustomRadio/types';
import {
  ProductAttributeFormInput,
  ProductAttributeProps,
  SpecificationAttributeBasisOptionProps,
} from '@/features/product/types';
import type { SpecificationAttributeGroup } from '@/features/project/types';

import CustomCollapse from '@/components/Collapse';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomRadio } from '@/components/CustomRadio';
import { Title } from '@/components/Typography';
import {
  AttributeOption,
  ConversionText,
  GeneralText,
  ProductAttributeLine,
} from '@/features/product/components/ProductAttributeComponent/AttributeComponent';

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
  specification_attribute_groups = [],
  is_refer_document = false,
  specifyingGroups,
}) => {
  const onCheckReferDocument = () => {
    onChangeReferToDocument(true);
    onChangeSpecification([]);
  };

  const onCheckedSpecification = (index: number, checked?: boolean) => {
    onChangeReferToDocument(false);
    const newState = specification_attribute_groups;
    specification_attribute_groups[index].isChecked =
      checked === undefined ? !specification_attribute_groups[index].isChecked : checked;
    onChangeSpecification(newState);
  };

  const onSelectSpecificationOption = (
    groupIndex: number,
    attributeId: string,
    optionId?: string,
  ) => {
    const newState = specification_attribute_groups;
    const attributeIndex = newState[groupIndex].attributes.findIndex((el) => el.id === attributeId);

    if (!optionId) {
      // Uncheck
      newState[groupIndex].attributes.splice(attributeIndex, 1);
    } else if (attributeIndex === -1) {
      // push new one
      newState[groupIndex].attributes.push({
        basis_option_id: optionId,
        id: attributeId,
      });
      onCheckedSpecification(groupIndex, true);
    } else {
      // update existed one
      newState[groupIndex].attributes[attributeIndex] = {
        basis_option_id: optionId,
        id: attributeId,
      };
    }
    onChangeSpecification(newState);
  };

  const ReferToDesignRadio: RadioValue = {
    value: true,
    label: <ReferToDesignLabel />,
  };

  const renderProductAttributeContent = (
    group: ProductAttributeFormInput,
    groupIndex: number,
    attribute: ProductAttributeProps,
    chosenOption?: SpecificationAttributeBasisOptionProps,
  ) => {
    if (attribute.conversion) {
      return (
        <ConversionText
          conversion={attribute.conversion}
          firstValue={attribute.conversion_value_1}
          secondValue={attribute.conversion_value_2}
        />
      );
    }
    if (attribute.type === 'Options') {
      return (
        <AttributeOption
          title={group.name}
          attributeName={attribute.name}
          options={attribute.basis_options ?? []}
          chosenOption={
            chosenOption
              ? {
                  label: `${chosenOption.value_1} ${chosenOption.unit_1} - ${chosenOption.value_2} ${chosenOption.unit_2}`,
                  value: chosenOption?.id,
                }
              : undefined
          }
          setChosenOptions={(option) => {
            onSelectSpecificationOption(
              groupIndex,
              attribute.id,
              option?.value?.toString() || undefined,
            );
          }}
          clearOnClose
        />
      );
    }
    return <GeneralText text={attribute.text} />;
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

      <div>
        {specifyingGroups.map((group, groupIndex) => (
          <CustomCollapse
            key={groupIndex}
            // defaultActiveKey={['1']}
            className={styles.specificationItem}
            noBorder
            header={
              <div className={styles.specificationHeaderItem}>
                <CustomCheckbox
                  options={[{ label: group.name, value: groupIndex }]}
                  selected={
                    specification_attribute_groups.some((gr) => gr.isChecked && gr.id === group.id)
                      ? [{ label: group.name, value: groupIndex }]
                      : []
                  }
                  onChange={() => onCheckedSpecification(groupIndex)}
                />
              </div>
            }>
            {group.attributes.map((attribute, attributeIndex) => {
              const curAttribute = specification_attribute_groups[groupIndex]?.attributes?.find(
                (el) => el.id === attribute.id,
              );

              const chosenOption = curAttribute
                ? attribute.basis_options?.find((el) => el.id === curAttribute.basis_option_id)
                : undefined;

              return (
                <div className={styles.attributeOptionWrapper} key={attributeIndex}>
                  <ProductAttributeLine name={attribute.name} />
                  {renderProductAttributeContent(group, groupIndex, attribute, chosenOption)}
                </div>
              );
            })}
          </CustomCollapse>
        ))}
      </div>
    </div>
  );
};
export default SpecificationTab;
