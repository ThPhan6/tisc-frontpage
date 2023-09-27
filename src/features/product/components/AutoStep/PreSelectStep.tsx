import { FC, useEffect, useState } from 'react';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { getAutoStepData } from '../../services';
import { useGetParamId } from '@/helper/hook';

import { setSlideBar } from '../../reducers';
import { ProductAttributeFormInput } from '../../types';
import { AutoStepOnAttributeGroupResponse } from '../../types/autoStep';
import store, { useAppSelector } from '@/reducers';

import CustomButton from '@/components/Button';
import { CheckboxDynamic } from '@/components/CustomCheckbox/CheckboxDynamic';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import GroupRadioList from '@/components/CustomRadio/RadioList';
import { EmptyOne } from '@/components/Empty';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import { AttributeOptionLabel } from '../ProductAttributes/CommonAttribute';
import styles from './PreSelectStep.less';
import { SlideBar } from './SlideBar';

interface PreSelectStepProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  attrGroupItem: ProductAttributeFormInput;
}

export const PreSelectStep: FC<PreSelectStepProps> = ({ visible, setVisible, attrGroupItem }) => {
  const productId = useGetParamId();
  const attributeGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);
  const currentSpecAttributeGroupId = attributeGroupId?.['specification_attribute_groups'];

  const slideBars = useAppSelector((state) => state.autoStep.slideBar);

  const slide = useAppSelector((state) => state.autoStep.slide);

  const [steps, setSteps] = useState<AutoStepOnAttributeGroupResponse[]>([]);

  console.log('aaaa');

  useEffect(() => {
    if (
      productId &&
      currentSpecAttributeGroupId &&
      currentSpecAttributeGroupId === attrGroupItem?.id
    ) {
      getAutoStepData(productId, currentSpecAttributeGroupId).then((res) => {
        if (res) {
          setSteps(res);

          const descriptions = res.map((el) => el.name);
          store.dispatch(setSlideBar(descriptions));
        }
      });
    }
  }, [currentSpecAttributeGroupId, attrGroupItem]);

  useEffect(() => {}, []);

  const handleBackToPrevSlide = () => {};

  const handleGoToNextSlide = () => {};

  const handleSelectPickedOption = () => {};

  const handleResetAutoStep = () => {};

  const handleCreateStep = () => {};

  const handleDecreaseQuantity = () => {};

  const handleIncreaseQuantity = () => {};

  return (
    <CustomModal
      title={
        <MainTitle level={3} style={{ textTransform: 'uppercase' }}>
          FOLLOW THE STEPS
        </MainTitle>
      }
      secondaryModal
      visible={visible}
      onCancel={() => setVisible(false)}
      className={styles.modalContainer}
      maskClosable={false}
      afterClose={handleResetAutoStep}
      width={'80%'}
      closeIcon={<CloseIcon />}
      footer={
        <CustomButton size="small" properties="rounded" onClick={handleCreateStep}>
          Done
        </CustomButton>
      }
    >
      <div>
        <SlideBar
          handleBackToPrevSlide={handleBackToPrevSlide}
          handleGoToNextSlide={handleGoToNextSlide}
        />

        <div className={styles.mainContent}>
          {/* left side */}
          <div className={styles.content} style={{ marginRight: 8 }}>
            <GroupRadioList
              selected={undefined}
              onChange={handleSelectPickedOption}
              data={steps.map((step, index) => {
                return {
                  heading: (
                    <BodyText level={5} fontFamily="Roboto" customClass="header">
                      {step.name}
                    </BodyText>
                  ),
                  options: step.options.map((option, subIdx) => ({
                    value: option.id,
                    label: (
                      <div className={`flex-between w-full`}>
                        <AttributeOptionLabel className="w-full" option={option} key={subIdx}>
                          <div className="d-flex align-item-flex-start justify-between option-info">
                            <div
                              className="product-id"
                              title={option.product_id}
                              style={{ minWidth: option.pre_option_name ? '45%' : '100%' }}
                            >
                              <span className="product-id-label">Product ID:</span>
                              <span className="product-id-value">{option.product_id}</span>
                            </div>
                            {option.pre_option_name ? (
                              <div className="pre-option" title={option.pre_option_name}>
                                <span className="product-id-label">Pre Option:</span>
                                <span className="product-id-value">{option.pre_option_name}</span>
                              </div>
                            ) : null}
                          </div>
                        </AttributeOptionLabel>
                      </div>
                    ),
                  })),
                };
              })}
            />
          </div>

          {/* right side */}
          <div className={`${styles.content}  ${styles.rightContent}`}>
            {/* {pickedData.map((pickedSub, optIdx) => {
              return (
                <CheckboxDynamic
                  key={optIdx}
                  // chosenItems={currentSubPickedOptionSelected}
                  onOneChange={handleSelectPickedOption}
                  data={{
                    customItemClass: 'checkbox-item',
                    optionRadioValue: pickedSub.id,
                    optionRadioLabel: (
                      <div className="flex-between">
                        <BodyText
                          level={5}
                          fontFamily="Roboto"
                          style={{ fontWeight: 500, textTransform: 'capitalize', color: '#000' }}
                        >
                          {pickedSub.name}
                        </BodyText>
                      </div>
                    ),
                    options: pickedSub.subs.map((option, subIdx) => ({
                      pre_option: option.pre_option,
                      value: option.id,
                      label: (
                        <div
                          className={`flex-between w-full ${
                            (slide === 0 && pickedOption[slide]?.id === option.id) ||
                            (slide !== 0 &&
                              curPicked?.id === option.id &&
                              curPicked?.pre_option === option.pre_option)
                              ? 'checkbox-item-active'
                              : ''
                          }`}
                        >
                          <AttributeOptionLabel className="w-full" option={option} key={subIdx}>
                            <div className="d-flex align-item-flex-start justify-between option-info">
                              <div
                                className="product-id"
                                title={option.product_id}
                                style={{ minWidth: option.pre_option_name ? '45%' : '100%' }}
                              >
                                <span className="product-id-label">Product ID:</span>
                                <span className="product-id-value">{option.product_id}</span>
                              </div>
                              {option.pre_option_name ? (
                                <div className="pre-option" title={option.pre_option_name}>
                                  <span className="product-id-label">Pre Option:</span>
                                  <span className="product-id-value">{option.pre_option_name}</span>
                                </div>
                              ) : null}
                            </div>
                          </AttributeOptionLabel>
                          <div
                            className="replicate"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                          >
                            <BodyText
                              customClass="replicate-label"
                              level={4}
                              style={{ height: 24 }}
                            >
                              Replicate
                            </BodyText>
                            <div
                              className={`flex-start ${
                                currentSubPickedOptionSelected?.some(
                                  (el) => el.value === option.id && el.label === option.pre_option,
                                )
                                  ? ''
                                  : 'replicate-disabled'
                              }`}
                              style={{ height: 24 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                            >
                              <DropdownIcon
                                style={{ cursor: option.replicate === 1 ? 'default' : 'pointer' }}
                                onClick={handleDecreaseQuantity(option)}
                              />
                              <BodyText
                                fontFamily="Roboto"
                                level={6}
                                style={{ padding: '0 8px', width: 30 }}
                              >
                                {option.replicate}
                              </BodyText>
                              <DropupIcon onClick={handleIncreaseQuantity(option)} />
                            </div>
                          </div>
                          <div className="linkage">
                            <BodyText customClass="linkage-label" level={4} style={{ height: 24 }}>
                              Linkage
                            </BodyText>
                            <BodyText
                              fontFamily="Roboto"
                              level={6}
                              style={{ height: 24 }}
                              customClass="flex-center"
                            >
                              {optionsSelected?.[curOrder]?.options?.filter((el) => {
                                const curPreOptionIds = el.pre_option?.split(',');

                                const optionId = curPreOptionIds?.[0];
                                const preOption = curPreOptionIds
                                  ?.slice(1, curPreOptionIds.length)
                                  .join(',');

                                if (slide === 0) {
                                  return el.pre_option === option.id;
                                }

                                return optionId === option.id && preOption === option.pre_option;
                              }).length ?? 0}
                            </BodyText>
                          </div>
                        </div>
                      ),
                    })),
                  }}
                />
              );
            })} */}
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
