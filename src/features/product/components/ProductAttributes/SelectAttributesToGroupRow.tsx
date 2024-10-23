import { FC, memo, useContext, useEffect, useState } from 'react';

import { message } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { checkedOptionType, useProductAttributeForm } from './hooks';
import { useBoolean } from '@/helper/hook';
import { sortObjectArray } from '@/helper/utils';
import { capitalize, cloneDeep, flatMap, upperCase } from 'lodash';

import { setPartialProductDetail, setStep } from '../../reducers';
import { ProductAttributeFormInput, ProductAttributeProps, SpecificationType } from '../../types';
import { ProductInfoTab } from './types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import store from '@/reducers';
import { AttributesWithSubAddtionData, ProductAttributes, ProductSubAttributes } from '@/types';

import Popover from '@/components/Modal/Popover';
import { BodyText, MainTitle } from '@/components/Typography';
import { ProductAttributeComponentContext } from '@/features/product/components/ProductAttributes';

import { AutoStep } from '../AutoStep/AutoStep';
import styles from './SelectAttributesToGroupRow.less';
import { SpecificationChoice } from './SpecificationChoice';

const POPOVER_TITLE = {
  general: 'Select General Attributes',
  feature: 'Select Feature Attributes',
  specification: 'Select Specification',
};

interface SelectAttributesToGroupRowProps {
  activeKey: ProductInfoTab;
  groupItem: ProductAttributeFormInput;
  groupIndex: number;
  attributes: ProductAttributes[];
  productId: string;
}

export const SelectAttributesToGroupRow: FC<SelectAttributesToGroupRowProps> = memo(
  ({ activeKey, groupItem, attributes, groupIndex, productId }) => {
    const { attributeListFilterByBrand, setIsGetAllAttributeFilterByBrand } = useContext(
      ProductAttributeComponentContext,
    );

    const [visible, setVisible] = useState(false);

    // attributes
    const [selected, setSelected] = useState<CheckboxValue[]>([]);

    /// specification as a choice
    const isOptionType = checkedOptionType(groupItem.attributes);
    const checked = useBoolean(false);

    /// get checked from current option select
    useEffect(() => {
      // checked.setValue(isOptionType);
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
            name: attr.name,
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

      // Function to extract the selected attributes from the provided value.
      const selectedAttributes = value.flatMap((item) =>
        attributes.flatMap((attr) => attr.subs.filter((sub) => sub.id === item.value)),
      );

      // Create a Set to store the unique id_format_type values of the selected attributes.
      const idFormatTypes = new Set(
        selectedAttributes
          .map((attr) => attr.basis?.id_format_type)
          .filter((type) => type !== undefined && type !== null),
      );

      newAttrGroup[groupIndex].attributes = newAttrGroup[groupIndex].attributes.filter((attr) =>
        selectedAttrIds.includes(attr.id),
      );
      if (value.length != newAttrGroup[groupIndex].attributes.length) {
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

          // title auto fill from attribute sub group

          if (selectedAttribute && selectedAttribute?.id) {
            if (!selectedAttribute.sub_group_id) {
              newAttrGroup[groupIndex].name = 'Sub Group';
            } else {
              attributeListFilterByBrand[activeKey].forEach((itemSubs: any) => {
                const subGroupAttrWithName = itemSubs.subs.find(
                  (sub: any) => sub.id === selectedAttribute?.sub_group_id,
                );
                if (subGroupAttrWithName) {
                  newAttrGroup[groupIndex].name = (subGroupAttrWithName.name || '').replace(
                    /\w+/g,
                    capitalize,
                  );
                }
              });
            }
          }

          const newAttribute: ProductAttributeProps = {
            id: selectedAttribute?.id || '',
            basis_id: selectedAttribute?.basis_id || '',
            basis_value_id: '',
            type: selectedAttribute?.basis?.type ?? 'Text',
            name: item.name,
            ...activeData,
          };

          return newAttribute;
        });
      }
      // close modal
      setVisible(false);
      /// set selection for each group attribute has attribute option type

      newAttrGroup[groupIndex] = {
        ...newAttrGroup[groupIndex],
        selection: checked.value,
      };

      /// to rearrange attribute has type option to top
      // newAttrGroup.forEach((group) => {
      //   group.attributes.forEach((attribute, index) => {
      //     if (attribute.type === 'Options') {
      //       group.attributes.unshift(group.attributes.splice(index, 1)[0]);
      //     }
      //   });
      // });

      // to sort attribute by name
      newAttrGroup.forEach((group) => {
        group.attributes = sortObjectArray(group.attributes, 'name', 'asc');
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
      if (basis?.id) {
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
        <div className={`${styles.attributeItemCheckBox} hover-on-row`}>
          <BodyText level={3} customClass="attribute-name">
            {item.name}
          </BodyText>
          <BodyText level={5} fontFamily="Roboto" customClass="attribute-description">
            {description}
          </BodyText>
        </div>
      );
    };

    const handleOpenSelectAttributeModal = () => {
      setVisible(true);

      setIsGetAllAttributeFilterByBrand(true);

      if (groupItem.type === SpecificationType.autoStep) {
        store.dispatch(setStep('pre'));
      }
    };

    return (
      <>
        <div className="attribute-select-group">
          <div className="attribute-select-group-left">
            <div className="flex-start" onClick={handleOpenSelectAttributeModal}>
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
            dropdownCheckboxList={(
              attributeListFilterByBrand[activeKey] as AttributesWithSubAddtionData[]
            ).map((item) => ({
              name: item.name,
              count: item.subs.length,
              options: flatMap(
                item.subs.map((sub) =>
                  sub.subs.map((el) => ({
                    label: renderCheckBoxLabel(el),
                    value: el.id,
                    name: el.name,
                  })),
                ),
              ),
              subs: item.subs.map((el) => ({
                name: el.name,
                count: el.subs.length,
                options: el.subs.map((sub) => ({
                  label: renderCheckBoxLabel(sub),
                  value: sub.id,
                  name: sub.name,
                })),
              })),
            }))}
            dropdownCheckboxTitle={(data) => data.name}
            chosenValue={selected}
            onFormSubmit={onSelectValue}
            secondaryModal
            collapseLevel="2"
            width={1152}
          />
        )}
      </>
    );
  },
);
