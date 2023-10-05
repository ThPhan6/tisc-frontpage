import { FC, useEffect, useState } from 'react';

import { message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useSelectProductSpecification } from '../../services';
import { useGetParamId } from '@/helper/hook';
import { uniqueArrayBy } from '@/helper/utils';
import {
  cloneDeep,
  flatMap,
  forEach,
  groupBy,
  isNull,
  isUndefined,
  map,
  sum,
  trimEnd,
} from 'lodash';

import {
  resetAutoStepState,
  setOptionsSelected,
  setPartialProductDetail,
  setPickedOption,
  setPreSelectStep,
  setSlide,
} from '../../reducers';
import {
  AutoStepOnAttributeGroupResponse,
  AutoStepPreSelectOptionProps,
  OptionQuantityProps,
} from '../../types/autoStep';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import { SpecificationBodyRequest, SpecificationPreSelectStep } from '@/features/project/types';
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
import { getIDFromPreOption, getPickedOptionGroup } from './util';

interface PreSelectStepProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const PreSelectStep: FC<PreSelectStepProps> = ({ visible, setVisible }) => {
  const { allPreSelectAttributes, details } = useAppSelector((state) => state.product);
  const { specification_attribute_groups: specificationAttributeGroups } = details;
  const selectProductSpecification = useSelectProductSpecification();

