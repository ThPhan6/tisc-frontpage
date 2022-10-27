import { FC, useState } from 'react';

import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';

import { showImageUrl } from '@/helper/utils';

import type { SpecificationAttributeBasisOptionProps } from '../../types';
import type { RadioValue } from '@/components/CustomRadio/types';
import { ConversionSubValueProps } from '@/types';

import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';

import styles from './AttributeItem.less';

interface AttributeOptionProps {
  title: string;
  attributeName: string;
  options: SpecificationAttributeBasisOptionProps[];
  chosenOption?: RadioValue;
  setChosenOptions?: (value: RadioValue) => void;
  clearOnClose?: boolean;
  isPublicPage: boolean;
}
export const AttributeOptionLabel: FC<{ option: any }> = ({ option, children }) => {
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
        {children}
      </div>
    );
  }
  return (
    <div className={styles.defaultOptionImageList}>
      <img src={showImageUrl(option.image)} />
      <div className="option-image-list-wrapper">
        <BodyText level={6} fontFamily="Roboto" customClass="heading-option-group">
          {option.value_1} {option.unit_1} - {option.value_2} {option.unit_2}
        </BodyText>
        <div className="product-input-group">{children}</div>
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
  clearOnClose,
  isPublicPage,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const isOptionWithImage =
    options.findIndex((option) => {
      return option.image !== null && option.image !== '';
    }) > -1;

  const showChosenOption = () => {
    if (chosenOption) {
      return chosenOption.label;
    }

    if (isPublicPage) {
      return '';
    }

    return 'select';
  };

  return (
    <>
      <div
        className={`${styles.content}  product-attribute-option-wrapper`}
        style={{ cursor: isPublicPage ? 'text' : undefined }}
        onClick={() => setVisible(true)}>
        <BodyText
          level={6}
          fontFamily="Roboto"
          customClass={isPublicPage ? styles.content_select : ''}
          color={chosenOption?.label ? 'primary-color-dark' : 'mono-color'}>
          {showChosenOption()}
        </BodyText>
        {isPublicPage ? null : <ActionRightIcon className={styles.singlerRighIcon} />}
      </div>
      {isPublicPage ? null : (
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
                    label: (
                      <AttributeOptionLabel option={option} key={index}>
                        <span className="product-id-label">Product ID:</span>
                        <span className="product-id-value">{option.option_code}</span>
                      </AttributeOptionLabel>
                    ),
                    value: option.id,
                  };
                }) ?? [],
            },
          ]}
          className={`${styles.specificationAttributeOption} ${
            isOptionWithImage ? styles.specificationAttributeImageOption : ''
          }
        attribute-group-option-popover
        `}
          chosenValue={chosenOption}
          setChosenValue={setChosenOptions}
          clearOnClose={clearOnClose}></Popover>
      )}
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

interface ConversionTextProps {
  conversion?: ConversionSubValueProps;
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
        {firstValue || ''} {conversion?.unit_1 || ''}
      </span>
      <span className={styles.converstionText}>
        {secondValue || ''} {conversion?.unit_2 || ''}
      </span>
    </BodyText>
  );
};
