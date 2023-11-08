import { FC, useEffect, useState } from 'react';

import { message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useSelectProductSpecification } from '../../services';
import { useGetParamId, useNumber } from '@/helper/hook';
import { cloneDeep, isEmpty, omit, pick } from 'lodash';

import {
  resetAutoStepState,
  setFirstOptionSelected,
  setPartialProductDetail,
  setPartialProductSpecifiedData,
  setSlide,
} from '../../reducers';
import { AutoStepOnAttributeGroupRequest, OptionQuantityProps } from '../../types/autoStep';
import { SpecificationBodyRequest } from '@/features/project/types';
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
import { mappingOptionGroups } from './util';

interface PreSelectStepProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  updatePreSelect?: boolean;
  viewStepsDefault?: AutoStepOnAttributeGroupRequest[];
  quantitiesDefault?: any;
}

export const PreSelectStep: FC<PreSelectStepProps> = ({
  visible,
  setVisible,
  updatePreSelect,
  viewStepsDefault,
  quantitiesDefault,
}) => {
  const { allPreSelectAttributes, details } = useAppSelector((state) => state.product);
  const { specification_attribute_groups: specificationAttributeGroups } = details;

  const selectProductSpecification = useSelectProductSpecification();

  const productId = useGetParamId();
  const attributeGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);
  const currentSpecAttributeGroupId = attributeGroupId?.['specification_attribute_groups'];

  const [viewSteps, setViewSteps] = useState<any>(viewStepsDefault);
  const [tempRight, setTempRight] = useState<any>([]);

  const [forceEnableCollapse, setForceEnableCollapse] = useState<boolean>(false);

  const [quantities, setQuantities] = useState<any>(quantitiesDefault);
  const totalQuantity = useNumber(0);
  // on the left panel
  const [leftSelectedOption, setLeftSelectedOption] = useState<any>({});
  // on the right panel
  const { slideBars, slide, firstOptionSelected } = useAppSelector((state) => state.autoStep);
  // useEffect(() => {
  //   setQuantities(currentSpecification?.stepSelection?.quantities || {});
  //   setViewSteps(currentSpecification?.viewSteps || []);
  // }, [currentSpecification]);

  const setRightPannel = (id: string, pre_option: string, selectId?: string) => {
    const originRight = viewSteps[slide + 1]?.options;
    // remove select id first, filter item with index 1, add real select id then mapping quantity
    const newTempRight = originRight?.filter((item: any) => {
      return (
        item.pre_option === [pre_option, id].filter((el: string) => !isEmpty(el)).join(',') &&
        item.index === 1
      );
    });

    const addedRealSelectId = newTempRight.map((item: any) => {
      return {
        ...item,
        select_id: !selectId ? '' : `${selectId},${item.id}_${item.index}`,
      };
    });
    let totalQuantityTemp = 0;

    const rightPanelData = addedRealSelectId.map((item: any) => {
      const quantity = quantities[item.select_id] || 0;
      totalQuantityTemp += quantity;
      return {
        ...item,
        quantity,
        picked: quantity > 0,
      };
    });

    setTempRight(rightPanelData);
    totalQuantity.setValue(totalQuantityTemp);
  };
  const toRawSelectId = (selectId: string) => {
    const pos = selectId.lastIndexOf('_');
    return selectId.slice(0, pos);
  };
  const handleDuplicateWhenGoBackAndForth = (newSlide: number) => {
    return viewSteps.map((step: any, index: number) => {
      // if (index !== newSlide + 1) return step;
      let newOptions: any;
      if (index === newSlide) {
        newOptions = step.options.reduce((pre: any, cur: any) => {
          const quantity = quantities[cur.select_id];
          if (!quantity) {
            pre.push({ ...cur, picked: false });
            return pre;
          }
          for (let i = 0; i < quantity; i++) {
            const found = step.options.find((item: any) => item.index === i + 1 && i !== 0);
            if (!found)
              pre.push({
                ...cur,
                index: i + 1,
                select_id: `${toRawSelectId(cur.select_id)}_${i + 1}`,
                picked: true,
              });
          }
          return pre;
        }, []);
      } else newOptions = step.options.filter((option: any) => option.index === 1);
      return {
        ...step,
        options: newOptions,
      };
    });
  };
  useEffect(() => {
    const firstLeftOption =
      viewSteps[slide]?.options.find(
        (option: any) => option.select_id === leftSelectedOption[slide]?.select_id,
      ) || viewSteps[slide]?.options.filter((option: any) => option.picked)[0];
    const firstSlideOptionSelected =
      viewSteps[0]?.options.find(
        (option: any) => option.select_id === leftSelectedOption[0]?.select_id,
      ) ||
      viewSteps[0]?.options.filter((option: any) => option.picked)[0] ||
      viewSteps[0]?.options[0];
    store.dispatch(setFirstOptionSelected(firstSlideOptionSelected?.id));
    setLeftSelectedOption({ ...leftSelectedOption, [slide]: firstLeftOption });
    if (firstLeftOption) {
      setRightPannel(
        firstLeftOption.id || '',
        firstLeftOption.pre_option || '',
        firstLeftOption.select_id,
      );
    }
  }, [viewSteps, slide]);
  useEffect(() => {
    if (slide === 0) return;
    setViewSteps(handleDuplicateWhenGoBackAndForth(slide));
  }, []);

  const curOrder = slide + 2;

  // const curPicked = pickedOption[slide];

  const handleResetAutoStep = () => {
    store.dispatch(resetAutoStepState());
  };

  // const mappingPicked = () => {
  //   const newViewSteps = viewSteps.map((viewStep: any, index: number) => {
  //     const combinedOptions = viewStep.options.map((option: any) => {
  //       const tempSelectId: string = !option.pre_option
  //         ? `${option.id}_1`
  //         : option.pre_option
  //             .split(',')
  //             .concat(option.id)
  //             .map((selectId: string) => `${selectId}_1`)
  //             .join(',');
  //       let picked = false;
  //       if (quantities && quantities[tempSelectId] && quantities[tempSelectId] > 0) {
  //         picked = true;
  //       }
  //       const nextOptions = viewSteps[index + 1]?.options.filter(
  //         (item: any) =>
  //           item.pre_option ===
  //           (option.pre_option ? `${option.pre_option},${option.id}` : option.id),
  //       );
  //       return {
  //         ...option,
  //         index: 1,
  //         select_id: tempSelectId,
  //         picked,
  //         has_next_options: nextOptions?.length > 0,
  //         yours: option.replicate,
  //       };
  //     });
  //     return {
  //       ...viewStep,
  //       options: combinedOptions,
  //     };
  //   });
  //   // setViewSteps(newViewSteps);
  //   return newViewSteps;
  // };

  const handleForceEnableCollapse = () => {
    setForceEnableCollapse(true);

    setTimeout(() => {
      setForceEnableCollapse(false);
    }, 200);
  };

  const handleBackToPrevSlide = () => {
    const prevSlide = slide;
    const newSlide = prevSlide - 1;
    setViewSteps(handleDuplicateWhenGoBackAndForth(newSlide));
    handleForceEnableCollapse();
    store.dispatch(setSlide(newSlide));
  };

  const handleGoToNextSlide = () => {
    const prevSlide = slide;
    const newSlide = prevSlide + 1;

    if (newSlide === slideBars.length - 1) {
      return;
    }

    setViewSteps(handleDuplicateWhenGoBackAndForth(newSlide));

    /* add new slide */
    store.dispatch(setSlide(newSlide));
  };

  const handleSelectPickedOption = (e: CheckboxChangeEvent) => {
    handleForceEnableCollapse();
    const selectId = (e.target as any).select_id;
    let targetItem = selectId;
    if (slide === 0) {
      targetItem = viewSteps[slide].options.find((item: any) => item.id === e.target.value);
    } else {
      targetItem = viewSteps[slide].options.find((item: any) => item.select_id === selectId);
    }
    //
    setLeftSelectedOption({ ...leftSelectedOption, [slide]: targetItem });

    setRightPannel(e.target.value, (e.target as any).pre_option, targetItem?.select_id);
    // setOptionsSelected
    // const curOptionSelected = {
    //   id: e.target.value,
    //   pre_option: (e.target as any).pre_option,
    // };

    if (slide === 0) {
      /// only update option highlighted(not update option selected)
      store.dispatch(setFirstOptionSelected(e.target.value));
    }

    // const isPrevPickedOption =
    //   curPicked?.id === curOptionSelected.id &&
    //   curPicked?.pre_option === curOptionSelected.pre_option;

    // if (isPrevPickedOption) {
    //   return;
    // }
  };
  const setViewStepsWithQuantity = (option: any, newQuantity: number, updatedViewSteps?: any) => {
    const viewStepToHandle = updatedViewSteps || viewSteps;
    const newViewSteps = viewStepToHandle.map((step: any, index: number) => {
      if (index !== slide + 1) return step;
      const newOptions = step.options.map((item: any) => {
        if (option.select_id === item.select_id) {
          return {
            ...item,
            quantity: newQuantity,
            // picked: newQuantity !== 0,
          };
        }
        // if (leftOption && item.select_id === leftOption.select_id) {
        //   return {
        //     ...item,
        //     quantity: 1,
        //     picked: true,
        //   };
        // }
        return item;
      });
      return {
        ...step,
        options: newOptions,
      };
    });
    setViewSteps(newViewSteps);
  };
  const handleIncreaseQuantity =
    (option: OptionQuantityProps) => (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (totalQuantity.value === leftSelectedOption[slide]?.replicate) {
        message.info('Amount of quantity is equal to required');
        return;
      }
      const selectId = option.select_id || `${option.pre_option},${option.id}`;
      const newQuantity = quantities[`${selectId}`] ? quantities[`${selectId}`] + 1 : 1;

      if (slide === 0) {
        const newOptions = viewSteps[0].options.map((item) => {
          if (item.id === leftSelectedOption[0].id) {
            return {
              ...item,
              picked: true,
            };
          } else {
            return {
              ...item,
              picked: false,
            };
          }
        });
        const newStep0 = { ...viewSteps[0], options: newOptions };
        const updatedViewSteps = cloneDeep(viewSteps);
        updatedViewSteps[0] = newStep0;
        setViewStepsWithQuantity(option, newQuantity, updatedViewSteps);
        const keptKey = Object.keys(quantities).filter((key) =>
          key.startsWith(leftSelectedOption[slide].id),
        );
        const updatedQuantity = pick(quantities, keptKey);
        setQuantities({
          ...updatedQuantity,
          [`${selectId}`]: newQuantity,
        });
        return;
      } else {
        setQuantities({
          ...quantities,
          [`${selectId}`]: newQuantity,
        });
      }
      setViewStepsWithQuantity(option, newQuantity);

      //
    };

  const handleDecreaseQuantity =
    (option: OptionQuantityProps) => (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      e.preventDefault();
      const selectId = option.select_id || `${option.pre_option},${option.id}`;
      const newQuantity =
        quantities[`${selectId}`] && quantities[`${selectId}`] > 0
          ? quantities[`${selectId}`] - 1
          : 0;
      const quantitiesUpdate = Object.keys(quantities).filter((key) =>
        key.startsWith(`${selectId.slice(0, -1)}${newQuantity + 1}`),
      );
      const newQuantities = {
        ...omit(quantities, quantitiesUpdate),
        [`${selectId}`]: newQuantity,
      };
      setQuantities(newQuantities);
      setViewStepsWithQuantity(option, newQuantity);
    };
  const handleCloseModel = () => {
    const newViewSteps = viewSteps.map((step: any) => {
      const newOptions = step.options.filter((option: any) => option.index === 1);
      return {
        ...step,
        options: newOptions,
      };
    });
    setViewSteps(newViewSteps);
    setVisible(false);
  };
  const validateQuantities = (data: any, specificationSteps: any[]) => {
    const selectIds = Object.keys(data);
    const combinedOptionQuantity = selectIds.reduce((pre: any, selectId: string) => {
      const parts = selectId.split(',');
      // if (parts.length === 1) return pre;
      const destination = parts[parts.length - 1];
      const optionId = destination.split('_')[0];
      const quantity = data[selectId];
      return quantity > 0
        ? {
            ...pre,
            [optionId]: {
              quantity: pre[optionId] ? pre[optionId].quantity + quantity : quantity,
              pre_option: parts
                .slice(0, parts.length - 1)
                .map((item: string) => item.split('_')[0])
                .join(','),
              select_id: selectId,
            },
          }
        : pre;
    }, {});

    const optionIds = Object.keys(combinedOptionQuantity);
    const mappedQuantities = optionIds.map((optionId) => {
      return {
        id: optionId,
        quantity: combinedOptionQuantity[optionId].quantity,
        pre_option: combinedOptionQuantity[optionId].pre_option,
        select_id: combinedOptionQuantity[optionId].select_id,
      };
    });
    let check = true;
    const flatSpecificationOptions = specificationSteps.reduce((pre: any, cur: any) => {
      return pre.concat(cur.options);
    }, []);

    mappedQuantities.forEach((mappedQuantity) => {
      const optionId = mappedQuantity.id.split('_')[0];

      const currentOption = flatSpecificationOptions.find(
        (item: any) =>
          item.id === optionId &&
          _.isEmpty(
            mappedQuantity.pre_option ? item.pre_option === mappedQuantity.pre_option : true,
          ),
      );
      const nextOptions = flatSpecificationOptions.filter(
        (item: any) =>
          item.pre_option ===
          (mappedQuantity.pre_option ? `${mappedQuantity.pre_option},${optionId}` : optionId),
      );
      const yours = mappedQuantities.reduce((pre: number, cur: any) => {
        if (
          cur.select_id.includes(mappedQuantity.id) &&
          cur.select_id.split(',').length - mappedQuantity.select_id.split(',').length === 1
        )
          return pre + cur.quantity;
        return pre;
      }, 0);

      if (!currentOption) check = false;

      if (
        currentOption &&
        yours !== 0 &&
        yours % currentOption.replicate !== 0 &&
        nextOptions.length !== 0
      )
        check = false;
    });
    return check;
  };

  const handleCreatePreSelectStep = async () => {
    const quantitiesUpdate = Object.keys(quantities).filter((key) =>
      key.startsWith(firstOptionSelected),
    );
    const newQuantities = {
      ...pick(quantities, quantitiesUpdate),
      [`${firstOptionSelected}_1`]: 1,
    };
    if (!validateQuantities(newQuantities, viewSteps)) {
      message.error('error');
      return;
    }

    /* checking all options selected has amount of YOURS equal to its REQUIRED */

    // if (inValidOption && stepError !== -1) {
    //   message.error(`YOURS in step ${stepError} is not equal to REQUIRED`);
    //   return;
    // }
    /* -------------------------------------------------------------------- */
    const newAllPreSelectAttributes = allPreSelectAttributes.filter(
      (el) => el.id !== currentSpecAttributeGroupId,
    );

    const newAttributeGroups = newAllPreSelectAttributes.concat({
      id: currentSpecAttributeGroupId as string,
      step_selections: newQuantities,
      /// default each attribute group has attributes property is empty array
      attributes: [],
    });
    /// save steps to specification attribute group
    store.dispatch(
      setPartialProductDetail({
        specification_attribute_groups: [...specificationAttributeGroups].map((el) =>
          el.id === currentSpecAttributeGroupId
            ? {
                ...el,
                viewSteps,
                isChecked: true,
                stepSelection: { ...el.stepSelection, quantities: newQuantities },
              }
            : el,
        ),
      }),
    );

    const newSpecfication: SpecificationBodyRequest = {
      is_refer_document: false,
      attribute_groups: newAttributeGroups,
    };

    if (!updatePreSelect) {
      /// save steps to specfified specification attribute group
      store.dispatch(
        setPartialProductSpecifiedData({
          specification: newSpecfication,
        }),
      );

      /// close modal
      handleCloseModel();

      return;
    }
    /// update pre-select steps
    const isUpdateSuccess = await selectProductSpecification(productId, {
      specification: newSpecfication,
    });

    /// close modal
    handleCloseModel();

    if (isUpdateSuccess) {
      message.success('Created pre-select step successfully');
    }
  };

  //-------------------------------------------------------------------------//

  const tempLeft = viewSteps[slide]?.options;
  const currentLeft = slide === 0 ? tempLeft : tempLeft?.filter((item: any) => item.picked);
  const mappedLeft = mappingOptionGroups(currentLeft);
  const mappedRight = mappingOptionGroups(tempRight);

  return (
    <CustomModal
      title={
        <MainTitle level={3} style={{ textTransform: 'uppercase' }}>
          FOLLOW THE STEPS
        </MainTitle>
      }
      secondaryModal
      visible={visible}
      onCancel={() => {
        handleCloseModel();
      }}
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
        disabledNextSlide={
          curOrder === slideBars.length ||
          leftSelectedOption[slide]?.replicate !== totalQuantity.value
        }
      />

      <div className={styles.mainContent}>
        {/* left side */}
        <div className={styles.content} style={{ marginRight: 8 }}>
          {mappedLeft.map((pickedSub, optIdx) => {
            return (
              <CheckboxDynamic
                key={optIdx}
                isCheckbox={slide !== 0}
                isRadio={slide === 0}
                selected={[{ label: '', value: leftSelectedOption[slide]?.id || '' }]}
                chosenItems={pickedSub.subs
                  .filter((item: any) => {
                    const keys = Object.keys(quantities).filter((key) =>
                      key.startsWith(`${item.select_id},`),
                    );
                    let count = 0;
                    keys.forEach((key) => {
                      count += quantities[key];
                    });
                    return count > 0;
                  })
                  .map((item: any) => {
                    return {
                      label: '',
                      value: item?.select_id || '',
                    };
                  })}
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
                  options: pickedSub.subs?.map((option: any, subIdx: number) => ({
                    disabled: !option.has_next_options,
                    // replicate: option.replicate,
                    pre_option: option.pre_option,
                    select_id: option.select_id,
                    value: option.id,
                    picked: option.picked,
                    label: (
                      <div
                        className={`flex-between w-full ${
                          (slide === 0 &&
                            option.select_id === leftSelectedOption[slide]?.select_id) ||
                          (slide !== 0 &&
                            option.picked &&
                            option.select_id === leftSelectedOption[slide]?.select_id &&
                            option.has_next_options)
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
          {!mappedRight.length ? (
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
                    {leftSelectedOption[slide]?.replicate ?? 'N/A'}
                  </BodyText>
                  <BodyText level={3} fontFamily="Cormorant-Garamond">
                    Yours
                  </BodyText>
                  <BodyText
                    level={5}
                    fontFamily="Roboto"
                    style={{ fontWeight: 500, marginLeft: 8 }}
                  >
                    {totalQuantity.value ?? 'N/A'}
                  </BodyText>
                </div>
              </div>

              <DropdownCheckboxList
                customClass="checkbox-item"
                combinable
                canActiveMultiKey
                showCollapseIcon
                showCount={false}
                selected={tempRight
                  .filter((el: any) => el.picked)
                  .map((el: any) => ({ label: '', value: el.id }))}
                forceEnableCollapse={forceEnableCollapse}
                renderTitle={(data) => data.label}
                data={mappedRight.map((option) => ({
                  label: option.name,
                  id: option.id,

                  options: option.subs?.map((sub: any, subIdx: number) => ({
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