  const productId = useGetParamId();
  const attributeGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);
  const currentSpecAttributeGroupId = attributeGroupId?.['specification_attribute_groups'];

  const [firstOptionSelected, setFirstOptionSelected] = useState<string>('');

  const [forceEnableCollapse, setForceEnableCollapse] = useState<boolean>(false);

  const [newLeftPanelData, setNewLeftPanelData] = useState<AutoStepPreSelectOptionProps[]>([]);

  const { slideBars, slide, step, stepData, preSelectStep, pickedOption, optionsSelected } =
    useAppSelector((state) => state.autoStep);

  const curOrder = slide + 2;
  const curPicked = pickedOption[slide];
  const currentPreSelectOptionData = preSelectStep?.[curOrder]?.options ?? [];
  const currentOptionSelected =
    (optionsSelected?.[curOrder]?.options as unknown as OptionQuantityProps[]) ?? [];

  const leftPanelData =
    slide === 0 && preSelectStep[1]
      ? (getPickedOptionGroup(
          preSelectStep[1]?.options,
        ) as unknown as AutoStepPreSelectOptionProps[]) ?? []
      : newLeftPanelData;

  const rightPanelData = getPickedOptionGroup(
    currentPreSelectOptionData,
  ) as AutoStepPreSelectOptionProps[];

  /* set sub option ticked on the left panel  */
  const subOptionLeft = flatMap(leftPanelData.map((el) => el.subs));

  const currentSubPickedOptionSelected: CheckboxValue[] = subOptionLeft
    .filter((opt) =>
      currentOptionSelected.some((sub) => {
        const { optionId, preOptionId } = getIDFromPreOption(sub.pre_option);

        return preOptionId
          ? opt.pre_option === preOptionId && opt.id === optionId && sub.quantity > 0
          : sub.pre_option === opt.id && sub.quantity > 0;
      }),
    )
    .map((el) => ({ label: el.pre_option, value: el.id }));
  /* ---------------------------------------- */

  /* set sub option ticked on the right panel  */
  const currentSubLinkedOptionSelected: CheckboxValue[] = currentOptionSelected
    .filter((el) =>
      currentPreSelectOptionData.some(
        (opt) => opt.id === el.id && opt.pre_option === el.pre_option && el.quantity > 0,
      ),
    )
    .map((el) => ({ label: el.pre_option, value: el.id }));
  /* ---------------------------------------- */

  const handleResetAutoStep = () => {
    store.dispatch(resetAutoStepState());
    setNewLeftPanelData([]);
    setFirstOptionSelected('');
  };

  const handleForceEnableCollapse = () => {
    setForceEnableCollapse(true);

    setTimeout(() => {
      setForceEnableCollapse(false);
    }, 200);
  };

  useEffect(() => {
    if (isUndefined(step) || isNull(step) || typeof step !== 'number') {
      return;
    }

    store.dispatch(setSlide(step));
    handleForceEnableCollapse();

    const newLeftData = getPickedOptionGroup(
      optionsSelected[step === 0 ? 1 : step + 1].options,
    ) as unknown as AutoStepPreSelectOptionProps[];

    setNewLeftPanelData(newLeftData);

    if (pickedOption[0]) {
      setFirstOptionSelected(pickedOption[0].id);
    }
  }, [step]);

  useEffect(() => {
    return () => {
      handleResetAutoStep();
      setFirstOptionSelected('');
    };
  }, []);

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
    const newOrder = newSlide + 1;

    /* last step */
    if (newSlide === slideBars.length - 1) {
      return;
    }

    /* checking amount of yours is equal to required before go to next slide */
    let invalidAmountYours = false;
    let optionNameTicked = '';

    (optionsSelected[newOrder - 1].options as OptionQuantityProps[]).forEach((opt) => {
      if (invalidAmountYours) {
        return;
      }

      const allSubSelected: OptionQuantityProps[] = [];

      (optionsSelected[newOrder].options as OptionQuantityProps[]).forEach((el) => {
        const { optionId, preOptionId } = getIDFromPreOption(opt.pre_option);

        if (
          prevSlide === 0
            ? opt.id === optionId
            : opt.id === optionId && opt.pre_option === preOptionId
        ) {
          allSubSelected.push(el);
        }
      });

      const curSumYours = allSubSelected.length ? sum(allSubSelected.map((el) => el.quantity)) : -1;

      if (curSumYours !== -1 && (curSumYours < opt.replicate || curSumYours > opt.replicate)) {
        optionNameTicked = trimEnd(
          `${opt.value_1} ${opt.value_2} ${
            opt.unit_1 || opt.unit_2 ? `- ${opt.unit_1} ${opt.unit_2}` : ''
          }`,
        );

        invalidAmountYours = true;
      }
    });

    if (invalidAmountYours) {
      message.error(`Amount of yours must equal to ${optionNameTicked}'s required `);
      return;
    }
    /* --------------------------------------------------------------------- */

    if (!currentOptionSelected.length) {
      message.error('Please select options');
      return;
    }

    handleForceEnableCollapse();

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

    if (slide === 0) {
      setFirstOptionSelected(e.target.value);
    }

    const isPrevPickedOption =
      curPicked?.id === curOptionSelected.id &&
      curPicked?.pre_option === curOptionSelected.pre_option;

    if (isPrevPickedOption) {
      return;
    }

    /// make quantity equal to required before select other option
    if (
      curOrder > 2 &&
      curPicked?.replicate &&
      currentOptionSelected.length &&
      rightPanelData.length
    ) {
      const curRequired = curPicked.replicate;

      const currentOptionChosen = currentOptionSelected.filter((el) => {
        const { optionId, preOptionId } = getIDFromPreOption(el.pre_option);

        return slide !== 0
          ? optionId === curPicked.id && preOptionId === curPicked.pre_option
          : el.pre_option === curPicked.id;
      });

      const curSumYours = sum(currentOptionChosen.map((el) => el.quantity));

      if (currentOptionChosen.length && curSumYours < curRequired) {
        message.error('Please make your selection equal to required');
        return;
      }
    }

    const curPickedSubData =
      slide === 0 ? preSelectStep?.[1]?.options ?? [] : flatMap(leftPanelData.map((el) => el.subs));

    const curPickedOption = curPickedSubData.find(
      (el) => el.id === curOptionSelected.id && el.pre_option === curOptionSelected.pre_option,
    );

    const stepDataClone = cloneDeep(stepData);

    /// set data view on the right panel
    const newRightPanelData = stepDataClone[curOrder].options.filter((sub) => {
      const { optionId, preOptionId } = getIDFromPreOption(sub.pre_option);

      return preOptionId
        ? optionId === curOptionSelected.id && preOptionId === curOptionSelected.pre_option
        : sub.pre_option === curOptionSelected.id;
    });

    /// mapping quantity
    const finalNewRightPanelData = newRightPanelData.map((el) => {
      const optSelected = currentOptionSelected.find(
        (opt) => opt.id === el.id && opt.pre_option === el.pre_option,
      );

      return optSelected ? { ...el, quantity: optSelected.quantity } : { ...el, quantity: 0 };
    });

    /// update current option hightlighted
    if (curPickedOption?.id) {
      store.dispatch(
        setPickedOption({
          slide: slide,
          id: curPickedOption.id,
          pre_option: curPickedOption?.pre_option,
          replicate: curPickedOption.replicate,
          yours: sum(finalNewRightPanelData.map((el) => el.quantity)),
        }),
      );
    }

    /// update next data view on the right side
    store.dispatch(setPreSelectStep({ order: curOrder, options: finalNewRightPanelData }));
  };

  /// handle option following
  const handleNextOptions = (newOptionsSelected: OptionQuantityProps[]) => {
    if (!optionsSelected[curOrder + 1]) {
      return;
    }

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

      store.dispatch(
        setOptionsSelected({
          ...stepData[curOrder],
          order: optIndex,
          options: newNextOptionSelected,
        }),
      );

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
  };

  const handleIncreaseQuantity =
    (option: OptionQuantityProps) => (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const stepDataClone = cloneDeep(stepData);

      let currentOptionSelectedClone = cloneDeep(currentOptionSelected);

      if (!currentOptionSelectedClone.length) {
        if (slide === 0) {
          const currentOptionTicked = stepDataClone[1].options.find(
            (el) => el.id === option.pre_option,
          );

          store.dispatch(
            setOptionsSelected({
              id: stepDataClone[1].id,
              order: 1,
              options: currentOptionTicked ? [currentOptionTicked] : [],
            }),
          );
        }

        const newOptions = [option].map((el) => ({ ...el, quantity: 1 }));

        /* update current option selected */
        store.dispatch(
          setOptionsSelected({
            id: stepDataClone[curOrder].id,
            order: curOrder,
            options: newOptions,
          }),
        );
        /* ------------------------------ */

        /* update current data view */
        const newCurrentPreSelectOptionData = cloneDeep(currentPreSelectOptionData).map((sub) => ({
          ...sub,
          quantity: sub.id === option.id && sub.pre_option === option.pre_option ? 1 : sub.quantity,
        }));

        store.dispatch(
          setPreSelectStep({ order: curOrder, options: newCurrentPreSelectOptionData }),
        );
        /* ------------------------- */

        const newSumYours = sum(
          newOptions
            .filter((el) => {
              const { optionId, preOptionId } = getIDFromPreOption(el.pre_option);

              return preOptionId
                ? optionId === curPicked.id && preOptionId === curPicked.pre_option
                : optionId === curPicked.id;
            })
            .map((el) => el.quantity),
        );

        /* update YOURS of prev step */
        store.dispatch(
          setPreSelectStep({
            order: curOrder - 1,
            options: preSelectStep[curOrder - 1].options.map((el) => {
              const { optionId, preOptionId } = getIDFromPreOption(option.pre_option);

              if (
                slide === 0
                  ? el.id === option.pre_option
                  : optionId === el.id && preOptionId === el.pre_option
              ) {
                return { ...el, yours: newSumYours };
              }

              return el;
            }),
          }),
        );
        /* ------------------------ */

        /* update YOURS of current option picked */
        store.dispatch(setPickedOption({ ...curPicked, slide: slide, yours: newSumYours }));
        /* ------------------------------------- */

        return;
      }

      ///
      if (
        slide === 0 &&
        currentOptionSelectedClone.length &&
        option.pre_option !== currentOptionSelectedClone[0].pre_option
      ) {
        currentOptionSelectedClone = [];
      }

      const curRequired = curPicked.replicate as number;
      const oldSumYours = sum(
        currentOptionSelectedClone
          .filter((el) => {
            const { optionId, preOptionId } = getIDFromPreOption(el.pre_option);

            return preOptionId
              ? optionId === curPicked.id && preOptionId === curPicked.pre_option
              : optionId === curPicked.id;
          })
          .map((el) => el.quantity),
      );

      if (oldSumYours >= curRequired) {
        message.info('Amount of quantity is equal to required');
        return;
      }

      /* mapping quantity */
      const newStepData = stepDataClone[curOrder].options.map((el) => {
        const optFound = currentOptionSelectedClone.find(
          (opt) => opt.id === el.id && opt.pre_option === el.pre_option,
        );

        if (optFound) {
          return { ...el, quantity: optFound.quantity };
        }

        return el;
      });
      /* -------------- */

      let newCurrentOptionSelected = newStepData
        .map((sub) => ({
          ...sub,
          quantity:
            sub.quantity <= curRequired &&
            sub.id === option.id &&
            sub.pre_option === option.pre_option
              ? ++sub.quantity
              : sub.quantity,
        }))
        .filter((el) => el.quantity > 0);

      newCurrentOptionSelected = uniqueArrayBy(
        newCurrentOptionSelected.concat(currentOptionSelectedClone),
        ['id', 'pre_option'],
      );

      /* save option ticked on first step */
      if (slide === 0) {
        newCurrentOptionSelected = newCurrentOptionSelected.filter(
          (el) => el.pre_option === curPicked.id,
        );

        const currentOptionTicked = stepDataClone[1].options.find(
          (el) => el.id === option.pre_option,
        );

        store.dispatch(
          setOptionsSelected({
            id: stepDataClone[1].id,
            order: 1,
            options: currentOptionTicked ? [currentOptionTicked] : [],
          }),
        );
      }

      /* update current option selected */
      store.dispatch(
        setOptionsSelected({
          id: stepDataClone[curOrder].id,
          order: curOrder,
          options: newCurrentOptionSelected,
        }),
      );
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

      const newSumYours = sum(
        newCurrentOptionSelected
          .filter((el) => {
            const { optionId, preOptionId } = getIDFromPreOption(el.pre_option);

            return preOptionId
              ? optionId === curPicked.id && preOptionId === curPicked.pre_option
              : optionId === curPicked.id;
          })
          .map((el) => el.quantity),
      );

      // update YOURS of prev step
      store.dispatch(
        setPreSelectStep({
          order: curOrder - 1,
          options: preSelectStep[curOrder - 1].options.map((el) => {
            const { optionId, preOptionId } = getIDFromPreOption(option.pre_option);

            if (
              slide === 0
                ? el.id === option.pre_option
                : optionId === el.id && preOptionId === el.pre_option
            ) {
              return { ...el, yours: newSumYours };
            }

            return el;
          }),
        }),
      );
      /* ------------------------ */

      /* update YOURS of current option picked*/
      store.dispatch(setPickedOption({ ...curPicked, slide: slide, yours: newSumYours }));
      /* ------------ */
    };

  const handleDecreaseQuantity =
    (option: OptionQuantityProps) => (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const currentOptionSelectedClone = cloneDeep(currentOptionSelected);

      const oldSumYours = sum(
        currentOptionSelectedClone.map((sub) =>
          sub.id === option.id && sub.pre_option === option.pre_option ? sub.quantity : 0,
        ),
      );

      if (oldSumYours === 0) {
        return;
      }

      const stepDataClone = cloneDeep(stepData);

      /* mapping quantity */
      const newStepData = stepDataClone[curOrder].options.map((el) => {
        const optFound = currentOptionSelectedClone.find(
          (opt) => opt.id === el.id && opt.pre_option === el.pre_option,
        );

        if (optFound) {
          return { ...el, quantity: optFound.quantity };
        }

        return el;
      });
      /* ---------------- */

      const newCurrentOptionSelected = newStepData
        .map((sub) => ({
          ...sub,
          quantity:
            sub.quantity > 0 && sub.id === option.id && sub.pre_option === option.pre_option
              ? --sub.quantity
              : sub.quantity,
        }))
        .filter((el) => el.quantity > 0);

      /* update current option selected */

      if (slide === 0) {
        const optionSelected = stepDataClone[1].options.find((el) => el.id === curPicked.id);

        store.dispatch(
          setOptionsSelected({
            id: stepDataClone[1].id,
            order: 1,
            options: optionSelected ? [optionSelected] : [],
          }),
        );
      }

      store.dispatch(
        setOptionsSelected({
          id: stepDataClone[curOrder].id,
          order: curOrder,
          options: newCurrentOptionSelected,
        }),
      );
      /* ------------------------------ */

      /* handle option following if have */
      handleNextOptions(newCurrentOptionSelected);
      /* --------------------------- */

      /* update current data view */
      const newCurrentPreSelectOptionData = cloneDeep(currentPreSelectOptionData).map((sub) => ({
        ...sub,
        quantity:
          sub.quantity > 0 && sub.id === option.id && sub.pre_option === option.pre_option
            ? --sub.quantity
            : sub.quantity,
      }));

      store.dispatch(setPreSelectStep({ order: curOrder, options: newCurrentPreSelectOptionData }));

      const newSumYours = sum(
        newCurrentOptionSelected
          .filter((el) => {
            const { optionId, preOptionId } = getIDFromPreOption(el.pre_option);

            return preOptionId
              ? optionId === curPicked.id && preOptionId === curPicked.pre_option
              : optionId === curPicked.id;
          })
          .map((el) => el.quantity),
      );

      /// update YOURS of prev step
      store.dispatch(
        setPreSelectStep({
          order: curOrder - 1,
          options: preSelectStep[curOrder - 1].options.map((el) => ({
            ...el,
            yours:
              el.id === curPicked.id && el.pre_option === curPicked.pre_option
                ? newSumYours
                : el.yours,
          })),
        }),
      );
      /* ------------------------ */

      /* update YOURS of current option picked*/
      store.dispatch(setPickedOption({ ...curPicked, slide: slide, yours: newSumYours }));
      /* ------------------------------------ */
    };

  const handleCreatePreSelectStep = () => {
    let inValidOption = false;

    const stepDataClone = cloneDeep(stepData);
    const optionsSelectedClone = cloneDeep(optionsSelected);

    const allOptionSelected: {
      id: string | undefined;
      order: number;
      options: OptionQuantityProps[];
    }[] = Object.values(optionsSelectedClone);

    const noneOptionSelected = allOptionSelected.every((el) => !el.options.length);

    if (noneOptionSelected) {
      message.error('Please select options');
      return;
    }

    /* checking all options selected has amount of YOURS equal to its REQUIRED */
    forEach(optionsSelectedClone, (optionData, order: string) => {
      if (inValidOption || Number(order) < 2 || !optionData.options.length) {
        return;
      }

      if ((optionData.options as unknown as OptionQuantityProps[]).some((el) => el.quantity <= 0)) {
        inValidOption = true;
        return;
      }

      const prevOptions = optionsSelected[curOrder - 1].options;

      const curOptions = groupBy(
        optionData.options,
        (o) => o.pre_option,
      ) as unknown as OptionQuantityProps[];

      const keys = Object.keys(curOptions);

      keys.forEach((key) => {
        if (inValidOption) {
          return;
        }

        const { optionId, preOptionId } = getIDFromPreOption(key);

        const curQuantity = sum(
          flatMap(Object.values(curOptions[key])).map((el: any) => el.quantity),
        );

        prevOptions.forEach((prevOpt) => {
          if (inValidOption) {
            return;
          }

          if (
            curOrder === 2
              ? prevOpt.id === optionId
              : prevOpt.id === optionId && prevOpt.pre_option === preOptionId
          ) {
            if (curQuantity < prevOpt.replicate) {
              inValidOption = true;
            }
          }
        });
      });
    });

    if (inValidOption) {
      message.error("Some of the options's amounts YOURS selected aren't equal to required");
      return;
    }
    /* -------------------------------------------------------------------- */

    let newSteps: AutoStepOnAttributeGroupResponse[] = [];

    forEach(stepDataClone, (optionData, order: string) => {
      const newStepData = optionData.options.map((el) => {
        const optFound = (
          optionsSelectedClone[Number(order)].options as OptionQuantityProps[]
        ).find((opt) =>
          Number(order) === 1
            ? opt.id === el.id
            : opt.id === el.id && opt.pre_option === el.pre_option,
        );

        if (optFound) {
          return { ...el, quantity: Number(order) === 1 ? 1 : optFound.quantity };
        }

        return el;
      });

      newSteps = newSteps.concat({ ...optionData, options: newStepData });
    });

    /// save steps to specification attribute group
    store.dispatch(
      setPartialProductDetail({
        specification_attribute_groups: [...specificationAttributeGroups].map((el) =>
          el.id === currentSpecAttributeGroupId ? { ...el, steps: newSteps, isChecked: true } : el,
        ),
      }),
    );

    const stepPayload: SpecificationPreSelectStep[] = allOptionSelected
      .filter((el) => el.options.length !== 0)
      .map((el) => ({
        step_id: el.id as string,
        options: el.options.map((opt) => ({
          id: opt.id,
          /* option selected in 1st step(origin) has default quantity is 1 */
          quantity: el.order === 1 ? 1 : opt.quantity,
          pre_option: opt.pre_option,
        })),
      }));

    const newAllPreSelectAttributes = allPreSelectAttributes.filter(
      (el) => el.id !== currentSpecAttributeGroupId,
    );

    const newAttributeGroups = newAllPreSelectAttributes.concat({
      id: currentSpecAttributeGroupId as string,
      configuration_steps: stepPayload,
    });

    const newSpecfication: SpecificationBodyRequest = {
      is_refer_document: false,
      attribute_groups: newAttributeGroups,
    };

    /// update pre-select steps
    selectProductSpecification(productId, { specification: newSpecfication });

    /// close modal
    setVisible(false);
  };

  // console.log('pickedOption', pickedOption);
  // console.log('preSelectStep', preSelectStep);
  // console.log('stepData', stepData);
  // console.log('optionsSelected', optionsSelected);
  // console.log('firstOptionSelected', firstOptionSelected);

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
                isCheckbox={slide !== 0}
                isRadio={slide === 0}
                selected={[{ label: '', value: firstOptionSelected }]}
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
                    // replicate: option.replicate,
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
            <EmptyOne isCenter />
          ) : (
            <div className={styles.linkedContent}>
              <div className={`flex-end header`}>
                {/* <BodyText level={5} fontFamily="Roboto" style={{ textTransform: 'capitalize' }}>
                  {slideBars[slide + 1]}
                </BodyText> */}

                <div className="flex-start">
                  <BodyText level={3} fontFamily="Cormorant-Garamond">
                    Required
                  </BodyText>
                  <BodyText
                    level={5}
                    fontFamily="Roboto"
                    style={{ fontWeight: 500, margin: '0 16px 0 8px' }}
                  >
                    {curPicked?.replicate ?? 'N/A'}
                  </BodyText>
                  <BodyText level={3} fontFamily="Cormorant-Garamond">
                    Yours
                  </BodyText>
                  <BodyText
                    level={5}
                    fontFamily="Roboto"
                    style={{ fontWeight: 500, marginLeft: 8 }}
                  >
                    {curPicked?.yours ?? 'N/A'}
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
                            customClass="quantity-label"
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
                              customClass="amount-quantity"
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
