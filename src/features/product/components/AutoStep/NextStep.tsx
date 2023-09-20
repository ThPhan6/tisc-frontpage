import { FC, useEffect, useState } from 'react';

import { message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

// import { ReactComponent as LineRightStepIcon } from '@/assets/icons/line-right-blue-24.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as LineRightDescriptionIcon } from '@/assets/icons/line-right-grey-24.svg';
import { ReactComponent as ActionSlideLeftIcon } from '@/assets/icons/square-single-left-24.svg';
import { ReactComponent as ActionSlideRightIcon } from '@/assets/icons/square-single-right-24.svg';

import { getLinkedOptionByOptionIds } from '../../services';
import { uniqueArrayBy } from '@/helper/utils';
import { cloneDeep, flatMap, isNull, isUndefined, trimEnd, uniq, uniqBy } from 'lodash';

import {
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

import { CheckboxDynamic } from '@/components/CustomCheckbox/CheckboxDynamic';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import { EmptyOne } from '@/components/Empty';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import { AttributeOptionLabel } from '../ProductAttributes/CommonAttribute';
import styles from './AutoStep.less';

interface NextStepProps {
  // options: SubOptionSelectedProps;
  // setSlide: (slide: number) => void;
}
export const NextStep: FC<NextStepProps> = ({}) => {
  const [forceEnableCollapse, setForceEnableCollapse] = useState<boolean>(false);
  const [allLinkedData, setAllLinkedData] = useState<{ [slide: string]: LinkedOptionProps[] }>({});

  const slide = useAppSelector((state) => state.autoStep.slide as number);
  let curOrder = slide;
  curOrder += 2;

  const slideBar = useAppSelector((state) => state.autoStep.slideBar);

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

  const subPreOptionSelected =
    optionsSelected?.[curOrder]?.options?.map((el) => el.pre_option).filter(Boolean) ?? [];

  const currentSubPickedOptionSelected = allPickedSubs.filter((sub) =>
    subPreOptionSelected.includes(sub.value),
  );
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

    const newAllLinkedData: { [slide: string]: LinkedOptionProps[] } = {};

    linkedOptionData.forEach((el, index) => {
      if (index === 0) {
        return;
      }

      if (!newAllLinkedData[index - 1]) {
        newAllLinkedData[index - 1] = [];
      }

      newAllLinkedData[index - 1] = el.pickedData;
    });

    setAllLinkedData(newAllLinkedData);

    handleForceEnableCollapse();
  }, [step]);

  const handleChangeDescription = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTopBarData = [...slideBar];

    newTopBarData[index] = e.target.value;

    store.dispatch(setSlideBar(newTopBarData));
  };

  const handleBackToPrevSlide = async () => {
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

    if (!isGetLinkedOption || !currentPickedOption) {
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

      newLinkedOptionData[newSlide] = { ...newLinkedOptionData[newSlide], linkedData: res };

      store.dispatch(setLinkedOptionData(newLinkedOptionData));
    }
  };

  /* each slide has 2 steps */
  const handleGoToNextSlide = async () => {
    handleForceEnableCollapse();

    const prevSlide = slide;

    if (!slideBar[prevSlide] || !slideBar[prevSlide + 1]) {
      message.error('Please enter description');
      return;
    }

    const curOptionSelected = optionsSelected?.[curOrder]?.options ?? [];
    const curAllLinkedIdSelect = curOptionSelected.map((el) => el.id);

    if (!curOptionSelected.length) {
      message.error('Please select options');
      return;
    }

    let newSlide = prevSlide;
    ++newSlide;

    store.dispatch(setSlide(newSlide));

    let newSlideBarStep = newSlide;
    ++newSlideBarStep;

    /// add new slide bar for next step
    if (isUndefined(slideBar[newSlideBarStep])) {
      store.dispatch(setSlideBar([...slideBar, '']));
    }

    const newLinkedOptionData = [...linkedOptionData];

    const isGetLinkedOption =
      /// have linked id
      !!curAllLinkedIdSelect.length &&
      /// have picked data
      !!newLinkedOptionData[newSlide]?.pickedData?.length &&
      /// dont have linked data
      !newLinkedOptionData[newSlide]?.linkedData?.length;

    let newLinkedData: any = [];

    const currentPickedOption = pickedOption[newSlide];
    /// call rest option when update
    if (isGetLinkedOption && currentPickedOption) {
      const orders = Object.keys(optionsSelected).map((el) => Number(el));

      let prevAllLinkedIdSelect: string[] = [];

      orders.forEach((order) => {
        if (order <= curOrder) {
          const optionSelectedIds = optionsSelected[order].options.map((el) => el.id);

          prevAllLinkedIdSelect = uniq(prevAllLinkedIdSelect.concat(optionSelectedIds));
        }
      });

      const newExceptOptionIds = prevAllLinkedIdSelect.join(',');

      newLinkedData =
        newSlide > 0 && !newExceptOptionIds
          ? []
          : await getLinkedOptionByOptionIds(currentPickedOption.id, newExceptOptionIds);
    }

    /// next picked data is collected by prev linked data and its option selected
    const newPickedData: LinkedOptionProps[] = [];

    /* all options selected in multiple groups */
    allLinkedData?.[prevSlide]?.forEach((el) => {
      const subItemSelected: OptionReplicateResponse[] = [];
      let subOptionId = '';
      let subOptionName = '';

      el.subs.forEach((sub) => {
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

    // /* all options selected in single group */
    // const prevPickedId = pickedOption[prevSlide];

    // const prevOptionSelectedIds = prevOptionSelected
    //   .map((el) => (el.pre_option === prevPickedId ? el.id : undefined))
    //   .filter(Boolean) as any;

    // const prevLinkedSubOptions = flatMap(
    //   linkedOptionData[prevSlide].linkedData.map((el) => el.subs),
    // );

    // prevLinkedSubOptions.forEach((el) => {
    //   const subs: OptionReplicateResponse[] = [];

    //   el.subs.forEach((sub) => {
    //     if (prevOptionSelectedIds.includes(sub.id)) {
    //       subs.push(sub as any);
    //     }
    //   });

    //   if (subs.length) {
    //     newPickedData.push({ id: el.id, name: el.name, subs: subs });
    //   }
    // });
    /* ------------------------------------------------------------------------ */

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

  const handleSelectPickedOption = (e: CheckboxChangeEvent) => {
    const curOptionSelected = {
      id: e.target.value,
      pre_option: (e.target as any).pre_option,
    };

    const isPrevPickedOption =
      curPicked?.id === curOptionSelected.id &&
      curPicked?.pre_option === curOptionSelected.pre_option;

    const curPickedSubData = flatMap(pickedData.map((el) => el.subs));

    const curPickedOption = curPickedSubData.find(
      (el) => el.id === curOptionSelected.id && el.pre_option === curOptionSelected.pre_option,
    );

    if (isPrevPickedOption) {
      store.dispatch(setLinkedOptionData({ index: slide, pickedData: pickedData, linkedData: [] }));

      if (curPickedOption?.id) {
        store.dispatch(setPickedOption({ slide: slide, id: '', pre_option: '' }));
      }
    } else if (curPickedOption?.id) {
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

    console.log(curOrder, curPickedOption);

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
                return {
                  ...sub,
                  sub_id: item.id,
                  sub_name: item.name,
                  pre_option: curPickedOption.id,
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
    (event: CheckboxChangeEvent | { isSelectedAll: boolean; optionIds: string[] }) => {
      const { isSelectedAll, optionIds } = event as {
        isSelectedAll: boolean;
        optionIds: string[];
      };

      const curLinkedData = flatMap(
        linkedOptionData[slide].linkedData.map((el) => flatMap(el.subs.map((item) => item.subs))),
      );

      const curOptionSelect = (event as any).target?.value
        ? (curLinkedData.filter(
            (el) => el.id === (event as any).target.value,
          ) as OptionReplicateResponse[])
        : curLinkedData.filter((el) => optionIds.includes(el.id)).filter(Boolean);

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
        ? curOptionSelect.filter(Boolean)
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

      /*
        /// prev
        //* slide 2
        * picked: [<m>,n,z]
        * linked: [<a>,<b>,<c>]
        //* slide 3
        * picked: [<a>,b,c]
        * linked: [v,b,n]

        //* in case, the next order already has picked-option selected(highlighted) and linked-option related to that picked-option has selected;
        //* then back to prev step, deselect that current option highlighted of the next step => need to remove that option, remove it linked-option, and remove current pickedId in the next step and its following

        /// current
        //* slide 2
        * picked: [<m>,n,z]
        * linked: [a,<b>,<c>]
        //* slide 3
        * picked: [b,c]
        * linked: []
      */
      let nextOrder = curOrder;
      ++nextOrder;
      if (optionsSelected[nextOrder]) {
        const nextOptionsSelected = optionsSelected[nextOrder].options;

        const prevOptionsSelectedIds = result.map((el) => el.id);

        /* delete linked-option seleted related */
        const newNextOptionSelected = nextOptionsSelected.filter((el) =>
          prevOptionsSelectedIds.includes(el.pre_option as string),
        );
        // update linked-option seleted
        store.dispatch(
          setOptionsSelected({
            order: nextOrder,
            options: newNextOptionSelected,
          }),
        );

        /* remove next pickedId hightlighted */
        const nextPickedOption = pickedOption[slide + 1];
        store.dispatch(
          setPickedOption({
            slide: slide + 1,
            id: prevOptionsSelectedIds.includes(nextPickedOption.id) ? nextPickedOption.id : '',
            pre_option: prevOptionsSelectedIds.includes(nextPickedOption.id)
              ? nextPickedOption.pre_option
              : '',
            // name: prevOptionsSelectedIds.includes(nextPickedOption.id) ? nextPickedOption.name : '',
          }),
        );

        /* delete data related */
        const nextLinkedData = linkedOptionData[slide + 1].linkedData;
        let dataIdx: number = -1;

        /// find index of data need to delete
        nextLinkedData.forEach((el, index) => {
          if (dataIdx > -1) {
            return;
          }

          el.subs.forEach((item) => {
            if (dataIdx > -1) {
              return;
            }

            item.subs.forEach((sub) => {
              if (dataIdx > -1) {
                return;
              }

              if (!prevOptionsSelectedIds.includes(sub.pre_option as string)) {
                dataIdx = index;
              }
            });
          });
        });

        if (dataIdx > -1) {
          const newNextLinkeData = [...nextLinkedData];
          newNextLinkeData.splice(dataIdx, 1);

          store.dispatch(
            setLinkedOptionData({
              index: slide + 1,
              linkedData: newNextLinkeData,
              pickedData: pickedData,
            }),
          );
        }
      }

      /// set all linked-options selected in multiple groups(with diff picked options) for the next slide
      setAllLinkedData((prevState) => {
        const newSubs = flatMap(linkedOptionData[slide].linkedData.map((el) => el.subs));

        let allLinkedDataHasOptionSelected: { [key: string]: LinkedOptionProps[] } = {
          ...prevState,
        };

        if (!allLinkedDataHasOptionSelected?.[slide]) {
          allLinkedDataHasOptionSelected[slide] = [];
        }

        /// get new linked data
        newSubs.forEach((el) => {
          const newResult = { ...allLinkedDataHasOptionSelected };
          newResult[slide] = newResult[slide].concat([el]);
          allLinkedDataHasOptionSelected = newResult;
        });

        const newAllLinkedData: LinkedOptionProps[] = [];

        /* get all options selected, that means one group may be has duplicate options   selected */
        allLinkedDataHasOptionSelected[slide].forEach((opt) => {
          const subs: any[] = [];
          let id: string = '';
          let name: string = '';

          result.forEach((el) => {
            if (opt.id === el.sub_id) {
              id = opt.id;
              name = opt.name;
              subs.push(el);
            }
          });

          if (id && name && subs.length) {
            newAllLinkedData.push({ id, name, subs });
          }
        });

        const newAllUniqueLinkedData = uniqBy(newAllLinkedData, 'id');

        /// filter group option has the same subs, in case want to gather unique options into the same group
        // allLinkedDataHasOptionSelected[slide].reduce(
        //   (pre: any, cur: any) => {
        //     const found = pre.find((item: any) => item.id === cur.id);

        //     if (!found) {
        //       return pre.concat([cur]);
        //     }

        //     return pre.filter((item: any) => item.id !== cur.id);
        //     .concat([
        //       {
        //         id: cur.id,
        //         name: cur.name,
        //         subs: uniqBy(found.subs.concat(cur.subs), 'id'),
        //       },
        //     ])
        //   },
        //   [],
        // );

        return { ...prevState, [slide]: newAllUniqueLinkedData };
      });
    };

  const handleDecreaseReplicate =
    (subOpt: LinkedSubOptionProps) => (e: React.MouseEvent<SVGSVGElement>) => {
      e.stopPropagation();
      e.preventDefault();

      if (
        subOpt.replicate === 1 ||
        currentSubPickedOptionSelected?.some(
          (el) => el.value !== subOpt.id && el.label !== subOpt.pre_option,
        )
      ) {
        return;
      }

      const newPickedData = cloneDeep(pickedData).map((el) => ({
        ...el,
        subs: el.subs.map((sub) => ({
          ...sub,
          replicate: sub.id === subOpt.id ? --sub.replicate : sub.replicate,
        })),
      }));

      store.dispatch(
        setLinkedOptionData({ index: slide, pickedData: newPickedData, linkedData: linkedData }),
      );

      const newCurOptionSelected = cloneDeep(optionsSelected)[curOrder - 1].options.map((sub) => ({
        ...sub,
        replicate: sub.id === subOpt.id ? --sub.replicate : sub.replicate,
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

      if (
        currentSubPickedOptionSelected?.some(
          (el) => el.value !== subOpt.id && el.label !== subOpt.pre_option,
        )
      ) {
        return;
      }

      const newPickedData = cloneDeep(pickedData).map((el) => ({
        ...el,
        subs: el.subs.map((sub) => ({
          ...sub,
          replicate: sub.id === subOpt.id ? ++sub.replicate : sub.replicate,
        })),
      }));

      store.dispatch(
        setLinkedOptionData({ index: slide, pickedData: newPickedData, linkedData: linkedData }),
      );

      const newCurOptionSelected = cloneDeep(optionsSelected)[curOrder - 1].options.map((sub) => ({
        ...sub,
        replicate: sub.id === subOpt.id ? ++sub.replicate : sub.replicate,
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
      {/* top bar */}
      <div className={styles.topBar}>
        {/* slide bar */}
        <div className="flex-start">
          {slideBar.map((name, index) => {
            let newStep = index;
            const otherSlide = index >= slide + 2 || index <= slide - 1;
            return (
              <div key={index} className={`flex-start ${otherSlide ? styles.otherSlide : ''}`}>
                <div
                  className={styles.stepCircle}
                  style={{ background: '#2B39D4', border: 'unset' }}
                >
                  <BodyText fontFamily="Roboto" level={5} color="white" style={{ fontWeight: 700 }}>
                    {++newStep}
                  </BodyText>
                </div>
                <CustomInput
                  fontLevel={5}
                  containerClass={styles.description}
                  value={name}
                  onChange={handleChangeDescription(index)}
                  autoWidth
                  defaultWidth={74}
                  placeholder="description"
                  readOnly={otherSlide}
                />
                {index !== slideBar.length - 1 ? (
                  <div className={`${styles.lineRightIcon} ${styles.activeLineRightIcon}`}>
                    <LineRightDescriptionIcon />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* slide action */}
        <div className="flex-start slide-icons">
          <ActionSlideLeftIcon
            className={`${styles.slideLeftIcon} ${slide !== 0 ? styles.activeSlideLeftIcon : ''}`}
            onClick={handleBackToPrevSlide}
          />
          <ActionSlideRightIcon
            className={`${styles.slideRightIcon} ${
              slide !== slideBar.length ? styles.activeSlideRightIcon : ''
            }`}
            onClick={handleGoToNextSlide}
          />
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* left side */}
        <div className={styles.content} style={{ marginRight: 8 }}>
          {pickedData.map((pickedSub, optIdx) => {
            return (
              <CheckboxDynamic
                key={optIdx}
                // filterBySelected
                chosenItems={currentSubPickedOptionSelected}
                onOneChange={handleSelectPickedOption}
                data={{
                  customItemClass: 'checkbox-item',
                  isSelectAll: true,
                  multipleSelectAll: true,
                  optionRadioValue: pickedSub.id,
                  disabledSelectAll: true,
                  // disabledSelectAll:
                  //   currentSubPickedOptionSelected.length !== pickedSub.subs.length,
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
                            <div className="product-id">
                              <span className="product-id-label">Product ID:</span>
                              <span className="product-id-value">{option.product_id}</span>
                            </div>
                          </div>
                        </AttributeOptionLabel>
                        <div
                          className="replicate"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          <BodyText level={4} style={{ height: 24 }}>
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
                      })),
                    }))}
                    showCount={false}
                    renderTitle={(data) => data.label}
                    selected={currentSubLinkedOptionSelected}
                    chosenItem={currentSubLinkedOptionSelected}
                    forceEnableCollapse={forceEnableCollapse}
                    onOneChange={handleSelectLinkedOption(option)}
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
