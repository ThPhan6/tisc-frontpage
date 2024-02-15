import { FC, useState } from 'react';

import { USER_ROLE } from '@/constants/userRoles';
import { Tooltip } from 'antd';

import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import ArrowRightIcon from '@/assets/icons/line-right-white.svg';

import { useGetUserRoleFromPathname } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { isEmpty } from 'lodash';

import type { SpecificationAttributeBasisOptionProps } from '../../types';
import type { RadioValue } from '@/components/CustomRadio/types';
import { ConversionSubValueProps } from '@/types';

import { CustomTextArea } from '@/components/Form/CustomTextArea';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';

import { getProductDetailPathname } from '../../utils';
import styles from './ProductAttributeSubItem.less';

interface AttributeOptionProps {
  title: string;
  attributeName: string;
  options: SpecificationAttributeBasisOptionProps[];
  chosenOption?: RadioValue;
  setChosenOptions?: (value: RadioValue) => void;
  clearOnClose?: boolean;
  isPublicPage: boolean;
  isOpenOptionModal?: boolean;
}
export const AttributeOptionLabel: FC<{
  className?: string;
  hasBoxShadow?: boolean;
  option: any;
  userRole?: string;
}> = ({ option, userRole = 'tisc', className = '', hasBoxShadow = true, children }) => {
  const currentUser = useGetUserRoleFromPathname();
  const isTISC = currentUser === USER_ROLE.tisc;
  const [isMouseover, setIsMouseover] = useState(false);
  const optionValue = `${option.value_1} ${option.unit_1} ${option.value_2 ? '-' : ''} ${
    option.value_2
  } ${option.unit_2}`;
  return (
    <div className={`${styles.defaultOptionImageList} option-attribute-label ${className}`}>
      {hasBoxShadow ? (
        <div
          className={`${styles.boxShadowOptionImage} ${
            isTISC ? styles.widthCheckboxImage : styles.widthOptionImage
          }`}
        ></div>
      ) : null}
      {!option.image || option.image == '' ? null : (
        <Tooltip
          title={
            option.product_information_description ? 'Click icon to see product details.' : null
          }
          style={{ position: 'relative' }}
        >
          <div
            onMouseOver={() => {
              if (option.product_information_description) {
                setIsMouseover(true);
              }
            }}
            onMouseOut={() => {
              if (option.product_information_description) {
                setIsMouseover(false);
              }
            }}
          >
            <img
              src={ArrowRightIcon}
              alt=""
              className={`${styles.imgFrame} ${isMouseover ? styles.toggleIn : styles.toggleOut}`}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const path = getProductDetailPathname(
                  userRole,
                  option.product_information_id,
                  '',
                  false,
                );
                if (!isEmpty(path)) {
                  window.open(`${window.location.origin}${path}`, '_blank', 'noopener,noreferrer');
                }
              }}
            />
            <img src={showImageUrl(option.image)} />
          </div>
        </Tooltip>
      )}
      <div className="option-image-list-wrapper">
        <BodyText
          level={6}
          fontFamily="Roboto"
          customClass="heading-option-group"
          title={optionValue}
        >
          {optionValue}
        </BodyText>
        {children ? <div className="product-input-group">{children}</div> : null}
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
  isOpenOptionModal,
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

  const handleOpenOptionModal = () => {
    if (!isOpenOptionModal) {
      return;
    }

    setVisible(true);
  };

  return (
    <>
      <div
        className={`${styles.content}  product-attribute-option-wrapper`}
        style={{ cursor: isPublicPage || !isOpenOptionModal ? 'text' : undefined }}
        onClick={handleOpenOptionModal}
      >
        <BodyText
          level={6}
          fontFamily="Roboto"
          customClass={isPublicPage ? styles.content_select : ''}
          color={chosenOption?.label ? 'primary-color-dark' : 'mono-color'}
        >
          {showChosenOption()}
        </BodyText>
        {isPublicPage ? null : (
          <div style={{ width: 16, height: 16, marginLeft: 8 }}>
            <ActionRightIcon className={styles.singlerRighIcon} />
          </div>
        )}
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
          clearOnClose={clearOnClose}
          secondaryModal
        />
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
