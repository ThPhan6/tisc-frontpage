import { FC, useEffect, useState } from 'react';

import { message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { useSelectProductSpecification } from '../../services';
import { useGetParamId } from '@/helper/hook';
import { cloneDeep, flatMap, groupBy, isEmpty, map, sum } from 'lodash';

import {
  resetAutoStepState,
  setFirstOptionSelected,
  setPartialProductDetail,
  setPartialProductSpecifiedData,
  setSlide,
} from '../../reducers';
import { AutoStepOnAttributeGroupResponse, OptionQuantityProps } from '../../types/autoStep';
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
import { getIDFromPreOption, mappingOptionGroups } from './util';

interface PreSelectStepProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  updatePreSelect?: boolean;
}

export const PreSelectStep: FC<PreSelectStepProps> = ({ visible, setVisible, updatePreSelect }) => {
  const { allPreSelectAttributes, details } = useAppSelector((state) => state.product);
  const { specification_attribute_groups: specificationAttributeGroups } = details;

  const selectProductSpecification = useSelectProductSpecification();

  const productId = useGetParamId();
  const attributeGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);
  const currentSpecAttributeGroupId = attributeGroupId?.['specification_attribute_groups'];
  const currentSpecification = specificationAttributeGroups.find(
    (item) => item.id === currentSpecAttributeGroupId,
  );
  const [viewSteps, setViewSteps] = useState<any>([]);
  const [tempRight, setTempRight] = useState<any>([]);

  const [forceEnableCollapse, setForceEnableCollapse] = useState<boolean>(false);

  const [quantities, setQuantities] = useState<any>({});

  const { slideBars, slide, stepData, pickedOption, optionsSelected, firstOptionSelected } =
    useAppSelector((state) => state.autoStep);
  useEffect(() => {
    setQuantities({
      'bf778a90-1e49-437b-bd4b-b199d8cd5de4_1,13681d09-4b1c-4db8-9915-3ac0bc33dae2_1': 3,
      'bf778a90-1e49-437b-bd4b-b199d8cd5de4_1,9a681106-c779-4fcd-9566-3e47b40229e7_1': 2,
      'bf778a90-1e49-437b-bd4b-b199d8cd5de4_1,d1581fe9-2a0a-4bcc-8b1c-f19e114dda83_1': 1,
      'bf778a90-1e49-437b-bd4b-b199d8cd5de4_1,13681d09-4b1c-4db8-9915-3ac0bc33dae2_1,951af4d9-7fab-4885-903b-ef165859d90a_1': 1,
      'bf778a90-1e49-437b-bd4b-b199d8cd5de4_1,13681d09-4b1c-4db8-9915-3ac0bc33dae2_1,f2c565af-bab4-4bd5-87d9-d46c7097c4ce_1': 1,
    });
    setViewSteps(currentSpecification?.viewSteps || []);
  }, [currentSpecification]);
  useEffect(() => {
    console.log(quantities);
  }, [quantities]);

  const setRightPannel = (id: string, pre_option: string, selectId?: string) => {
    console.log(selectId);
    const originRight = viewSteps[slide + 1]?.options;
    // remove select id first, filter item with index 1, add real select id then mapping quantity
    const newTempRight = originRight?.filter((item: any) => {
      return (
        item.pre_option === [pre_option, id].filter((el: string) => !isEmpty(el)).join(',') &&
        item.index === 1
      );
    });

    console.log(newTempRight);
    const addedRealSelectId = newTempRight.map((item: any) => {
      return {
        ...item,
        select_id: !selectId ? '' : `${selectId},${item.id}_${item.index}`,
      };
    });
    setTempRight(
      addedRealSelectId.map((item: any) => {
        const quantity = quantities[item.select_id] || 0;
        return {
          ...item,
          quantity,
        };
      }),
    );
  };
  useEffect(() => {
    const firstLeftOption = viewSteps[slide]?.options[0];
    if (firstLeftOption) {
      setRightPannel(
        firstLeftOption.id || '',
        firstLeftOption.pre_option || '',
        firstLeftOption.select_id,
      );
    }
  }, [viewSteps, slide]);
  const curOrder = slide + 2;
  const curPicked = pickedOption[slide];
  const handleResetAutoStep = () => {
    store.dispatch(resetAutoStepState());
  };

  const handleForceEnableCollapse = () => {
    setForceEnableCollapse(true);

    setTimeout(() => {
      setForceEnableCollapse(false);
    }, 200);
  };

  const handleBackToPrevSlide = () => {
    const prevSlide = slide;
    const newSlide = prevSlide - 1;

    const newViewSteps = viewSteps.map((step: any, index: number) => {
      if (index !== newSlide + 1) return step;
      const newOptions = step.options.filter((option: any) => option.index === 1);
      return {
        ...step,
        options: newOptions,
      };
    });
    setViewSteps(newViewSteps);
    handleForceEnableCollapse();

    store.dispatch(setSlide(newSlide));
  };
  const toRawSelectId = (selectId: string) => {
    const pos = selectId.lastIndexOf('_');
    return selectId.slice(0, pos);
  };
  const handleGoToNextSlide = () => {
    const prevSlide = slide;
    const newSlide = prevSlide + 1;

    if (newSlide === slideBars.length - 1) {
      return;
    }
    const newViewSteps = viewSteps.map((step: any, index: number) => {
      if (index !== newSlide) return step;
      console.log(step.options);
      const newOptions = step.options.reduce((pre: any, cur: any) => {
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

      console.log(newOptions);
      return {
        ...step,
        options: newOptions,
      };
    });
    setViewSteps(newViewSteps);
    // if (!currentOptionSelected.length) {
    //   message.error('Please select options');
    //   return;
    // }

    /* add new slide */
    store.dispatch(setSlide(newSlide));
  };

  const handleSelectPickedOption = (e: CheckboxChangeEvent) => {
    console.log(e.target as any);
    handleForceEnableCollapse();
    let selectId = (e.target as any).select_id;
    if (slide === 0) {
      const targetItem = viewSteps[0].options.find((item: any) => item.id === e.target.value);
      selectId = targetItem.select_id;
    }
    setRightPannel(e.target.value, (e.target as any).pre_option, selectId);

    const curOptionSelected = {
      id: e.target.value,
      pre_option: (e.target as any).pre_option,
    };

    if (slide === 0) {
      /// only update option highlighted(not update option selected)
      store.dispatch(setFirstOptionSelected(e.target.value));
    }

    const isPrevPickedOption =
      curPicked?.id === curOptionSelected.id &&
      curPicked?.pre_option === curOptionSelected.pre_option;

    if (isPrevPickedOption) {
      return;
    }
  };
  const setViewStepsWithQuantity = (option: any, newQuantity: number) => {
    const newViewSteps = viewSteps.map((step: any, index: number) => {
      if (index !== slide + 1) return step;
      const newOptions = step.options.map((item: any) => {
        if (option.select_id === item.select_id) {
          return {
            ...item,
            quantity: newQuantity,
          };
        }
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
      console.log(option);
      const selectId = option.select_id || `${option.pre_option},${option.id}`;
      const newQuantity = quantities[`${selectId}`] ? quantities[`${selectId}`] + 1 : 1;
      setQuantities({
        ...quantities,
        [`${selectId}`]: newQuantity,
      });

      //
      setViewStepsWithQuantity(option, newQuantity);
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
      setQuantities({
        ...quantities,
        [`${selectId}`]: newQuantity,
      });
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
  const handleCreatePreSelectStep = async () => {
    let inValidOption = false;
    let stepError = -1;

    const stepDataClone = cloneDeep(stepData);
    const optionsSelectedClone = cloneDeep(optionsSelected);

    const allOptionSelected: {
      id: string | undefined;
      order: number;
      options: OptionQuantityProps[];
    }[] = Object.values(optionsSelectedClone);

    const noneOptionSelected = allOptionSelected
      .filter((el) => Number(el.order) >= 2)
      .every((el) => !el.options.length);

    if (noneOptionSelected) {
      message.error('Please select options');
      return;
    }

    /* checking all options selected has amount of YOURS equal to its REQUIRED */
    map(optionsSelectedClone, (optionData, order: string) => {
      if (inValidOption || Number(order) < 2 || !optionData.options.length) {
        return;
      }

      if ((optionData.options as unknown as OptionQuantityProps[]).some((el) => el.quantity <= 0)) {
        inValidOption = true;
        return;
      }

      const prevOptions = optionsSelected[Number(order) - 1].options;

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
              stepError = Number(order);
            }
          }
        });
      });
    });

    if (inValidOption && stepError !== -1) {
      message.error(`YOURS in step ${stepError} is not equal to REQUIRED`);
      return;
    }
    /* -------------------------------------------------------------------- */

    let newSteps: AutoStepOnAttributeGroupResponse[] = [];

    map(stepDataClone, (optionData, order: string) => {
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
      /// default each attribute group has attributes property is empty array
      attributes: [],
    });

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
  useEffect(() => {
    console.log(curPicked);
  }, [curPicked]);
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
        disabledNextSlide={curOrder === slideBars.length}
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
                selected={[{ label: '', value: firstOptionSelected }]}
                chosenItems={[]}
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
                    disabled: option?.disabled,
                    // replicate: option.replicate,
                    pre_option: option.pre_option,
                    select_id: option.select_id,
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
                showCollapseIcon
                showCount={false}
                selected={[]}
                chosenItem={[]}
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
