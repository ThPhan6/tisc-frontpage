import { FC, ReactNode, useState } from 'react';
import type { SpecificationAttributeBasisOptionProps } from '../../types';
import { BodyText } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { showImageUrl } from '@/helper/utils';
import styles from './ProductAttributeContainer.less';
import CustomCollapse from '@/components/Collapse';
import type { RadioValue } from '@/components/CustomRadio/types';
import { ConversionSubValueProps } from '@/types';

interface AttributeOptionProps {
  title: string;
  attributeName: string;
  options: SpecificationAttributeBasisOptionProps[];
  chosenOption?: RadioValue;
  setChosenOptions?: (value: RadioValue) => void;
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

export const AttributeOption: FC<AttributeOptionProps> = ({
  title,
  attributeName,
  options,
  chosenOption,
  setChosenOptions,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const isOptionWithImage =
    options.findIndex((option) => {
      return option.image !== null && option.image !== '';
    }) > -1;
  return (
    <>
      <div
        className={`${styles.content} product-attribute-option-wrapper`}
        onClick={() => setVisible(true)}
      >
        <BodyText level={6} fontFamily="Roboto" customClass={styles.content_select}>
          {chosenOption ? chosenOption.label : 'select'}
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
          attribute-group-option-popover
        `}
        chosenValue={chosenOption}
        setChosenValue={setChosenOptions}
      ></Popover>
    </>
  );
};

export const GeneralText: FC<{ text?: string }> = ({ text = '' }) => {
  return (
    <BodyText level={6} customClass={styles.content_text} fontFamily="Roboto">
      {text}
    </BodyText>
  );
};

interface AttributeCollapseProps {
  name: string;
  index: number;
  children?: ReactNode;
}

export const AttributeCollapse: FC<AttributeCollapseProps> = ({ name, index, children }) => {
  return (
    <div className={styles.attributes}>
      <div className={styles.specification}>
        <CustomCollapse
          showActiveBoxShadow
          key={`${name}_${index}`}
          className={styles.vendorSection}
          customHeaderClass={styles.vendorCustomPanelBox}
          header={
            <div className={styles.brandProfileHeader}>
              <BodyText level={6} fontFamily="Roboto" className={styles.name}>
                {name}
              </BodyText>
            </div>
          }
        >
          {children}
        </CustomCollapse>
      </div>
    </div>
  );
};

interface ConversionTextProps {
  conversion: ConversionSubValueProps;
  firstValue: string;
  secondValue: string;
}

export const ConversionText: FC<ConversionTextProps> = ({
  conversion,
  firstValue,
  secondValue,
}) => {
  return (
    <BodyText level={6} customClass={styles.content_text} fontFamily="Roboto">
      <span className={styles.converstionText}>
        {firstValue} {conversion.unit_1}
      </span>
      <span className={styles.converstionText}>
        {secondValue} {conversion.unit_2}
      </span>
    </BodyText>
  );
};

export const AttributeCollapseHeader: FC<{ name: string }> = ({ name = '' }) => {
  return (
    <div className={styles.brandProfileHeader}>
      <BodyText level={6} fontFamily="Roboto" className={styles.name}>
        {name}
      </BodyText>
    </div>
  );
};

interface ProductAttributeLineProps {
  name: string;
  children?: ReactNode;
}
export const ProductAttributeLine: FC<ProductAttributeLineProps> = ({ name = '', children }) => {
  return (
    <div className={`${styles.content} ${styles.attribute} attribute-type`}>
      <BodyText level={4} customClass={styles.content_type}>
        {name}
      </BodyText>
      {children}
    </div>
  );
};
