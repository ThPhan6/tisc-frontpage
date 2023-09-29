import { FC, useEffect, useState } from 'react';

import { message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { getAutoStepData } from '../../services';
import { useGetParamId } from '@/helper/hook';
import { cloneDeep, flatMap, map, sum } from 'lodash';

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
  AutoStepPreSelectOnAttributeGroupResponse,
  AutoStepPreSelectOptionProps,
  OptionQuantityProps,
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

  const [newLeftPanelData, setNewLeftPanelData] = useState<AutoStepPreSelectOptionProps[]>([]);

  /// this state saved all data on each step
  const [steps, setSteps] = useState<{
    [order: string]: AutoStepPreSelectOnAttributeGroupResponse;
  }>({});

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
  const currentOptionSelected =
    (optionsSelected?.[curOrder]?.options as unknown as OptionQuantityProps[]) ?? [];

  const leftPanelData =
    slide === 0 && preSelectStep[1]
      ? getPickedOptionGroup(preSelectStep[1]?.options) ?? []
      : newLeftPanelData;

  const rightPanelData = getPickedOptionGroup(
    currentPreSelectOptionData,
  ) as AutoStepPreSelectOptionProps[];

  /* set sub option ticked on the left panel  */
  const subOptionLeft = flatMap(leftPanelData.map((el) => el.subs));

  const currentSubPickedOptionSelected: CheckboxValue[] = subOptionLeft
    .filter((opt) =>
      currentOptionSelected.some((sub) => {
        const preOption = sub.pre_option?.split(',');
        const optionId = preOption?.[0] as string;
        const preOptionId = preOption?.slice(1, preOption.length).join(',');

        return preOptionId
          ? opt.pre_option === preOptionId && opt.id === optionId
          : sub.pre_option === opt.id;
      }),
    )
    .map((el) => ({ label: el.pre_option, value: el.id }));
  /* ---------------------------------------- */

  /* set sub option ticked on the right panel  */
  const currentSubLinkedOptionSelected: CheckboxValue[] = currentOptionSelected
    .filter((el) =>
      currentPreSelectOptionData.some(
        (opt) => opt.id === el.id && opt.pre_option === el.pre_option,
      ),
    )
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
        const newRes: AutoStepPreSelectOnAttributeGroupResponse[] = res.map((el) => ({
          ...el,
          options: el.options.map((opt) => ({ ...opt, quantity: 0 })),
        }));

        let newPreSelectStep: { [order: number]: AutoStepPreSelectOnAttributeGroupResponse } = {};
        newRes.forEach((el) => {
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
        const descriptions = newRes.map((el) => el.name);
        store.dispatch(setSlideBar(descriptions));

        /// save steps to specification attribute group
        store.dispatch(
          setPartialProductDetail({
            specification_attribute_groups: [...specificationAttributeGroup].map((el) =>
              el.id === currentSpecAttributeGroupId ? { ...el, steps: newRes } : el,
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

  const handleBackToPrevSlide = () => {
    const prevSlide = slide;
    const newSlide = prevSlide - 1;
    const newOrder = newSlide + 1;

    handleForceEnableCollapse();

    /* add new slide */
    store.dispatch(setSlide(newSlide));
    /* ------------- */

    if (newSlide !== 0) {
      /* set prev data view on the left panel */
      const newNextLeftPanelData = getPickedOptionGroup(
        optionsSelected[newOrder].options,
      ) as AutoStepPreSelectOptionProps[];
      setNewLeftPanelData(newNextLeftPanelData);
      /* ------------------------------------ */
    }
  };

  const handleGoToNextSlide = () => {
    const prevSlide = slide;
    const newSlide = prevSlide + 1;

    if (newSlide === slideBars.length - 1) {
      return;
    }

    handleForceEnableCollapse();

    if (!currentOptionSelected.length) {
      message.error('Please select options');
      return;
    }

    const newOrder = newSlide + 1;

    /* add new slide */
    store.dispatch(setSlide(newSlide));
    /* ------------- */

    /* set next data view on the left panel */
    const newNextLeftPanelData = getPickedOptionGroup(
      optionsSelected[newOrder].options,
    ) as AutoStepPreSelectOptionProps[];
    setNewLeftPanelData(newNextLeftPanelData);
    /* ------------------------------------ */
  };

  const handleSelectPickedOption = (e: CheckboxChangeEvent) => {
    handleForceEnableCollapse();

    const curOptionSelected = {
      id: e.target.value,
      pre_option: (e.target as any).pre_option,
    };

    const isPrevPickedOption =
      curPicked?.id === curOptionSelected.id &&
      curPicked?.pre_option === curOptionSelected.pre_option;

    if (isPrevPickedOption) {
      return;
    }

    const curPickedSubData =
      slide === 0 ? preSelectStep[1].options : flatMap(leftPanelData.map((el) => el.subs));

    const curPickedOption = curPickedSubData.find(
      (el) => el.id === curOptionSelected.id && el.pre_option === curOptionSelected.pre_option,
    );

    console.log('curPickedOption', curPickedOption);

    if (curPickedOption?.id) {
      store.dispatch(
        setPickedOption({
          slide: slide,
          id: curPickedOption.id,
          pre_option: curPickedOption?.pre_option,
          replicate: curPickedOption.replicate,
          yours: curPickedOption.yours,
        }),
      );
    }

    console.log('currentPreSelectOptionData', currentPreSelectOptionData);
    console.log('rightPanelData', rightPanelData);

    /// set data view on the right panel
    ///TODO: get quantity from option selected
    const newRightPanelData = (
      currentPreSelectOptionData.length ? currentPreSelectOptionData : steps[curOrder].options
    ).filter((sub) => {
      const preOption = sub.pre_option?.split(',');
      const optionId = preOption?.[0] as string;
      const preOptionId = preOption?.slice(1, preOption.length).join(',');

      return preOptionId
        ? optionId === curOptionSelected.id && preOptionId === curOptionSelected.pre_option
        : sub.pre_option === curOptionSelected.id;
    });

    store.dispatch(setPreSelectStep({ order: curOrder, options: newRightPanelData }));
  };

  const handleSelectLinkedOption = (e: CheckboxChangeEvent) => {
    const curSubSelected = {
      id: e.target.value,
      pre_option: (e.target as any).pre_option,
    };

    const curOptionSelected: OptionQuantityProps[] = optionsSelected?.[curOrder]?.options
      ? ([...optionsSelected[curOrder].options] as OptionQuantityProps[])
      : [];

    const subOptionFound = preSelectStep[curOrder].options.find(
      (sub) => sub.id === curSubSelected.id && sub.pre_option === curSubSelected.pre_option,
    );

    if (!subOptionFound) {
      return;
    }

    let newOptionsSelected = curOptionSelected.filter(
      (sub) => sub.id !== subOptionFound.id || sub.pre_option !== subOptionFound.pre_option,
    );

    if (newOptionsSelected.length === curOptionSelected.length) {
      newOptionsSelected = newOptionsSelected.concat(subOptionFound);
    }

    if (slide === 0) {
      newOptionsSelected = newOptionsSelected.filter((el) => el.pre_option === curPicked.id);

      /* save option ticked on first step */
      const currentOptionTicked = preSelectStep[1].options.find(
        (el) => el.id === newOptionsSelected[0].pre_option,
      );

      store.dispatch(
        setOptionsSelected({ order: 1, options: currentOptionTicked ? [currentOptionTicked] : [] }),
      );
      /* ---------------------------------- */
    }

    store.dispatch(setOptionsSelected({ order: curOrder, options: newOptionsSelected }));

    if (optionsSelected[curOrder + 1]) {
      /* remove next data selected options */
      let prevOptionsSelectedIds = newOptionsSelected.map((el) =>
        el.pre_option ? `${el.id},${el.pre_option}` : el.id,
      );

      map(optionsSelected, (optionData: any, optIndex: number) => {
        if (optIndex <= curOrder) {
          return false;
        }

        const newNextOptionSelected = optionData.options.filter((el: any) =>
          prevOptionsSelectedIds.includes(el.pre_option),
        );

        prevOptionsSelectedIds = prevOptionsSelectedIds.filter((el: any) =>
          newNextOptionSelected.includes(el.pre_option),
        );

        store.dispatch(setOptionsSelected({ order: optIndex, options: newNextOptionSelected }));

        return true;
      });
      /* ---------------------------------- */

      /* remove next data view */
      const newPreSelectStep = { ...preSelectStep };

      map(preSelectStep, (_data: any, order: number) => {
        if (order <= curOrder) {
          return false;
        }

        newPreSelectStep[order] = { ...newPreSelectStep[order], options: [] };

        return true;
      });

      store.dispatch(setPreSelectStep(newPreSelectStep));
      /* --------------------- */

      /* remove next highlighted */
      const newPickedOption = { ...pickedOption };

      map(pickedOption, (_data: any, index: number) => {
        if (index <= slide) {
          return false;
        }

        newPickedOption[index] = { id: '', pre_option: '', replicate: 1, yours: 0 };

        return true;
      });

      store.dispatch(setPickedOption(newPickedOption));
      /* ----------------------- */
    }
  };

  const handleIncreaseQuantity =
    (option: OptionQuantityProps) => (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const curRequired = curPicked.replicate as number;
      const oldSumYours = sum(currentOptionSelected.map((el) => el.quantity));

      const subOptionSelected = currentOptionSelected.some(
        (el) => el.id === option.id && el.pre_option === option.pre_option,
      );

      if (!currentOptionSelected.length || !subOptionSelected) {
        message.error('Please select option first');
        return;
      }

      if (oldSumYours >= curRequired) {
        message.error('Yours choice must be less than required');
        return;
      }

      const newCurrentOptionSelected = cloneDeep(currentOptionSelected).map((sub) => ({
        ...sub,
        quantity:
          sub.quantity <= curRequired &&
          sub.id === option.id &&
          sub.pre_option === option.pre_option
            ? ++sub.quantity
            : sub.quantity,
      }));

      /* update current option selected */

      store.dispatch(setOptionsSelected({ order: curOrder, options: newCurrentOptionSelected }));
      /* ------------------------------ */

      /* update current data view */
      const newCurrentPreSelectOptionData = cloneDeep(currentPreSelectOptionData).map((sub) => ({
        ...sub,
        quantity:
          sub.quantity <= curRequired &&
          sub.id === option.id &&
          sub.pre_option === option.pre_option
            ? ++sub.quantity
            : sub.quantity,
      }));

      store.dispatch(setPreSelectStep({ order: curOrder, options: newCurrentPreSelectOptionData }));
      /* ------------------------ */

      /* update YOURS */
      const newSumYours = sum(newCurrentOptionSelected.map((el) => el.quantity));
      store.dispatch(setPickedOption({ ...curPicked, slide: slide, yours: newSumYours }));
      /* ------------ */
    };

  const handleDecreaseQuantity =
    (option: OptionQuantityProps) => (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const subOptionSelected = currentOptionSelected.some(
        (el) => el.id === option.id && el.pre_option === option.pre_option,
      );

      if (!currentOptionSelected.length || !subOptionSelected) {
        message.error('Please select option first');
        return;
      }

      const oldSumYours = sum(currentOptionSelected.map((el) => el.quantity));

      if (oldSumYours === 0) {
        return;
      }

      const newCurrentOptionSelected = cloneDeep(currentOptionSelected).map((sub) => ({
        ...sub,
        quantity:
          sub.id === option.id && sub.pre_option === option.pre_option
            ? --sub.quantity
            : sub.quantity,
      }));

      /* update current option selected */
      store.dispatch(setOptionsSelected({ order: curOrder, options: newCurrentOptionSelected }));
      /* ------------------------------ */

      /* update current data view */
      const newCurrentPreSelectOptionData = cloneDeep(currentPreSelectOptionData).map((sub) => ({
        ...sub,
        quantity:
          sub.id === option.id && sub.pre_option === option.pre_option
            ? --sub.quantity
            : sub.quantity,
      }));

      store.dispatch(setPreSelectStep({ order: curOrder, options: newCurrentPreSelectOptionData }));
      /* ------------------------ */

      /* update YOURS */
      const newSumYours = sum(newCurrentOptionSelected.map((el) => el.quantity));
      store.dispatch(setPickedOption({ ...curPicked, slide: slide, yours: newSumYours }));
      /* ------------ */
    };

  const handleCreatePreSelectStep = () => {};

  // console.log('pickedOption', pickedOption);
  // console.log('preSelectStep', preSelectStep);
  // console.log('optionsSelected', optionsSelected);

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
        disabledNextSlide={curOrder === slideBars.length}
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
                    {curPicked.yours}
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
                              style={{ cursor: sub.quantity === 0 ? 'default' : 'pointer' }}
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
