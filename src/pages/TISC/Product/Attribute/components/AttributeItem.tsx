import type { FC } from 'react';

import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';
import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';

import { lowerCase } from 'lodash';

import type { AttributeSubForm } from '@/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from '../styles/attributeItem.less';

interface AttributeItemProps {
  item: AttributeSubForm;
  handleOnClickDelete: () => void;
  handleSelectContentType: () => void;
  onChangeItemName: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AttributeItem: FC<AttributeItemProps> = ({
  item,
  onChangeItemName,
  handleOnClickDelete,
  handleSelectContentType,
}) => {
  return (
    <div className={styles.attribute_container}>
      <div className={styles.form_input}>
        <MainTitle level={3}>Attribute Name :</MainTitle>
        <div className={styles.form_input__element}>
          <CustomInput
            placeholder="type attribute name"
            value={item.name}
            className="attribute-input"
            onChange={onChangeItemName}
          />
          <ActionDeleteIcon className={styles.delete_icon} onClick={handleOnClickDelete} />
        </div>
        <div
          className={`${styles.form_input__element} ${styles.form_input__cursor}`}
          onClick={handleSelectContentType}>
          <div className="group-content-type">
            <BodyText level={4}>Content Type :</BodyText>
            <BodyText level={5} fontFamily="Roboto" customClass="group-type-placeholder">
              {item.content_type ? (
                <span className="basis-conversion-group">{item.content_type}</span>
              ) : (
                'select from the list'
              )}
            </BodyText>
          </div>
          <SingleRightFormIcon />
        </div>
        <div className={styles.form_input__element}>
          <div className="group-content-type">
            <BodyText level={4}>Description :</BodyText>
            <BodyText level={5} fontFamily="Roboto" customClass="group-type-placeholder">
              {lowerCase(item.content_type!).indexOf('conversion') >= 0 ? (
                <span className="basis-conversion-group">
                  {item.description_1}
                  <SwapIcon />
                  {item.description_2}
                </span>
              ) : (
                <span className="basis-conversion-group">{item.description}</span>
              )}
            </BodyText>
          </div>
        </div>
      </div>
    </div>
  );
};
