import { FC, useEffect, useState } from 'react';

import { message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { getAutoStepData } from '../../services';
import { useGetParamId } from '@/helper/hook';
import { flatMap } from 'lodash';

import {
  resetAutoStepState,
  setOptionsSelected,
  setPartialProductDetail,
  setPickedOption,
  setPreSelectStep,
  setSlide,
  setSlideBar,
} from '../../reducers';
import { ProductAttributeFormInput } from '../../types';
import {
  AutoStepOnAttributeGroupResponse,
  LinkedOptionProps,
  LinkedSubOptionProps,
  OptionReplicateResponse,
} from '../../types/autoStep';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import store, { useAppSelector } from '@/reducers';

import CustomButton from '@/components/Button';
import { CheckboxDynamic } from '@/components/CustomCheckbox/CheckboxDynamic';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import { EmptyOne } from '@/components/Empty';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import { AttributeOptionLabel } from '../ProductAttributes/CommonAttribute';
import styles from './PreSelectStep.less';
import { SlideBar } from './SlideBar';
import { getPickedOptionGroup } from './util';

interface PreSelectStepProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  attrGroupItem: ProductAttributeFormInput;
}

export const PreSelectStep: FC<PreSelectStepProps> = ({ visible, setVisible, attrGroupItem }) => {
  const productId = useGetParamId();
  const attributeGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);
  const currentSpecAttributeGroupId = attributeGroupId?.['specification_attribute_groups'];

  const [nextLeftPanelData, setNextLeftPanelData] = useState<LinkedOptionProps[]>([]);

  /// this state saved all data on each step
  const [steps, setSteps] = useState<{ [order: string]: AutoStepOnAttributeGroupResponse }>({});

  const [forceEnableCollapse, setForceEnableCollapse] = useState<boolean>(false);

  const { specification_attribute_groups: specificationAttributeGroup } = useAppSelector(
    (state) => state.product.details,
  );

  const { slideBars, slide, preSelectStep, pickedOption, optionsSelected } = useAppSelector(
    (state) => state.autoStep,
  );

  const curOrder = slide + 2;
  const curPicked = pickedOption[slide];
  const currentPreSelectOptionData = preSelectStep?.[curOrder]?.options ?? [];
  const currentOptionSelected = optionsSelected?.[curOrder]?.options ?? [];

  const leftPanelData =
    slide === 0 && preSelectStep[1]
      ? getPickedOptionGroup(preSelectStep[1]?.options) ?? []
      : nextLeftPanelData;

  const rightPanelData: LinkedOptionProps[] = getPickedOptionGroup(currentPreSelectOptionData);

  /* set sub option ticked on the left panel  */
  const currentSubLinkedOptionSelected: CheckboxValue[] = currentOptionSelected
    .filter((el) =>
      currentPreSelectOptionData.some(
        (opt) => opt.id === el.id && opt.pre_option === el.pre_option,
      ),
    )
    .map((el) => ({ label: el.pre_option, value: el.id }));
  /* ---------------------------------------- */

  /* set sub option ticked on the left panel  */
  const subOptionLeft = flatMap(leftPanelData.map((el) => el.subs));

  const currentSubPickedOptionSelected: CheckboxValue[] = subOptionLeft
    .filter((el) => currentOptionSelected.some((opt) => opt.pre_option === el.id))
    .map((el) => ({ label: el.pre_option, value: el.id }));
  /* ---------------------------------------- */

  useEffect(() => {
    if (
      !productId ||
      !currentSpecAttributeGroupId ||
      currentSpecAttributeGroupId !== attrGroupItem?.id ||
      (currentSpecAttributeGroupId === attrGroupItem?.id && attrGroupItem.steps?.length)
    ) {
      return;
    }

    getAutoStepData(productId, currentSpecAttributeGroupId).then((res) => {
      if (res) {
        let newPreSelectStep: { [order: number]: AutoStepOnAttributeGroupResponse } = {};
        res.forEach((el) => {
          newPreSelectStep = { ...newPreSelectStep, [el.order]: el };
        });

        setSteps(newPreSelectStep);

        store.dispatch(
          setPreSelectStep({
            ...newPreSelectStep[1],
            order: 1,
            options: newPreSelectStep[1].options,
          }),
        );

        /// set description for slide bar
        const descriptions = res.map((el) => el.name);
        store.dispatch(setSlideBar(descriptions));

        /// save steps to specification attribute group
        store.dispatch(
          setPartialProductDetail({
            specification_attribute_groups: [...specificationAttributeGroup].map((el) =>
              el.id === currentSpecAttributeGroupId ? { ...el, steps: res } : el,
            ),
          }),
        );
      }
    });
  }, [currentSpecAttributeGroupId]);

  const handleResetAutoStep = () => {
    store.dispatch(resetAutoStepState());
  };

  useEffect(() => {
    return () => {
      handleResetAutoStep();
    };
  }, []);

  const handleForceEnableCollapse = () => {
    setForceEnableCollapse(true);

    setTimeout(() => {
      setForceEnableCollapse(false);
    }, 200);
  };

  const handleBackToPrevSlide = () => {};

  const handleGoToNextSlide = () => {
    handleForceEnableCollapse();

    const prevSlide = slide;

    if (!currentOptionSelected.length) {
      message.error('Please select options');
      return;
    }

    const newSlide = prevSlide + 1;
    const newOrder = newSlide + 1;

    /* add new slide */
    store.dispatch(setSlide(newSlide));
    /* ------------- */

    /* set next data view on the left panel */
    const newNextLeftPanelData = getPickedOptionGroup(optionsSelected[newOrder].options);
    setNextLeftPanelData(newNextLeftPanelData);
    /* ------------------------------------ */
  };

  const handleSelectPickedOption = (e: CheckboxChangeEvent) => {
    handleForceEnableCollapse();

    const curOptionSelected = {
      id: e.target.value,
      pre_option: (e.target as any).pre_option,
      replicate: (e.target as any).replicate,
    };

    const isPrevPickedOption =
      curPicked?.id === curOptionSelected.id &&
      curPicked?.pre_option === curOptionSelected.pre_option;

    if (isPrevPickedOption) {
      return;
    }

    const curPickedSubData =
      slide === 0 ? preSelectStep[1].options : preSelectStep[curOrder].options;

    const curPickedOption = curPickedSubData.find(
      (el) => el.id === curOptionSelected.id && el.pre_option === curOptionSelected.pre_option,
    );

    if (curPickedOption?.id) {
      store.dispatch(
        setPickedOption({
          slide: slide,
          id: curPickedOption.id,
          pre_option: curPickedOption?.pre_option,
          replicate: curPickedOption.replicate,
        }),
      );
    }

    /// set data view on the right panel
    const newRightPanelData = steps[curOrder].options.filter(
      (sub) => sub.pre_option === curOptionSelected.id,
    );

    store.dispatch(setPreSelectStep({ order: curOrder, options: newRightPanelData }));
  };

  const handleSelectLinkedOption = (e: CheckboxChangeEvent) => {
    const curSubSelected = {
      id: e.target.value,
      pre_option: (e.target as any).pre_option,
    };

    let curOptionSelected: OptionReplicateResponse[] = optionsSelected?.[curOrder]?.options
      ? [...optionsSelected[curOrder].options]
      : [];

    const subOptionFound = preSelectStep[curOrder].options.find(
      (sub) => sub.id === curSubSelected.id && sub.pre_option === curPicked.id,
    );

    const subOptionIdx = curOptionSelected.findIndex(
      (sub) => sub.id === subOptionFound?.id && sub.pre_option === curPicked.id,
    );

    if (subOptionIdx > -1) {
      delete curOptionSelected[subOptionIdx];
    } else if (subOptionFound) {
      curOptionSelected = curOptionSelected.concat(subOptionFound);
    }

    let resultOptionSelected = curOptionSelected;
    if (slide === 0) {
      resultOptionSelected = curOptionSelected.filter((el) => el.pre_option === curPicked.id);
    }

    store.dispatch(setOptionsSelected({ order: curOrder, options: resultOptionSelected }));
  };

  const handleDecreaseQuantity = (option: LinkedSubOptionProps) => () => {};

  const handleIncreaseQuantity = (option: LinkedSubOptionProps) => () => {};

  const handleCreatePreSelectStep = () => {};

  console.log('rightPanelData', rightPanelData);

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
        <CustomButton size="small" properties="rounded" onClick={handleCreatePreSelectStep}>
          Done
        </CustomButton>
      }
    >
      <SlideBar
        handleBackToPrevSlide={handleBackToPrevSlide}
        handleGoToNextSlide={handleGoToNextSlide}
      />

      <div className={styles.mainContent}>
        {/* left side */}
        <div className={styles.content} style={{ marginRight: 8 }}>
          {leftPanelData.map((pickedSub, optIdx) => {
            return (
              <CheckboxDynamic
                key={optIdx}
                chosenItems={currentSubPickedOptionSelected}
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
                    replicate: option.replicate,
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
                        <AttributeOptionLabel
                          className="w-full"
                          hasBoxShadow={false}
                          option={option}
                          key={subIdx}
                        >
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
                }}
              />
            );
          })}
        </div>

        {/* right side */}
        <div className={`${styles.content} ${styles.rightContent}`}>
          {!rightPanelData.length ? (
            <EmptyOne />
          ) : (
            <div className={styles.linkedContent}>
              <div className={`flex-between header`}>
                <BodyText level={5} fontFamily="Roboto" style={{ textTransform: 'capitalize' }}>
                  {slideBars[slide]}
                </BodyText>

                <div className="flex-start">
                  <BodyText level={3} fontFamily="Cormorant-Garamond">
                    Required
                  </BodyText>
                  <BodyText
                    level={5}
                    fontFamily="Roboto"
                    style={{ fontWeight: 500, margin: '0 16px 0 8px' }}
                  >
                    {curPicked.replicate}
                  </BodyText>
                  <BodyText level={3} fontFamily="Cormorant-Garamond">
                    Yours
                  </BodyText>
                  <BodyText
                    level={5}
                    fontFamily="Roboto"
                    style={{ fontWeight: 500, marginLeft: 8 }}
                  >
                    X
                  </BodyText>
                </div>
              </div>

              <DropdownCheckboxList
                customClass="checkbox-item"
                combinable
                canActiveMultiKey
                showCount={false}
                selected={currentSubLinkedOptionSelected}
                chosenItem={currentSubLinkedOptionSelected}
                forceEnableCollapse={forceEnableCollapse}
                onOneChange={handleSelectLinkedOption}
                renderTitle={(data) => data.label}
                data={rightPanelData.map((option) => ({
                  label: option.name,
                  id: option.id,

                  options: option.subs.map((sub, subIdx) => ({
                    value: sub.id,
                    pre_option: sub.pre_option,
                    productId: sub.product_id,
                    label: (
                      <div className={`flex-between w-full`}>
                        <AttributeOptionLabel
                          key={subIdx}
                          className="w-full"
                          hasBoxShadow={false}
                          option={sub}
                        >
                          <div className="d-flex align-item-flex-start option-info">
                            <div
                              className="product-id"
                              title={sub.product_id}
                              style={{ minWidth: sub.pre_option_name ? '45%' : '100%' }}
                            >
                              <span className="product-id-label">Product ID:</span>
                              <span className="product-id-value">{sub.product_id}</span>
                            </div>
                            {sub.pre_option_name ? (
                              <div className="pre-option" title={sub.pre_option_name}>
                                <span className="product-id-label">Pre Option:</span>
                                <span className="product-id-value">{sub.pre_option_name}</span>
                              </div>
                            ) : null}
                          </div>
                        </AttributeOptionLabel>
                        <div
                          className="quantity"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          <BodyText
                            fontFamily="Cormorant-Garamond"
                            customClass="replicate-label"
                            level={4}
                            style={{ height: 24 }}
                          >
                            Quantity
                          </BodyText>
                          <div
                            className={`flex-start`}
                            style={{ height: 24 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                          >
                            <DropdownIcon
                              style={{ cursor: sub.replicate === 1 ? 'default' : 'pointer' }}
                              onClick={handleDecreaseQuantity(sub)}
                            />
                            <BodyText
                              fontFamily="Roboto"
                              level={6}
                              style={{ padding: '0 8px', width: 30 }}
                            >
                              {sub.quantity}
                            </BodyText>
                            <DropupIcon onClick={handleIncreaseQuantity(sub)} />
                          </div>
                        </div>
                      </div>
                    ),
                  })),
                }))}
              />
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};
