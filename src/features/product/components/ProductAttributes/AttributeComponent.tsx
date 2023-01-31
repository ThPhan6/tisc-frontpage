import { FC, useState } from 'react';

import { USER_ROLE } from '@/constants/userRoles';

import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';

import { useGetUserRoleFromPathname } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { countBy } from 'lodash';

import type { SpecificationAttributeBasisOptionProps } from '../../types';
import type { RadioValue } from '@/components/CustomRadio/types';
import { ConversionSubValueProps } from '@/types';

import { CustomTextArea } from '@/components/Form/CustomTextArea';
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
  const currentUser = useGetUserRoleFromPathname();
  const isTISC = currentUser === USER_ROLE.tisc;

  const colspanValue_1 = option.unit_1 ? undefined : 2;
  let colspanUnit_1 = option.value_1 ? undefined : 2;
  let colspanValue_2 = option.unit_2 ? undefined : 2;
  const colspanUnit_2 = option.value_2 ? undefined : 2;
  const hasOneOptionLabel =
    countBy(
      [colspanUnit_1, colspanUnit_2, colspanValue_1, colspanValue_2],
      (el) => typeof el === 'undefined',
    ).true <= 1;

  const textAlignLeft =
    countBy(
      [colspanUnit_1, colspanUnit_2, colspanValue_1, colspanValue_2],
      (el) => typeof el === 'undefined',
    ).true <= 2
      ? 'align-left'
      : '';

  if (option.value_1 && option.unit_1 && !option.value_2 && !option.unit_2) {
    colspanUnit_1 = 3;
  }
  if (!option.value_1 && !option.unit_1 && option.value_2 && option.unit_2) {
    colspanValue_2 = 3;
  }

  if (!option.image || option.image == '') {
    return (
      <div className={styles.defaultOptionList}>
        <table className="text-overflow">
          <tr>
            <td
              title={option.value_1}
              colSpan={hasOneOptionLabel ? 4 : colspanValue_1}
              className={`${option.value_1 ? '' : 'option-none'} ${textAlignLeft} ${
                colspanUnit_1 === 3 ? 'align-right' : ''
              }`}>
              {option.value_1}
            </td>
            <td
              title={option.unit_1}
              colSpan={hasOneOptionLabel ? 4 : colspanUnit_1}
              className={`${option.unit_1 ? '' : 'option-none'} ${textAlignLeft}`}>
              {option.unit_1}
            </td>
            <td
              title={option.value_2}
              colSpan={hasOneOptionLabel ? 4 : colspanValue_2}
              className={`${option.value_2 ? '' : 'option-none'} ${textAlignLeft} ${
                colspanValue_2 === 3 ? 'align-right' : ''
              }`}>
              {option.value_2}
            </td>
            <td
              title={option.unit_2}
              colSpan={hasOneOptionLabel ? 4 : colspanUnit_2}
              className={`${option.unit_2 ? '' : 'option-none'} ${textAlignLeft}`}>
              {option.unit_2}
            </td>
          </tr>
        </table>
        {children}
      </div>
    );
  }
  return (
    <div className={styles.defaultOptionImageList}>
      <div
        className={`${styles.boxShadowOptionImage} ${
          isTISC ? styles.widthCheckboxImage : styles.widthOptionImage
        }`}></div>
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
                        <div>
                          <span className="product-id-label">Product ID:</span>
                          <span className="product-id-value">{option.option_code}</span>
                        </div>
                      </AttributeOptionLabel>
                    ),
                    value: option.id,
                  };
                }) ?? [],
            },
          ]}
          className={`attribute-group-option-popover ${styles.specificationAttributeOption} ${
            isOptionWithImage ? styles.specificationAttributeImageOption : ''
          }`}
          chosenValue={chosenOption}
          setChosenValue={setChosenOptions}
          clearOnClose={clearOnClose}></Popover>
      )}
    </>
  );
};

export const GeneralText: FC<{ text?: string }> = ({ text = '' }) => {
  return (
    <CustomTextArea
      value={text}
      customClass={`${styles.customTextArea} ${styles.generalText}`}
      readOnly
      autoResize
    />
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
    <BodyText level={6} customClass={`${styles.content_text} flex-start`} fontFamily="Roboto">
      <span className={styles.converstionText}>
        {firstValue || ''} {conversion?.unit_1 || ''}
      </span>
      <span className={styles.converstionText}>
        {secondValue || ''} {conversion?.unit_2 || ''}
      </span>
    </BodyText>
  );
};
