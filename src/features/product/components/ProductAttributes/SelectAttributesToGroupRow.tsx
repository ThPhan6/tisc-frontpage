import { FC, memo, useEffect, useState } from 'react';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { checkedOptionType, useProductAttributeForm } from './hooks';
import { useBoolean } from '@/helper/hook';
import { cloneDeep, upperCase } from 'lodash';

import { setPartialProductDetail, setStep } from '../../reducers';
import { ProductAttributeFormInput, ProductAttributeProps, SpecificationType } from '../../types';
import { ProductInfoTab } from './types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import store from '@/reducers';
import { ProductAttributes, ProductSubAttributes } from '@/types';

import Popover from '@/components/Modal/Popover';
import { BodyText, MainTitle } from '@/components/Typography';

import { AutoStep } from '../AutoStep/AutoStep';
import styles from './SelectAttributesToGroupRow.less';
import { SpecificationChoice } from './SpecificationChoice';

const POPOVER_TITLE = {
  general: 'Select General Attributes',
  feature: 'Select Feature Attributes',
  specification: 'Select Specification',
};

interface Props {
  activeKey: ProductInfoTab;
  groupItem: ProductAttributeFormInput;
  groupIndex: number;
  attributes: ProductAttributes[];
  productId: string;
}

export const SelectAttributesToGroupRow: FC<Props> = memo(
  ({ activeKey, groupItem, attributes, groupIndex, productId }) => {
    const [visible, setVisible] = useState(false);

    // attributes
    const [selected, setSelected] = useState<CheckboxValue[]>([]);

    /// specification as a choice
    const isOptionType = checkedOptionType(groupItem.attributes);
    const checked = useBoolean(false);

    /// get checked from current option select
    useEffect(() => {
      checked.setValue(isOptionType);
    }, [isOptionType]);

    /// get checked from data on first loading
    useEffect(() => {
      checked.setValue(groupItem.selection);
    }, []);

    useEffect(() => {
      /// set attribute selected
      setSelected(
        groupItem.attributes.map((attr) => {
          return {
            label: '',
            value: attr.id,
          };
        }),
      );
    }, [groupItem]);

    const { onDeleteProductAttribute, attributeGroupKey, attributeGroup } = useProductAttributeForm(
      activeKey,
      productId,
    );

    const onSelectValue = (value: CheckboxValue[]) => {
      setSelected(value);
      if (!selected) {
        return;
      }

      const newAttrGroup = cloneDeep(attributeGroup);

      const selectedAttrIds = value.map((v) => v.value);
      newAttrGroup[groupIndex].attributes = newAttrGroup[groupIndex].attributes.filter((attr) =>
        selectedAttrIds.includes(attr.id),
      );

      if (value.length > newAttrGroup[groupIndex].attributes.length) {
        newAttrGroup[groupIndex].attributes = value.map((item, key: number) => {
          /// radio value
          let selectedAttribute: ProductSubAttributes | undefined;
          attributes.forEach((attr) => {
            attr.subs.forEach((sub) => {
              if (sub.id === item.value) {
                selectedAttribute = sub;
              }
            });
          });

          const previousData = newAttrGroup[groupIndex].attributes[key];

          const activeData: any = {
            text: '',
            conversion_value_1: '',
            conversion_value_2: '',
          };

          if (previousData && previousData.id === selectedAttribute?.id) {
            activeData.text = previousData.text;
            activeData.conversion_value_1 = previousData.conversion_value_1;
            activeData.conversion_value_2 = previousData.conversion_value_2;
            activeData.basis_options = previousData.basis_options;
          }

          const newAttribute: ProductAttributeProps = {
            id: selectedAttribute?.id || '',
            basis_id: selectedAttribute?.basis_id || '',
            basis_value_id: '',
            type: selectedAttribute?.basis?.type ?? 'Text',
            ...activeData,
          };

          return newAttribute;
        });
      }

      /// set selection for each group attribute has attribute option type
      const isNewAttributeHasOptionType = checkedOptionType(newAttrGroup[groupIndex].attributes);

      checked.setValue(isNewAttributeHasOptionType);

      newAttrGroup[groupIndex] = {
        ...newAttrGroup[groupIndex],
        selection: isNewAttributeHasOptionType,
      };

      /// to rearrange attribute has type option to top
      newAttrGroup.forEach((group) => {
        group.attributes.forEach((attribute, index) => {
          if (attribute.type === 'Options') {
            group.attributes.unshift(group.attributes.splice(index, 1)[0]);
          }
        });
      });

      store.dispatch(
        setPartialProductDetail({
          [attributeGroupKey]: newAttrGroup,
        }),
      );
    };

    const renderCheckBoxLabel = (item: ProductSubAttributes) => {
      const { basis } = item;
      ///
      let description = '';
      /// must found basis
      if (basis && basis.id) {
        description = basis.name;
        if (!description) {
          /// only conversion don't have name
          description = `${basis.name_1} - ${basis.name_2}`;
        }
        if (basis.type !== 'Conversions' && basis.type !== 'Text') {
          /// count subs
          description += ` (${basis.subs?.length ?? 0})`;
        }
      }

      return (
        <div className={styles.attributeItemCheckBox}>
          <BodyText level={3} customClass="attribute-name">
            {item.name}
          </BodyText>
          <BodyText level={5} fontFamily="Roboto" customClass="attribute-description">
            {description}
          </BodyText>
        </div>
      );
    };

    return (
      <>
        <div className="attribute-select-group">
          <div className="attribute-select-group-left">
            <div
              className="flex-start"
              onClick={() => {
                setVisible(true);

                if (groupItem.type === SpecificationType.autoStep) {
                  store.dispatch(setStep('pre'));
                }
              }}
            >
              <MainTitle level={4}>{POPOVER_TITLE[activeKey]}</MainTitle>
              <SingleRightIcon className="single-right-icon" />
            </div>

            <SpecificationChoice
              data={groupItem.attributes}
              switchChecked={checked.value}
              onClick={(toggle) => {
                checked.setValue(toggle);
                const newAttrGroup = [...attributeGroup];
                newAttrGroup[groupIndex] = {
                  ...newAttrGroup[groupIndex],
                  selection: toggle,
                };

                store.dispatch(
                  setPartialProductDetail({
                    specification_attribute_groups: newAttrGroup,
                  }),
                );
              }}
            />
          </div>

          <DeleteIcon className="delete-icon" onClick={onDeleteProductAttribute(groupIndex)} />
        </div>

        {groupItem.type === SpecificationType.autoStep ? (
          <AutoStep
            attributeGroup={attributeGroup}
            attributes={attributes}
            visible={visible}
            setVisible={setVisible}
          />
        ) : (
          <Popover
            title={upperCase(POPOVER_TITLE[activeKey])}
            visible={visible}
            setVisible={setVisible}
            dropdownCheckboxList={attributes.map((item) => ({
              name: item.name,
              options: item.subs.map((sub) => ({
                label: renderCheckBoxLabel(sub),
                value: sub.id,
              })),
            }))}
            dropdownCheckboxTitle={(data) => data.name}
            chosenValue={selected}
            setChosenValue={onSelectValue}
            secondaryModal
          />
        )}
      </>
    );
  },
);
