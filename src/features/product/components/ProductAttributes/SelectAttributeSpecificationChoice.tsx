import { FC } from 'react';

import { ReactComponent as ActionDownIcon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as ActionUpIcon } from '@/assets/icons/action-up-icon.svg';

import { useProductAttributeForm } from './hooks';
import { useCheckPermission } from '@/helper/hook';

import { AttributeSelectedProps, ProductAttributeFormInput } from '../../types';
import { ProductInfoTab } from './types';

import CustomCollapse from '@/components/Collapse';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import styles from './SelectAttributeSpecificationChoice.less';

interface SelectAttributeSpecificationChoiceProps {
  activeKey: ProductInfoTab;
  productId: string;
  attributeGroup: ProductAttributeFormInput[];
  groupIndex: number;
  isSpecifiedModal: boolean;
  curAttributeSelect: AttributeSelectedProps;
  setCurAttributeSelect: (curAttributeSelect: AttributeSelectedProps) => void;
  collapsible: boolean;
  setCollapsible: (collapsible: boolean) => void;
}

export const SelectAttributeSpecificationChoice: FC<SelectAttributeSpecificationChoiceProps> = ({
  activeKey,
  productId,
  attributeGroup,
  groupIndex,
  isSpecifiedModal,
  curAttributeSelect,
  setCurAttributeSelect,
  collapsible,
  setCollapsible,
}) => {
  const isTiscAdmin = useCheckPermission('TISC Admin');

  const attrGroupItem = attributeGroup[groupIndex];

  const { onSelectSpecificationOption } = useProductAttributeForm(activeKey, productId, {
    isSpecifiedModal: isSpecifiedModal,
  });

  if (isTiscAdmin || activeKey !== 'specification' || !attrGroupItem.selection) {
    return null;
  }

  return (
    <CustomCollapse
      noBorder
      className={styles.noBoxShadow}
      expandIcon={({ isActive }) => (isActive ? <ActionUpIcon /> : <ActionDownIcon />)}
      activeKey={collapsible ? ['1'] || '1' : undefined}
      header={
        <div className="specification-choice" onClick={() => setCollapsible(!collapsible)}>
          <BodyText level={4}>Choose Specification</BodyText>
          <RobotoBodyText
            level={6}
            color={curAttributeSelect.attribute?.id ? 'primary-color-dark' : 'mono-color-medium'}
            customClass={`${isSpecifiedModal ? 'header-label' : 'label-space'}`}>
            {curAttributeSelect.attribute?.name || 'select'}
          </RobotoBodyText>
        </div>
      }>
      {attrGroupItem.attributes.map((attribute) => {
        if (attribute.type === 'Options') {
          return (
            <div className="specification-choice">
              <p></p>
              <RobotoBodyText
                level={6}
                customClass={`cursor-pointer attribute-label ${
                  isSpecifiedModal ? 'left-none' : 'left-space'
                }`}
                onClick={() => {
                  if (attrGroupItem.id && attrGroupItem.attributes.length) {
                    const newSelectAttribute: AttributeSelectedProps = {
                      groupId: attrGroupItem.id,
                      attribute: {
                        id: attribute.id,
                        name: attribute.name,
                      },
                    };
                    setCurAttributeSelect(newSelectAttribute);

                    const haveBasisOption = attribute.basis_options?.length
                      ? attribute.basis_options.find((option) => option.isChecked)
                      : undefined;

                    onSelectSpecificationOption(
                      groupIndex,
                      attribute.id,
                      isTiscAdmin ? false : true,
                      haveBasisOption?.id,
                      false, // dont reset attribute selected
                    );
                  }
                }}>
                {attribute.name}
              </RobotoBodyText>
            </div>
          );
        }
      })}
    </CustomCollapse>
  );
};
