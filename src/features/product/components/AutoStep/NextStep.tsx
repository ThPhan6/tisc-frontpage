import { FC, useEffect, useState } from 'react';

import { message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';

import { getLinkedOptionByOptionIds } from '../../services';
import { uniqueArrayBy } from '@/helper/utils';
import {
  cloneDeep,
  flatMap,
  forEach,
  isNull,
  isUndefined,
  map,
  trimEnd,
  uniq,
  uniqBy,
} from 'lodash';

import {
  OptionSelectedProps,
  setLinkedOptionData,
  setOptionsSelected,
  setPickedOption,
  setSlide,
  setSlideBar,
} from '../../reducers';
import {
  AutoStepLinkedOptionResponse,
  LinkedOptionProps,
  LinkedSubOptionProps,
  OptionReplicateResponse,
} from '../../types/autoStep';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import store, { useAppSelector } from '@/reducers';

import { CheckBoxOptionProps, CheckboxDynamic } from '@/components/CustomCheckbox/CheckboxDynamic';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import { EmptyOne } from '@/components/Empty';
import { BodyText } from '@/components/Typography';

import { AttributeOptionLabel } from '../ProductAttributes/CommonAttribute';
import styles from './AutoStep.less';
import { SlideBar } from './SlideBar';
import { getIDFromPreOption, getPickedOptionGroup } from './util';

interface NextStepProps {
  // options: SubOptionSelectedProps;
  // setSlide: (slide: number) => void;
}
export const NextStep: FC<NextStepProps> = ({}) => {
  const [forceEnableCollapse, setForceEnableCollapse] = useState<boolean>(false);

  const slide = useAppSelector((state) => state.autoStep.slide as number);
  let curOrder = slide;
  curOrder += 2;

  const slideBars = useAppSelector((state) => state.autoStep.slideBars);

  const step = useAppSelector((state) => state.autoStep.step);

  const optionsSelected = useAppSelector((state) => state.autoStep.optionsSelected);

  const linkedOptionData = useAppSelector((state) => state.autoStep.linkedOptionData);

  const pickedData = linkedOptionData?.[slide]?.pickedData ?? [];
  const linkedData = linkedOptionData?.[slide]?.linkedData ?? [];

  const pickedOption = useAppSelector((state) => state.autoStep.pickedOption);
  // const curPickedOption = pickedOption[slide];
  // const curPickedSubData = flatMap(pickedData.map((el) => el.subs));
  const curPicked = pickedOption[slide];
  // curPickedSubData?.find((el) => el.id === curPickedOption?.id);

  /* current option ticked on left panel on each step */
  const pickedSubs = flatMap(pickedData.map((el) => el.subs));

  const allPickedSubs = flatMap(
    pickedSubs.map((el) => ({
      value: el.id,
      label: el.pre_option,
    })),
  );

  const subPickedPreOptionIds = uniq(
    optionsSelected?.[curOrder]?.options?.map((el) => el.pre_option).filter(Boolean) as string[],
  );

  const subPreOptionSelected =
    optionsSelected?.[curOrder]?.options?.map((el) => el.pre_option).filter(Boolean) ?? [];

  const uniqSubPreOptionSelected = uniq(flatMap(subPreOptionSelected.map((el) => el?.split(','))));

  /* current option selected on left panel on each step */
  const currentSubPickedOptionSelected = allPickedSubs.filter((sub) => {
    if (slide === 0) {
      return uniqSubPreOptionSelected.includes(sub.value);
    }

    let a = '';
    let b = '';

    subPickedPreOptionIds.forEach((preOption) => {
      const { optionId, preOptionId } = getIDFromPreOption(preOption);

      if (optionId === sub.value && preOptionId === sub.label) {
        a = optionId;
        b = preOptionId;
      }
    });

    return a === sub.value && b === sub.label;
  });
  /* ------------------------------------------------------ */

  /* current option selected on right panel on each step */
  const allLinkedSubs = flatMap(linkedData.map((el) => flatMap(el.subs.map((sub) => sub.subs))));

  const currentOptionSelected = optionsSelected?.[curOrder]?.options ?? [];

  const subLinkedOptionSelected: CheckboxValue[] =
    currentOptionSelected.map((el) => ({
      value: el.id,
      label: el.pre_option,
    })) ?? [];

  const currentSubLinkedOptionSelected = subLinkedOptionSelected.filter((el) =>
    allLinkedSubs.some((opt) => opt.id === el.value && opt.pre_option === el.label),
  );
  /* ------------------------------------------------------ */

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
  }, [step]);

  const handleBackToPrevSlide = async (props?: { isRemove?: boolean }) => {
    handleForceEnableCollapse();

    const curSlide = cloneDeep(slide);

    if (curSlide === 0) {
      return;
    }

    let newSlide = curSlide;
    --newSlide;

    store.dispatch(setSlide(newSlide));

    const newLinkedOptionData = [...linkedOptionData];

    const curOptionSelected = optionsSelected?.[curOrder]?.options ?? [];
    const curAllLinkedIdSelect = curOptionSelected.map((el) => el.id);

    const isGetLinkedOption =
      /// have linked id
      !!curAllLinkedIdSelect.length &&
      /// have picked data
      !!newLinkedOptionData[newSlide]?.pickedData?.length &&
      /// dont have linked data
      !newLinkedOptionData[newSlide]?.linkedData?.length;

    const currentPickedOption = pickedOption[newSlide];

    if (!isGetLinkedOption || !currentPickedOption.id) {
      if (props?.isRemove) {
        return newLinkedOptionData;
      }

      return;
    }

    if (newSlide === 0) {
      const res = await getLinkedOptionByOptionIds(currentPickedOption.id);

      newLinkedOptionData[newSlide] = { ...newLinkedOptionData[newSlide], linkedData: res };

      store.dispatch(setLinkedOptionData(newLinkedOptionData));
    } else {
      const orders = Object.keys(optionsSelected).map((el) => Number(el));

      let prevAllLinkedIdSelect: string[] = [];

      orders.forEach((order) => {
        if (order < curOrder - 1) {
          const optionSelectedIds = optionsSelected[order].options.map((el) => el.id);

          prevAllLinkedIdSelect = uniq(prevAllLinkedIdSelect.concat(optionSelectedIds));
        }
      });

      const newExceptOptionIds = prevAllLinkedIdSelect.join(',');

      const res = await getLinkedOptionByOptionIds(currentPickedOption.id, newExceptOptionIds);

      /// set option selected to data
      const newLinkedOptions = res.map((el) => ({
        ...el,
        subs: el.subs.map((item) => ({
          ...item,
          subs: item.subs.map((sub) => {
            let newSub: OptionReplicateResponse | undefined = undefined;

            newSub = { ...sub, pre_option: optionsSelected[curOrder - 1].options[0].pre_option };

            return newSub ?? sub;
          }),
        })),
      }));

      newLinkedOptionData[newSlide] = {
        ...newLinkedOptionData[newSlide],
        linkedData: newLinkedOptions,
      };

      if (!props?.isRemove) {
        store.dispatch(setLinkedOptionData(newLinkedOptionData));
      }
    }

    return newLinkedOptionData;
  };

  const handleGoToNextSlide = async () => {
    const prevSlide = slide;

    if (!slideBars[prevSlide] || !slideBars[prevSlide + 1]) {
      message.error('Please enter description');
      return;
    }

    const curOptionSelected = optionsSelected?.[curOrder]?.options ?? [];
    const curAllLinkedIdSelect = curOptionSelected.map((el) => el.id);

    if (!curOptionSelected.length) {
      message.error('Please select options');
      return;
    }

    handleForceEnableCollapse();

    const newSlide = prevSlide + 1;

    /* add new slide */
    store.dispatch(setSlide(newSlide));

    /* add new slide bar for next step */
    const newSlideBarStep = newSlide + 1;
    if (isUndefined(slideBars[newSlideBarStep])) {
      store.dispatch(setSlideBar([...slideBars, '']));
    }
    /* -------------------------------- */

    /// next picked data is collected by prev linked data and its option selected
    const newPickedData: LinkedOptionProps[] = [];

    /// prev linked data and all its options selected
    const prevPickedGroupOption = getPickedOptionGroup(optionsSelected[curOrder].options);

    /* all options selected in multiple groups */
    prevPickedGroupOption.forEach((el) => {
      const subItemSelected: OptionReplicateResponse[] = [];
      let subOptionId = '';
      let subOptionName = '';

      el.subs.forEach((sub) => {
        /// collected the same sub options into one group option
        if (curAllLinkedIdSelect.includes(sub.id)) {
          subItemSelected.push(sub);
        }

        if (subItemSelected.length) {
          subOptionId = el.id;
          subOptionName = el.name;
        }
      });

      if (!subOptionId || !subItemSelected.length) {
        return;
      }

      newPickedData.push({ id: subOptionId, name: subOptionName, subs: subItemSelected });
    });

    const currentPickedOption = pickedOption[newSlide];

    const newLinkedOptionData = [...linkedOptionData];

    const isGetLinkedOption =
      /// have linked id
      !!curAllLinkedIdSelect.length &&
      /// have picked data
      !!newLinkedOptionData[newSlide]?.pickedData?.length &&
      /// dont have linked data
      !newLinkedOptionData[newSlide]?.linkedData?.length;

    let newLinkedData: AutoStepLinkedOptionResponse[] = [];

    /// call rest option when update
    if (isGetLinkedOption && currentPickedOption?.id) {
      const orders = Object.keys(optionsSelected).map((el) => Number(el));

      let prevAllLinkedIdSelect: string[] = [];

      orders.forEach((order) => {
        if (order <= curOrder) {
          const optionSelectedIds = optionsSelected[order].options.map((el) => el.id);

          prevAllLinkedIdSelect = uniq(prevAllLinkedIdSelect.concat(optionSelectedIds));
        }
      });

      const newExceptOptionIds = prevAllLinkedIdSelect.join(',');

      const newLinkedOptions =
        newSlide > 0 && !newExceptOptionIds
          ? []
          : await getLinkedOptionByOptionIds(currentPickedOption.id, newExceptOptionIds);

      /// set options selected to data
      newLinkedData = newLinkedOptions.map((el) => ({
        ...el,
        subs: el.subs.map((item) => ({
          ...item,
          subs: item.subs.map((sub) => {
            let newSub: OptionReplicateResponse | undefined = undefined;

            if (optionsSelected?.[curOrder + 1]?.options.length) {
              newSub = { ...sub, pre_option: optionsSelected[curOrder + 1].options[0].pre_option };
            }

            return newSub ?? sub;
          }),
        })),
      }));
    }

    /// update linked option data
    newLinkedOptionData[newSlide] = {
      pickedData: newPickedData,
      linkedData:
        !isGetLinkedOption && !newLinkedData.length
          ? linkedOptionData[newSlide]?.linkedData ?? []
          : newLinkedData ?? [],
    };

    store.dispatch(setLinkedOptionData(newLinkedOptionData));
  };

  const handleRemoveStep = async (index: number) => {
    const lastStep = index + 1;
    const lastSlide = index - 1;

    if (index === 0) {
      message.info('You cannot delete this step');
      return;
    }

    /// this remove action is like back to prev slide action
    /// set new slide is already handle in this func
    const data = await handleBackToPrevSlide({ isRemove: true });

    /* delete slideBar */
    const newSlideBar = cloneDeep(slideBars);
    newSlideBar.splice(index, 1);
    store.dispatch(setSlideBar(newSlideBar));
    /* ---------------- */

    /* delete data view */
    const newLinkedOptionData = data?.filter((_, idx) => idx < lastSlide) ?? [];
    store.dispatch(setLinkedOptionData(newLinkedOptionData));
    /* ------------------- */

    /* delete options selected view */
    let newOptionsSelected: OptionSelectedProps = {};

    forEach(optionsSelected, (optionSelected, curStep) => {
      if (Number(curStep) < lastStep) {
        newOptionsSelected = {
          ...newOptionsSelected,
          [Number(curStep)]: optionSelected,
        };
      }
    });

    store.dispatch(setOptionsSelected(newOptionsSelected));
    /* ----------------------- */

    /* delete option hightighted view */
    let newPickedOption = {};

    forEach(pickedOption, (option, curSlide) => {
      if (Number(curSlide) < lastSlide) {
        newPickedOption = {
          ...newPickedOption,
          [Number(curSlide)]: option,
        };
      }
    });

    store.dispatch(setPickedOption(newPickedOption));
    /* ---------------------------- */
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

    const curPickedSubData = flatMap(pickedData.map((el) => el.subs));

    const curPickedOption = curPickedSubData.find(
      (el) => el.id === curOptionSelected.id && el.pre_option === curOptionSelected.pre_option,
    );

    if (curPickedOption?.id) {
      store.dispatch(
        setPickedOption({
          slide: slide,
          id: curPickedOption.id,
          pre_option: curPickedOption?.pre_option,
        }),
      );
    }

    const orders = Object.keys(optionsSelected).map((el) => Number(el));

    let prevAllLinkedIdSelect: string[] = [];

    orders.forEach((order) => {
      if (order < curOrder) {
        const optionSelectedIds = Object.values(optionsSelected[order].options.map((el) => el.id));
        prevAllLinkedIdSelect = uniq(prevAllLinkedIdSelect.concat(optionSelectedIds));
      }
    });

    const newExceptOptionId = slide === 0 ? undefined : prevAllLinkedIdSelect.join(',');

    if (!curPickedOption?.id) {
      return;
    }

    //
    getLinkedOptionByOptionIds(curPickedOption.id, newExceptOptionId).then((res) => {
      store.dispatch(
        setLinkedOptionData({
          index: slide,
          pickedData: pickedData.map((el) => ({
            ...el,
            subs: el.subs.map((item) => ({
              ...item,
              sub_id: el.id,
              sub_name: el.name,
              pre_option: slide === 0 ? undefined : item.pre_option,
            })),
          })),
          linkedData: res.map((el) => ({
            ...el,
            subs: el.subs.map((item) => ({
              ...item,
              subs: item.subs.map((sub) => {
                const preOptionInfo = [
                  curPickedOption.pre_option_name,
                  trimEnd(
                    `${curPickedOption.value_1} ${curPickedOption.value_2} ${
                      curPickedOption.unit_1 || curPickedOption.unit_2
                        ? `- ${curPickedOption.unit_1} ${curPickedOption.unit_2}`
                        : ''
                    }`,
                  ),
                ].filter(Boolean);

                const preOptionName = preOptionInfo.length ? preOptionInfo.join(', ') : undefined;

                const preOptionId = [curPickedOption?.pre_option, curPickedOption.id]
                  .filter(Boolean)
                  .join(',');

                return {
                  ...sub,
                  sub_id: item.id,
                  sub_name: item.name,
                  pre_option: preOptionId,
                  pre_option_name: preOptionName,
                };
              }),
            })),
          })),
        }),
      );
    });
  };
  //
  const handleSelectLinkedOption =
    (option: AutoStepLinkedOptionResponse) =>
    (event: CheckboxChangeEvent | { isSelectedAll: boolean; options: CheckBoxOptionProps[] }) => {
      const eachSubOptionSelected = (event as CheckboxChangeEvent)
        ?.target as CheckboxChangeEvent['target'] & {
        pre_option: string;
      };

      const { isSelectedAll, options } = event as {
        isSelectedAll: boolean;
        options: CheckBoxOptionProps[];
      };

      const curLinkedData = flatMap(
        linkedOptionData[slide].linkedData.map((el) => flatMap(el.subs.map((item) => item.subs))),
      );

      const curOptionSelect = eachSubOptionSelected?.value
        ? (
            curLinkedData.map((curLinkedOption) => {
              if (slide === 0) {
                if (curLinkedOption.id === eachSubOptionSelected.value) {
                  return curLinkedOption;
                }

                return undefined;
              }

              if (
                curLinkedOption.id === eachSubOptionSelected.value &&
                curLinkedOption.pre_option === eachSubOptionSelected.pre_option
              ) {
                return curLinkedOption;
              }

              return undefined;
            }) as OptionReplicateResponse[]
          ).filter(Boolean)
        : curLinkedData
            .map((curLinkedOption) => {
              if (slide === 0) {
                if (options.some((opt) => opt.value === curLinkedOption.id)) {
                  return curLinkedOption;
                }

                return undefined;
              }

              if (
                options.some(
                  (opt) =>
                    opt.value === curLinkedOption.id &&
                    opt.pre_option === curLinkedOption.pre_option,
                )
              ) {
                return curLinkedOption;
              }

              return undefined;
            })
            .filter(Boolean);

      const prevOptionSeleted = optionsSelected?.[curOrder]?.options.filter(Boolean) ?? [];

      let newOptionsSelected: OptionReplicateResponse[] = [...prevOptionSeleted];

      /* update select */
      curOptionSelect.forEach((el: any) => {
        const optIdx = prevOptionSeleted.findIndex(
          (sub) => sub.id === el.id && sub.pre_option === el.pre_option,
        );

        if (isSelectedAll) {
          newOptionsSelected = uniqueArrayBy(newOptionsSelected.concat([el]), ['id', 'pre_option']);
        } else {
          if (optIdx > -1) {
            delete newOptionsSelected[optIdx];
          } else {
            newOptionsSelected = newOptionsSelected.concat([el]);
          }
        }
      });

      const result: OptionReplicateResponse[] = !prevOptionSeleted.length
        ? (curOptionSelect.filter(Boolean) as OptionReplicateResponse[])
        : newOptionsSelected.filter(Boolean);

      store.dispatch(
        setOptionsSelected({
          order: curOrder,
          options: result as any,
        }),
      );

      /// save all picked options ticked in first step
      if (slide === 0) {
        const subs = flatMap(option.subs.map((el) => el.subs));

        const allSecondOptions = subs.map((el) => el.pre_option) ?? [];

        const currentSubTicked = pickedSubs.filter((sub) => allSecondOptions.includes(sub.id));

        if (optionsSelected[1]) {
          store.dispatch(
            setOptionsSelected({
              order: 1,
              options: uniqBy(
                [...optionsSelected[1].options, ...currentSubTicked],
                (o) => o.id,
              ) as any,
            }),
          );
        } else {
          store.dispatch(
            setOptionsSelected({
              order: 1,
              options: currentSubTicked as any,
            }),
          );
        }
      }

      // get list option selected of next step
      if (optionsSelected[curOrder + 1]) {
        const newLinkedOptionData = [...linkedOptionData];

        const newPickedOption = { ...pickedOption };

        linkedOptionData.forEach((_, index) => {
          if (index <= slide) {
            return;
          }

          newLinkedOptionData[index] = {
            linkedData: [],
            pickedData: [],
          };

          newPickedOption[index] = {
            id: '',
            pre_option: '',
          };
        });

        // remove data view of next step
        store.dispatch(setLinkedOptionData(newLinkedOptionData));

        // remove option highlighted of next step
        store.dispatch(setPickedOption(newPickedOption));

        let prevOptionsSelectedIds = result.map((el) => {
          if (el.pre_option) {
            return `${el.pre_option},${el.id}`;
          }

          return el.id;
        });

        // remove data selected options
        map(optionsSelected, (optionData, optIndex: string) => {
          if (Number(optIndex) <= curOrder) {
            return false;
          }

          const newNextOptionSelected = optionData.options.filter((el: any) =>
            prevOptionsSelectedIds.includes(el.pre_option as string),
          );

          //
          prevOptionsSelectedIds = newNextOptionSelected.map((el: any) => {
            if (el.pre_option) {
              return `${el.pre_option},${el.id}`;
            }

            return el.id;
          });

          store.dispatch(
            setOptionsSelected({
              order: Number(optIndex),
              options: newNextOptionSelected,
            }),
          );

          return true;
        });
      }
    };

  const handleDecreaseReplicate =
    (subOpt: LinkedSubOptionProps) => (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      e.preventDefault();

      if (subOpt.replicate === 1) {
        return;
      }

      const newPickedData = cloneDeep(pickedData).map((el) => ({
        ...el,
        subs: el.subs.map((sub) => ({
          ...sub,
          replicate:
            sub.id === subOpt.id && sub.pre_option === subOpt.pre_option
              ? --sub.replicate
              : sub.replicate,
        })),
      }));

      store.dispatch(
        setLinkedOptionData({ index: slide, pickedData: newPickedData, linkedData: linkedData }),
      );

      const newCurOptionSelected = cloneDeep(optionsSelected)[curOrder - 1].options.map((sub) => ({
        ...sub,
        replicate:
          sub.id === subOpt.id && sub.pre_option === subOpt.pre_option
            ? --sub.replicate
            : sub.replicate,
      }));

      store.dispatch(
        setOptionsSelected({
          order: curOrder - 1,
          options: newCurOptionSelected,
        }),
      );
    };

  const handleIncreaseReplicate =
    (subOpt: LinkedSubOptionProps) => (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      e.preventDefault();

      const newPickedData = cloneDeep(pickedData).map((el) => ({
        ...el,
        subs: el.subs.map((sub) => ({
          ...sub,
          replicate:
            sub.id === subOpt.id && sub.pre_option === subOpt.pre_option
              ? ++sub.replicate
              : sub.replicate,
        })),
      }));

      store.dispatch(
        setLinkedOptionData({ index: slide, pickedData: newPickedData, linkedData: linkedData }),
      );

      const newCurOptionSelected = cloneDeep(optionsSelected)[curOrder - 1].options.map((sub) => ({
        ...sub,
        replicate:
          sub.id === subOpt.id && sub.pre_option === subOpt.pre_option
            ? ++sub.replicate
            : sub.replicate,
      }));

      store.dispatch(
        setOptionsSelected({
          order: curOrder - 1,
          options: newCurOptionSelected,
        }),
      );
    };

  return (
    <div className={styles.nextStep}>
      <SlideBar
        handleBackToPrevSlide={handleBackToPrevSlide}
        handleGoToNextSlide={handleGoToNextSlide}
        handleRemoveStep={handleRemoveStep}
      />

      <div className={styles.mainContent}>
        {/* left side */}
        <div className={styles.content} style={{ marginRight: 8 }}>
          {pickedData.map((pickedSub, optIdx) => {
            return (
              <CheckboxDynamic
                key={optIdx}
                isCheckbox
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
                          <BodyText customClass="replicate-label" level={4} style={{ height: 24 }}>
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
                              onClick={handleDecreaseReplicate(option)}
                            />
                            <BodyText
                              fontFamily="Roboto"
                              level={6}
                              style={{ padding: '0 8px', width: 30 }}
                            >
                              {option.replicate}
                            </BodyText>
                            <DropupIcon onClick={handleIncreaseReplicate(option)} />
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
                              const { optionId, preOptionId } = getIDFromPreOption(el.pre_option);

                              if (slide === 0) {
                                return el.pre_option === option.id;
                              }

                              return optionId === option.id && preOptionId === option.pre_option;
                            }).length ?? 0}
                          </BodyText>
                        </div>
                      </div>
                    ),
                  })),
                }}
              />
            );
          })}
        </div>

        {/* right side */}
        <div
          className={`${styles.content} ${styles.rightContent} ${
            !linkedData.length ? 'flex-center' : ''
          }`}
        >
          {!linkedData.length ? (
            <EmptyOne />
          ) : (
            linkedData.map((option, index) => {
              return (
                <div className={styles.linkedContent} key={index}>
                  <BodyText
                    level={5}
                    fontFamily="Roboto"
                    customClass={styles.header}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {option.name}
                  </BodyText>

                  <DropdownCheckboxList
                    data={option.subs?.map((item) => ({
                      label: item.name,
                      id: item.id,

                      options: item.subs.map((el) => ({
                        label: (
                          <AttributeOptionLabel option={el} key={index}>
                            <div>
                              <span className="product-id-label">Product ID:</span>
                              <span className="product-id-value">{el.product_id}</span>
                            </div>
                          </AttributeOptionLabel>
                        ),
                        value: el.id,
                        pre_option: el.pre_option,
                      })),
                    }))}
                    showCount={false}
                    renderTitle={(data) => data.label}
                    selected={currentSubLinkedOptionSelected}
                    chosenItem={currentSubLinkedOptionSelected}
                    forceEnableCollapse={forceEnableCollapse}
                    onOneChange={handleSelectLinkedOption(option)}
                    showCollapseIcon
                    isSelectAll
                    combinable
                    canActiveMultiKey
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
