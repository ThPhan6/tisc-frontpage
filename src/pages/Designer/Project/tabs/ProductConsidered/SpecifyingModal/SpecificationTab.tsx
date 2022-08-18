import { Tooltip } from 'antd';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { Title } from '@/components/Typography';
import CustomCollapse from '@/components/Collapse';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { ProductAttributeFormInput } from '@/features/product/types';
import type { RadioValue } from '@/components/CustomRadio/types';
import {
  AttributeOption,
  ProductAttributeLine,
} from '@/features/product/components/ProductAttributeComponent/AttributeComponent';
import type { FC } from 'react';
import type { SpecificationAttributeGroup } from '@/features/project/types';

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
  // console.log('specification_attribute_groups', specification_attribute_groups);
  // console.log('specifyingGroups', specifyingGroups);

  const onCheckReferDocument = () => {
    onChangeReferToDocument(true);
    onChangeSpecification([]);
  };

  const onCheckedSpecification = (index: number) => {
    onChangeReferToDocument(false);
    const newState = specification_attribute_groups;
    specification_attribute_groups[index].isChecked =
      !specification_attribute_groups[index].isChecked;
    onChangeSpecification(newState);
  };

  const onSelectSpecificationOption = (
    groupIndex: number,
    attributeIndex: number,
    attributeId: string,
    optionId?: string,
  ) => {
    const newState = specification_attribute_groups;
    console.log('newState', newState);
    if (!optionId) {
      // Uncheck
      newState[groupIndex].attributes.splice(attributeIndex, 1);
    } else {
      console.log('newState[groupIndex]', newState[groupIndex]);
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
        {specifyingGroups.map((group, index) => (
          <CustomCollapse
            key={index}
            defaultActiveKey={['1']}
            className={styles.specificationItem}
            header={
              <div className={styles.specificationHeaderItem}>
                <CustomCheckbox
                  options={[{ label: group.name, value: index }]}
                  selected={
                    specification_attribute_groups.some((gr) => gr.isChecked && gr.id === group.id)
                      ? [{ label: group.name, value: index }]
                      : []
                  }
                  onChange={() => onCheckedSpecification(index)}
                />
              </div>
            }
          >
            {group.attributes.map((attribute, attributeIndex) => {
              const basisOptions = specifyingGroups[index].attributes[attributeIndex].basis_options;
              const chosenOption = basisOptions?.find((el) =>
                specification_attribute_groups
                  .find((gr) => gr.id === group.id)
                  ?.attributes?.some((attr) => attr.basis_option_id === el.id),
              );

              return (
                <div className={styles.attributeOptionWrapper} key={attributeIndex}>
                  <ProductAttributeLine name={attribute.name} />
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
                        index,
                        attributeIndex,
                        attribute.id,
                        option?.value?.toString() || undefined,
                      );
                    }}
                    clearOnClose
                  />
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
