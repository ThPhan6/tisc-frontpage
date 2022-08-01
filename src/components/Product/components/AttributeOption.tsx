import { useState } from 'react';
import { BodyText } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { showImageUrl } from '@/helper/utils';
import styles from '../styles/attributes.less';

import type { FC } from 'react';
import type { SpecificationAttributeBasisOptionProps } from '@/types';
//
interface AttributeOptionProps {
  title: string;
  attributeName: string;
  options: SpecificationAttributeBasisOptionProps[];
}

const AttributeOptionLabel = (option: SpecificationAttributeBasisOptionProps) => {
  if (!option.image || option.image == '') {
    return (
      <div className={styles.defaultOptionList}>
        <div className="group-option-name">
          <span className="value">{option.value_1}</span>
          <span>{option.unit_1}</span>
        </div>
        <div className="group-option-name">
          <span className="value">{option.value_2}</span>
          <span>{option.unit_2}</span>
        </div>
        <span className="product-id-label">Product ID:</span>
        <span className="product-id-value">{option.option_code}</span>
      </div>
    );
  }
  return (
    <div className={styles.defaultOptionImageList}>
      <img src={showImageUrl(option.image)} />
      <div className="option-image-list-wrapper">
        <BodyText level={6} fontFamily="Roboto" customClass="heading-option-group">
          {option.value_1} - {option.value_2}
        </BodyText>
        <div className="product-input-group">
          <span className="product-id-label">Product ID:</span>
          <span className="product-id-value">{option.option_code}</span>
        </div>
      </div>
    </div>
  );
};

const AttributeOption: FC<AttributeOptionProps> = ({ title, attributeName, options }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const isOptionWithImage =
    options.findIndex((option) => {
      return option.image !== null && option.image !== '';
    }) > -1;
  return (
    <>
      <div className={styles.content} onClick={() => setVisible(true)}>
        <BodyText level={6} fontFamily="Roboto" customClass={styles.content_select}>
          select
        </BodyText>
        <ActionRightIcon className={styles.singlerRighIcon} />
      </div>
      <Popover
        title={title}
        visible={visible}
        setVisible={setVisible}
        groupRadioList={[
          {
            heading: attributeName,
            options:
              options.map((option, index: number) => {
                return {
                  label: <AttributeOptionLabel {...option} key={index} />,
                  value: option.id,
                };
              }) ?? [],
          },
        ]}
        className={`
        ${styles.specificationAttributeOption}
        ${isOptionWithImage ? styles.specificationAttributeImageOption : ''}
      `}
      ></Popover>
    </>
  );
};
export default AttributeOption;
