import { FC, Ref, forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as ArrowDown } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as ArrowUp } from '@/assets/icons/drop-up-icon.svg';

import { getLinkedOptionByOptionIds } from '../../services';
import { useGetUserRoleFromPathname } from '@/helper/hook';
import { sortObjectArray, uniqueArrayBy } from '@/helper/utils';
import {
  cloneDeep,
  flatMap,
  forEach,
  isNull,
  isUndefined,
  map,
  sortBy,
  sum,
  uniq,
  uniqBy,
} from 'lodash';

import {
  OptionSelectedProps,
  setAllOptionPickedIds,
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
import { setPartialProductDetail } from '@/features/product/reducers';
import store, { useAppSelector } from '@/reducers';

import CustomButton from '@/components/Button';
import CustomCollapse from '@/components/Collapse';
import { CheckBoxOptionProps, CheckboxDynamic } from '@/components/CustomCheckbox/CheckboxDynamic';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import { EmptyOne } from '@/components/Empty';
import { BodyText } from '@/components/Typography';

import { AttributeOptionLabel } from '../ProductAttributes/CommonAttribute';
import styles from './AutoStep.less';
import { SlideBar } from './SlideBar';
import { getIDFromPreOption, getPreOptionName, mappingOptionGroups } from './util';

export interface SlideActions {
  handleBackToPrevSlide: () => void;
  handleGoToNextSlide: () => void;
}
interface NextStepProps {
  // options: SubOptionSelectedProps;
  // setSlide: (slide: number) => void;
  onDisablePreButton?: any;
}
export const NextStep: FC<NextStepProps> = forwardRef(
  ({ onDisablePreButton }, ref: Ref<SlideActions>) => {
    const [forceEnableCollapse, setForceEnableCollapse] = useState<boolean>(false);
    // const [allOptionPickedIds, setAllOptionPickedIds] = useState<string[]>([]);

    const { slide, slideBars, step, optionsSelected, linkedOptionData, allOptionPickedIds } =
      useAppSelector((state) => state.autoStep);

    let curOrder = slide;
    curOrder += 2;
    const pickedData = linkedOptionData?.[slide]?.pickedData ?? [];
    const linkedData = linkedOptionData?.[slide]?.linkedData ?? [];
    const userRole = useGetUserRoleFromPathname();
    const details = useAppSelector((state) => state.product.details);
    const attributeGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);
    const currentSpecAttributeGroupId = attributeGroupId?.['specification_attribute_groups'];
    const defaultPreSelect =
      details.specification_attribute_groups.find((item) => item.id === currentSpecAttributeGroupId)
        ?.defaultPreSelect || [];
    const setDefaultActiveCollapse = () => {
      const curPickedData = linkedOptionData[slide]?.pickedData;
      if (!curPickedData) return [];
      if (curPickedData.length === 1) {
        return [curPickedData[0].id];
      }
      return curPickedData
        .filter((item) => {
          let check = false;
          item.subs.forEach((option) => {
            if (option.replicate !== 0) check = true;
          });
          return check;
        })
        .map((item) => item.id);
    };

    const [curActiveKey, setCurActiveKey] = useState<string[]>(setDefaultActiveCollapse());
    useEffect(() => {
      setCurActiveKey(setDefaultActiveCollapse());
      if (slide === 0 && onDisablePreButton) {
        onDisablePreButton(true);
      } else {
        onDisablePreButton(false);
      }
    }, [slide]);

    // mappingOptionGroups(linkedOptionData?.[slide]?.pickedData , optionsSelected[slide+1].options)

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

    const uniqSubPreOptionSelected = uniq(
      flatMap(subPreOptionSelected.map((el) => el?.split(','))),
    );

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
      }, 300);
    };

    useEffect(() => {
      if (isUndefined(step) || isNull(step) || typeof step !== 'number') {
        return;
      }

      /// update cur slide by step clicked
      store.dispatch(setSlide(step));

      /// get all options highlighted
      const allOptionSelectedIds: string[] = [];
      map(optionsSelected, (optionSelected, order: string) => {
        optionSelected.options.forEach((el) => {
          const optionSelectedId =
            Number(order) === 1 ? (optionSelected.id as string) : (el.pre_option as string);
          allOptionSelectedIds.push(optionSelectedId);
        });
      });

      /// save all option highlighted by option selected pre_option and its id
      store.dispatch(setAllOptionPickedIds(allOptionSelectedIds));

      ///
      handleForceEnableCollapse();
    }, [step]);

    const handleBackToPrevSlide = async (props?: { isRemove?: boolean }) => {
      handleForceEnableCollapse();

      const curSlide = cloneDeep(slide);

      if (curSlide === 0) {
        return;
      }

      const newSlide = curSlide - 1;
      const newOrder = curSlide + 1;

      store.dispatch(setSlide(newSlide));

      const newLinkedOptionData = [...linkedOptionData];

      const curOptionSelected = optionsSelected?.[newOrder]?.options ?? [];
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
          if (order < newOrder) {
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

              newSub = { ...sub, pre_option: optionsSelected[newOrder].options[0].pre_option };

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
      const prevPickedGroupOption = mappingOptionGroups(optionsSelected[curOrder].options);

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
                newSub = {
                  ...sub,
                  pre_option: optionsSelected[curOrder + 1].options[0].pre_option,
                };
              }

              return newSub ?? sub;
            }),
          })),
        }));
      }

      /// update linked option data
      newLinkedOptionData[newSlide] = {
        pickedData: sortObjectArray(
          newPickedData.map((el) => ({
            ...el,
            subs: sortBy(
              el.subs.map((item) => {
                const optMatch = optionsSelected[curOrder].options.find(
                  (opt) => opt.id === item.id && opt.pre_option === item.pre_option,
                );

                return {
                  ...item,
                  replicate: optMatch ? optMatch.replicate : 0,
                  sortField: `${item.value_1}${item.unit_1}${item.value_2}${item.unit_2}`,
                };
              }),
              ['sortField', 'pre_option_name'],
            ).map((item: any) => {
              const { sortField, ...temp } = item;
              return temp;
            }),
          })),
          'name',
        ),
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
          const optionSelectedIds = Object.values(
            optionsSelected[order].options.map((el) => el.id),
          );
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
              subs: el.subs.map((item) => {
                const optMatched = optionsSelected[slide === 0 ? 1 : curOrder - 1]?.options?.find(
                  (opt) => opt.id === item.id && opt.pre_option === item.pre_option,
                );
                return {
                  ...item,
                  sub_id: el.id,
                  sub_name: el.name,
                  pre_option: slide === 0 ? undefined : item.pre_option,
                  replicate:
                    optMatched && optMatched.replicate !== 0
                      ? optMatched.replicate
                      : res.length > 0 &&
                        item.id === curOptionSelected.id &&
                        item.pre_option === curOptionSelected.pre_option
                      ? 1
                      : item.replicate,
                };
              }),
            })),
            linkedData: res.map((el) => ({
              ...el,
              subs: el.subs.map((item) => ({
                ...item,
                subs: item.subs.map((sub) => {
                  const preOptionName = getPreOptionName(
                    curPickedOption.pre_option_name as string,
                    {
                      value_1: curPickedOption.value_1,
                      value_2: curPickedOption.value_2,
                      unit_1: curPickedOption.unit_1,
                      unit_2: curPickedOption.unit_2,
                    },
                  );
                  const preOptionId = [curPickedOption?.pre_option, curPickedOption.id]
                    .filter(Boolean)
                    .join(',');

                  return {
                    ...sub,
                    sub_id: item.id,
                    sub_name: item.name,
                    pre_option: preOptionId,
                    pre_option_name: preOptionName,
                    replicate: 0,
                  };
                }),
              })),
            })),
          }),
        );

        const optionSelectedId =
          slide === 0
            ? curOptionSelected.id
            : `${curOptionSelected.pre_option},${curOptionSelected.id}`;

        /// only allow auto select all on first click for each option highlighted
        if (allOptionPickedIds.every((pickedId) => pickedId !== optionSelectedId)) {
          /// update all options highlighted on first click
          store.dispatch(setAllOptionPickedIds([...allOptionPickedIds, optionSelectedId]));

          if (slide === 0) {
            /// set default all options in left panel will be selected in step 1
            const currentSubOptionPickedData = flatMap(pickedData.map((el) => el.subs));
            const currentSubOptionPicked = currentSubOptionPickedData.find(
              (el) => el.id === curOptionSelected.id,
            );
            let optionSelectedOfStepOne: OptionReplicateResponse[] =
              optionsSelected?.[1]?.options ?? [];

            if (currentSubOptionPicked) {
              optionSelectedOfStepOne = uniqBy(
                optionSelectedOfStepOne.concat({
                  ...currentSubOptionPicked,
                  replicate: res.length > 0 ? 1 : 0,
                }),
                'id',
              );
            }
            store.dispatch(setOptionsSelected({ order: 1, options: optionSelectedOfStepOne }));
          }

          let optionSelectedOfCurrentStep: OptionReplicateResponse[] =
            optionsSelected?.[curOrder]?.options ?? [];

          const options = flatMap(res.map((el) => flatMap(el.subs.map((sub) => sub.subs))));

          const newOptions = options.map((el) => {
            const preOptionName = getPreOptionName(curPickedOption.pre_option_name as string, {
              value_1: curPickedOption.value_1,
              value_2: curPickedOption.value_2,
              unit_1: curPickedOption.unit_1,
              unit_2: curPickedOption.unit_2,
            });

            return {
              ...el,
              replicate:
                res.length > 0 &&
                el.id === curOptionSelected.id &&
                el.pre_option === curOptionSelected.pre_option
                  ? 1
                  : el.replicate,
              pre_option:
                curOrder === 2
                  ? el.pre_option
                  : `${curOptionSelected.pre_option},${curOptionSelected.id}`,
              pre_option_name: preOptionName,
            };
          });

          optionSelectedOfCurrentStep = uniqueArrayBy(
            optionSelectedOfCurrentStep.concat(newOptions),
            ['id', 'pre_option'],
          );

          /// set default all options in right panel will be selected in other steps
          // if()
          store.dispatch(
            setOptionsSelected({ order: curOrder, options: optionSelectedOfCurrentStep }),
          );
          if (optionsSelected[curOrder - 1] && curOrder !== 2) {
            store.dispatch(
              setOptionsSelected({
                order: curOrder - 1,
                options: optionsSelected[curOrder - 1].options.map((el) => ({
                  ...el,
                  linkage: sum(flatMap(res.map((k) => k.subs.map((l) => l.subs.length)))),

                  replicate:
                    curOptionSelected.id === el.id &&
                    curOptionSelected.pre_option === el.pre_option &&
                    res.length > 0
                      ? 1
                      : el.replicate,
                })),
              }),
            );
          }
        }
      });
    };

    const getLinkage = (option: OptionReplicateResponse, options: OptionReplicateResponse[]) => {
      return (
        options?.filter((el) => {
          const { optionId, preOptionId } = getIDFromPreOption(el.pre_option);

          if (slide === 0) {
            return el.pre_option === option.id;
          }
          return optionId === option.id && preOptionId === option.pre_option;
        }).length ?? 0
      );
    };
    const handleIncreaseReplicateDetail = (subOpt: LinkedSubOptionProps) => {
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
    //
    const handleOnChangeDefaultPreSelect = (
      value: string,
      option?: any,
      action?: 'add' | 'remove',
    ) => {
      const preOption = pickedSubs.find(
        (item) =>
          (item.pre_option ? [item.pre_option, item.id] : [item.id]).join(',') ===
          option.pre_option,
      );
      let newDefaultSelected = defaultPreSelect;

      if (defaultPreSelect.includes(`${value}_${option.pre_option}`) || action === 'remove') {
        newDefaultSelected = newDefaultSelected.filter(
          (item) => item !== `${value}_${option.pre_option}`,
        );
      } else {
        newDefaultSelected = newDefaultSelected.concat([`${value}_${option.pre_option}`]);
      }
      //Set new Replicate if any
      if (preOption) {
        const totalDefaultSelected = newDefaultSelected.filter(
          (item: string) => item.split('_')[1] === option.pre_option,
        ).length;
        const currentReplicate = preOption?.replicate || 0;
        if (totalDefaultSelected > currentReplicate) {
          //set new replicate
          handleIncreaseReplicateDetail(preOption);
        }
      }
      store.dispatch(
        setPartialProductDetail({
          specification_attribute_groups: [...details.specification_attribute_groups].map((el) =>
            el.id === currentSpecAttributeGroupId
              ? {
                  ...el,
                  defaultPreSelect: newDefaultSelected,
                }
              : el,
          ),
        }),
      );
    };
    const handleSelectLinkedOption =
      (option: AutoStepLinkedOptionResponse) =>
      (event: CheckboxChangeEvent | { isSelectedAll: boolean; options: CheckBoxOptionProps[] }) => {
        console.log(option);
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
            newOptionsSelected = uniqueArrayBy(newOptionsSelected.concat([el]), [
              'id',
              'pre_option',
            ]);
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

        store.dispatch(
          setOptionsSelected({
            order: curOrder - 1,
            options: optionsSelected[curOrder - 1].options.map((el) => {
              const linkageNumber = getLinkage(el, result);
              const replicate = linkageNumber === 0 ? 0 : el.replicate === 0 ? 1 : el.replicate;
              if (el.id === curPicked.id && curPicked.pre_option === el.pre_option) {
                return {
                  ...el,
                  replicate,
                };
              }

              return el;
            }),
          }),
        );

        /// save all picked options ticked in first step
        // {
        //   const subs = flatMap(option.subs.map((el) => el.subs));

        //   /// get pre_option to compared
        //   const otherOptions = subs.map((el) => el.pre_option) ?? [];
        //   console.log(pickedSubs);
        //   const currentSubTicked = [...pickedSubs]
        //     .filter((sub) => otherOptions.includes(sub.id))
        //     .map((i) => ({
        //       ...i,
        //       replicate: i.replicate + 1,
        //     }));
        //   const currentSubTickedIds = currentSubTicked.map((el) => el.id);

        //   const linkageAmount = sum(
        //     result.map((el) => currentSubTickedIds.includes(el?.pre_option as string)),
        //   );

        //   if (optionsSelected[slide + 1]) {
        //     /// remove option doesn't have any linkage
        //     let newOptionSelectedInFirstStep =
        //       linkageAmount > 0
        //         ? uniqBy([...optionsSelected[slide + 1].options, ...currentSubTicked], (o) => o.id)
        //         : [...optionsSelected[slide + 1].options].filter(
        //             (el) => !currentSubTickedIds.includes(el.id),
        //           );

        //     store.dispatch(
        //       setOptionsSelected({
        //         order: slide + 1,
        //         options: newOptionSelectedInFirstStep,
        //       }),
        //     );
        //   } else {
        //     store.dispatch(
        //       setOptionsSelected({
        //         order: slide + 1,
        //         options: linkageAmount > 0 ? currentSubTicked : [],
        //       }),
        //     );
        //   }
        // }

        // get list option selected of next step
        if (optionsSelected[curOrder + 1]) {
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
        const newLinkedOptionData = [...linkedOptionData];

        const newPickedOption = { ...pickedOption };

        linkedOptionData.forEach((_, index) => {
          if (index < slide) {
            return;
          }
          if (index === slide) {
            const newPickedData = newLinkedOptionData[index].pickedData.map((data) => {
              const newSubData = data.subs.map((item) => {
                if (
                  item.id === curPicked.id &&
                  (item.pre_option === curPicked.pre_option || slide === 0)
                ) {
                  const linkage = getLinkage(item, newOptionsSelected);
                  const newReplicate =
                    linkage === 0 ? 0 : item.replicate === 0 ? 1 : item.replicate;
                  return {
                    ...item,
                    replicate: newReplicate,
                  };
                }
                return item;
              });
              return { ...data, subs: newSubData };
            });
            newLinkedOptionData[index] = {
              ...newLinkedOptionData[index],
              pickedData: newPickedData,
            };
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
      };

    const restrictDecreaseByTotalDefaultPreSelect = (option: any) => {
      const totalDefaultSelected = defaultPreSelect.filter(
        (item: string) =>
          item.split('_')[1] ===
          (!option.pre_option ? option.id : `${option.pre_option},${option.id}`),
      ).length;
      const currentReplicate = option?.replicate || 0;
      if (totalDefaultSelected === currentReplicate) {
        return true;
      }
      return false;
    };
    const handleDecreaseReplicate =
      (subOpt: LinkedSubOptionProps) => (e: React.MouseEvent<SVGSVGElement>) => {
        e.stopPropagation();
        e.preventDefault();

        if (subOpt.replicate === 1) {
          return;
        }
        if (restrictDecreaseByTotalDefaultPreSelect(subOpt)) return;
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

        const newCurOptionSelected = cloneDeep(optionsSelected)[curOrder - 1].options.map(
          (sub) => ({
            ...sub,
            replicate:
              sub.id === subOpt.id && sub.pre_option === subOpt.pre_option
                ? --sub.replicate
                : sub.replicate,
          }),
        );

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
        handleIncreaseReplicateDetail(subOpt);
      };

    const onChangeCurActiveKey = (activeKey: string) => {
      if (curActiveKey.includes(activeKey)) {
        setCurActiveKey(curActiveKey.filter((item) => item !== activeKey));
      } else setCurActiveKey(curActiveKey.concat([activeKey]));
    };
    const handleResetAll = async () => {
      store.dispatch(
        setLinkedOptionData({
          index: slide,
          pickedData: pickedData.map((el) => ({
            ...el,
            subs: el.subs.map((item) => {
              return {
                ...item,
                sub_id: el.id,
                sub_name: el.name,
                pre_option: slide === 0 ? undefined : item.pre_option,
                replicate: 0,
              };
            }),
          })),
          linkedData: linkedData,
        }),
      );
      store.dispatch(
        setOptionsSelected({
          order: curOrder - 1,
          options: optionsSelected[curOrder - 1].options.map((el) => ({
            ...el,
            linkage: 0,
            replicate: 0,
          })),
        }),
      );
      store.dispatch(
        setOptionsSelected({
          order: curOrder,
          options: [],
        }),
      );
    };
    useImperativeHandle(ref, () => ({
      handleBackToPrevSlide,
      handleGoToNextSlide,
    }));
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
            {linkedData.length ? (
              <CustomButton
                buttonClass={styles.resetAll}
                size="small"
                variant="primary"
                properties="rounded"
                onClick={handleResetAll}
              >
                Reset All
              </CustomButton>
            ) : null}
            {pickedData.map((pickedSub, optIdx) => {
              return (
                <>
                  <CustomCollapse
                    activeKey={curActiveKey.includes(pickedSub.id) ? '1' : ''}
                    onChange={() => onChangeCurActiveKey(pickedSub.id)}
                    header={
                      <div className="flex-between">
                        <BodyText
                          level={5}
                          fontFamily="Roboto"
                          style={{
                            fontWeight: curActiveKey.includes(pickedSub.id) ? 500 : 200,
                            textTransform: 'capitalize',
                            color: '#000',
                          }}
                        >
                          {pickedSub.name}
                        </BodyText>
                        {curActiveKey.includes(pickedSub.id) ? (
                          <ArrowUp style={{ marginLeft: 12 }} />
                        ) : (
                          <ArrowDown style={{ marginLeft: 12 }} />
                        )}
                      </div>
                    }
                    noPadding
                    noBorder
                    arrowHidden
                    style={{ marginBottom: 8 }}
                  >
                    {
                      <CheckboxDynamic
                        key={optIdx}
                        isCheckbox
                        // chosenItems={currentSubPickedOptionSelected}
                        onOneChange={handleSelectPickedOption}
                        data={{
                          customItemClass: 'checkbox-item',
                          optionRadioValue: pickedSub.id,
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
                                    : 'checkbox-item-unactive'
                                }`}
                              >
                                <AttributeOptionLabel
                                  className="w-full"
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
                                        <span className="product-id-value">
                                          {option.pre_option_name}
                                        </span>
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
                                        (el) =>
                                          el.value === option.id && el.label === option.pre_option,
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
                                      style={{
                                        cursor: option.replicate === 1 ? 'default' : 'pointer',
                                      }}
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
                                  <BodyText
                                    customClass="linkage-label"
                                    level={4}
                                    style={{ height: 24 }}
                                  >
                                    Linkage
                                  </BodyText>
                                  <BodyText
                                    fontFamily="Roboto"
                                    level={6}
                                    style={{ height: 24 }}
                                    customClass="flex-center"
                                  >
                                    {getLinkage(option, optionsSelected[curOrder]?.options)}
                                    {/* {option.linkage || 0} */}
                                  </BodyText>
                                </div>
                              </div>
                            ),
                          })),
                        }}
                      />
                    }
                  </CustomCollapse>
                </>
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
                            <AttributeOptionLabel option={el} key={index} userRole={userRole}>
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
                      customClass="checkbox-item"
                      additionalSelected={defaultPreSelect.map(
                        (item: string) => item.split('_')[0],
                      )}
                      onChangeAdditionalSelected={handleOnChangeDefaultPreSelect}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  },
);
