import { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { Title, RobotoBodyText } from '@/components/Typography';
import CustomCollapse from '@/components/Collapse';
import { ReactComponent as WarningIcon } from '@/assets/icons/warning-circle-icon.svg';
import { getProductByIdAndReturn } from '@/features/product/services';
import { ProductAttributeFormInput } from '@/features/product/types';
import type { RadioValue } from '@/components/CustomRadio/types';
import {
  AttributeOption,
  ProductAttributeLine,
} from '@/features/product/components/ProductAttributeComponent/AttributeComponent';
import type { FC } from 'react';
import type { SpecificationAttributeGroup, SelectedSpecAttributte } from '@/types';

import styles from './styles/specification-tab.less';
import { OnChangeSpecifyingProductFnc } from './types';

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

interface SpecificationTabProps {
  productId: string;
  onChangeSpecifyingState: OnChangeSpecifyingProductFnc;
  onChangeSpecification: (specification_attribute_groups: SpecificationAttributeGroup[]) => void;
  onChangeReferToDocument: (isRefer: boolean) => void;
  // specification_attribute_groups: SpecificationAttributeGroup[];
  is_refer_document: boolean;
}

const SpecificationTab: FC<SpecificationTabProps> = ({
  onChangeReferToDocument,
  onChangeSpecification,
  is_refer_document,
}) => {
  const [specifyingGroups, setSpecifyingGroups] = useState<ProductAttributeFormInput[]>([]);

  const resetAllSpecificationChecked = () => {
    setSpecifyingGroups((prevState) =>
      prevState.map((group) => ({
        ...group,
        isChecked: false,
        attributes: group.attributes.map((attr) => ({
          ...attr,
          basis_options: attr.basis_options?.map((basisOpt) => ({
            ...basisOpt,
            isChecked: false,
          })),
        })),
      })),
    );
  };

  const onCheckReferDocument = () => {
    onChangeReferToDocument(true);
    onChangeSpecification([]);
    resetAllSpecificationChecked();
  };

  const getSelectedSpecification = (specGroups: ProductAttributeFormInput[]) => {
    const selectedSpecs: SpecificationAttributeGroup[] = [];

    specGroups.forEach((specGroup) => {
      if (!specGroup.isChecked) {
        return;
      }
      const selectedAttributes: SelectedSpecAttributte[] = [];
      specGroup.attributes.forEach((attr) => {
        attr.basis_options?.forEach((basisOption) => {
          if (basisOption.isChecked) {
            selectedAttributes.push({
              id: attr.id,
              basis_option_id: basisOption.id,
            });
          }
        });
      });

      const selectedSpec: SpecificationAttributeGroup = {
        id: specGroup.id || '',
        attribute: selectedAttributes,
      };
      selectedSpecs.push(selectedSpec);
    });

    return selectedSpecs;
  };

  const onCheckedSpecification = (index: number) => {
    onChangeReferToDocument(false);

    setSpecifyingGroups((prevState) => {
      const newChecked = !prevState[index].isChecked;
      const newState = [...prevState];
      newState[index].isChecked = newChecked;

      onChangeSpecification(getSelectedSpecification(newState));
      return newState;
    });
  };

  const onSelectSpecificationOption = (
    groupIndex: number,
    attributeIndex: number,
    optionId: string,
  ) => {
    setSpecifyingGroups((prevState) => {
      const basisOptions = prevState[groupIndex].attributes[attributeIndex].basis_options;
      if (!basisOptions) {
        return prevState;
      }

      const optionIndex = basisOptions.findIndex((el) => el.id === optionId);

      if (optionIndex !== -1) {
        const newChecked = !basisOptions[optionIndex].isChecked;
        const newState = [...prevState];

        newState[groupIndex].attributes[attributeIndex].basis_options[optionIndex].isChecked =
          newChecked;

        onChangeSpecification(getSelectedSpecification(newState));
        return newState;
      }
      return prevState;
    });
  };

  useEffect(() => {
    getProductByIdAndReturn('c0a418b9-2476-4c05-a2e3-c31e31cc0843').then((res) => {
      console.log('res', res);
      if (res) {
        setSpecifyingGroups(res.specification_attribute_groups);
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
        value={is_refer_document}
        onChange={() => onCheckReferDocument()}
        containerStyle={{ boxShadow: 'inset 0 -.7px 0 #000' }}
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
                    specifyingGroups[index]?.isChecked ? [{ label: group.name, value: index }] : []
                  }
                  onChange={() => onCheckedSpecification(index)}
                />
              </div>
            }
          >
            {group.attributes.map((attribute, attributeIndex) => {
              const basisOptions = specifyingGroups[index].attributes[attributeIndex].basis_options;
              const chosenOption = basisOptions?.find((el) => el.isChecked);

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
                            label: `${chosenOption.value_1} ${chosenOption.unit_1} - ${chosenOption.value_1} ${chosenOption.unit_1}`,
                            value: chosenOption?.id,
                          }
                        : undefined
                    }
                    setChosenOptions={(option) =>
                      onSelectSpecificationOption(index, attributeIndex, String(option.value))
                    }
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
