import { FC, memo, useState } from 'react';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { useProductAttributeForm } from './hooks';
import { upperCase } from 'lodash';

import { setPartialProductDetail } from '../../reducers';
import { ProductAttributeFormInput, ProductAttributeProps } from '../../types';
import { ProductInfoTab } from '../ProductAttributeComponent/types';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import store from '@/reducers';
import { ProductAttributes, ProductSubAttributes } from '@/types';

import Popover from '@/components/Modal/Popover';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './SelectAttributesToGroupRow.less';

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
}

export const SelectAttributesToGroupRow: FC<Props> = memo(
  ({ activeKey, groupItem, attributes, groupIndex }) => {
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState<CheckboxValue[]>(
      groupItem.attributes.map((attr) => {
        return {
          label: '',
          value: attr.id,
        };
      }),
    );
    const { onDeleteProductAttribute, attributeGroupKey, attributeGroup } =
      useProductAttributeForm(activeKey);

    const onSelectValue = (value: CheckboxValue[]) => {
      setSelected(value);
      if (!selected) {
        return;
      }
      const newAttributes = [...attributeGroup];
      newAttributes[groupIndex] = {
        ...newAttributes[groupIndex],
        attributes: value.map((item, key: number) => {
          /// radio value
          let selectedAttribute: ProductSubAttributes | undefined;
          attributes.forEach((attr) => {
            attr.subs.forEach((sub) => {
              if (sub.id === item.value) {
                selectedAttribute = sub;
              }
            });
          });

          const previousData = newAttributes[groupIndex].attributes[key];

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
        }),
      };

      store.dispatch(
        setPartialProductDetail({
          [attributeGroupKey]: newAttributes,
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
          <div className="attribute-select-group-left" onClick={() => setVisible(true)}>
            <MainTitle level={4}>{POPOVER_TITLE[activeKey]}</MainTitle>
            <SingleRightIcon className="single-right-icon" />
          </div>
          <DeleteIcon className="delete-icon" onClick={onDeleteProductAttribute(groupIndex)} />
        </div>

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
        />
      </>
    );
  },
);
