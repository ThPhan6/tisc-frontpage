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
import { cloneDeep, flatMap, isNull, isUndefined, uniqBy } from 'lodash';

import {
  setLinkedOptionData,
  setOptionsSelected,
  setPickedOptionId,
  setSlide,
  setSlideBar,
} from '../../reducers';
import {
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
  const [allLinkedData, setAllLinkedData] = useState<{ [slide: string]: LinkedOptionProps[] }>({});

  const slide = useAppSelector((state) => state.autoStep.slide as number);

  let curOrder = slide;
  curOrder += 2;

  const slideBar = useAppSelector((state) => state.autoStep.slideBar);

  const step = useAppSelector((state) => state.autoStep.step);

  const [forceEnableCollapse, setForceEnableCollapse] = useState<boolean>(false);

  const optionsSelected = useAppSelector((state) => state.autoStep.optionsSelected);

  const pickedOptionId = useAppSelector((state) => state.autoStep.pickedOptionId);

  const curPickedId = pickedOptionId[slide];

  const linkedOptionData = useAppSelector((state) => state.autoStep.linkedOptionData);
  const pickedData = linkedOptionData?.[slide]?.pickedData ?? [];
  const linkedData = linkedOptionData?.[slide]?.linkedData ?? [];

  const allLinkedSubs = flatMap(linkedData.map((el) => flatMap(el.subs.map((sub) => sub.subs))));

  /* current option selected on right panel on each step */
  const currentOptionSelected = optionsSelected?.[curOrder]?.options ?? [];

  const subLinkedOptionSelected: CheckboxValue[] =
    currentOptionSelected.map((el) => ({
      value: el.id,
      label: el.pre_option,
    })) ?? [];

  console.log('allLinkedSubs', allLinkedSubs);
  console.log('subLinkedOptionSelected', subLinkedOptionSelected);

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

    let prevOrder = curOrder;
    --prevOrder;
    const prevOptionSelected = optionsSelected[prevOrder].options;

    const newLinkedOptionData = [...linkedOptionData];

    const curAllLinkedIdSelect = prevOptionSelected.map((el) => el.id);

    const isGetLinkedOption =
      /// have linked id
      !!curAllLinkedIdSelect.length &&
      /// have picked data
      !!newLinkedOptionData[newSlide]?.pickedData?.length &&
      /// dont have linked data
      !newLinkedOptionData[newSlide]?.linkedData?.length;

    // console.log(
    //   optionsSelected[newSlide]?.pickedIds,
    //   curAllLinkedIdSelect,
    //   newLinkedOptionData[newSlide].linkedData,
    //   newLinkedOptionData[newSlide].pickedData,
    // );

    // console.log('isGetLinkedOption', !isGetLinkedOption);

    const optionId = pickedOptionId[newSlide];

    if (!isGetLinkedOption || !optionId) {
      return;
    }

    if (slide === 0) {
      const res = await getLinkedOptionByOptionIds(optionId);

      newLinkedOptionData[newSlide] = { ...newLinkedOptionData[newSlide], linkedData: res };

      store.dispatch(setLinkedOptionData(newLinkedOptionData));
    } else {
      const orders = Object.keys(optionsSelected).map((el) => Number(el));

      let prevAllLinkedIdSelect: string[] = [];

      console.log('curOrder', curOrder);

      orders.forEach((order) => {
        if (order < curOrder) {
          const optionSelectedIds = optionsSelected[order].options.map((el) => el.id);

          prevAllLinkedIdSelect = prevAllLinkedIdSelect.concat(optionSelectedIds);
        }
      });

      const newExceptOptionIds = prevAllLinkedIdSelect.join(',');

      const res = await getLinkedOptionByOptionIds(optionId, newExceptOptionIds);

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

    const prevOptionSelected = optionsSelected?.[curOrder]?.options ?? [];

    if (!prevOptionSelected.length) {
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

    const curAllLinkedIdSelect = prevOptionSelected.map((el) => el.id);

    const isGetLinkedOption =
      /// have linked id
      !!curAllLinkedIdSelect.length &&
      /// have picked data
      !!newLinkedOptionData[newSlide]?.pickedData?.length &&
      /// dont have linked data
      !newLinkedOptionData[newSlide]?.linkedData?.length;

    let newLinkedData: any = [];

    // console.log(
    //   !!curAllLinkedIdSelect.length,
    //   !!newLinkedOptionData?.[newSlide]?.pickedData?.length,
    //   !newLinkedOptionData[newSlide]?.linkedData?.length,
    // );

    const optionId = pickedOptionId[newSlide];
    /// call rest option when update
    if (isGetLinkedOption && optionId) {
      const orders = Object.keys(optionsSelected).map((el) => Number(el));

      let prevAllLinkedIdSelect: string[] = [];

      orders.forEach((order) => {
        if (order < curOrder) {
          const optionSelectedIds = optionsSelected[order].options.map((el) => el.id);

          prevAllLinkedIdSelect = prevAllLinkedIdSelect.concat(optionSelectedIds);
        }
      });

      const newExceptOptionIds = prevAllLinkedIdSelect.join(',');

      newLinkedData =
        newSlide > 0 && !newExceptOptionIds
          ? []
          : await getLinkedOptionByOptionIds(optionId, newExceptOptionIds);
    }

    /// next picked data is collected by prev linked data and its option selected
    const newPickedData: LinkedOptionProps[] = [];

    const prevOptionSelectedIds = prevOptionSelected.map((el) => el.id);

    /* all prev options in multiple groups(with diff picked options) selected */
    allLinkedData?.[prevSlide]?.forEach((el) => {
      const subItemSelected: LinkedSubOptionProps[] = [];
      let subOptionId = '';
      let subOptionName = '';

      el.subs.forEach((sub) => {
        if (prevOptionSelectedIds.includes(sub.id)) {
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

    // /* all options selected in multiple groups(with single picked option) */
    // const prevPickedId = pickedOptionId[prevSlide];
    // const prevOptionSelectedIds = prevOptionSelected
    //   .map((el) => (el.pre_option === prevPickedId ? el.id : undefined))
    //   .filter(Boolean) as any;
    // const prevLinkedSubOptions = flatMap(
    //   linkedOptionData[prevSlide].linkedData.map((el) => el.subs),
    // );
    // prevLinkedSubOptions.forEach((el) => {
    //   const a: OptionReplicateResponse[] = [];
    //   el.subs.forEach((sub) => {
    //     if (prevOptionSelectedIds.includes(sub.id)) {
    //       a.push(sub as any);
    //     }
    //   });
    //   if (a.length) {
    //     newPickedData.push({ id: el.id, name: el.name, subs: a });
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

  const handleSelectPickedOption = (subOpt: LinkedOptionProps) => (opts: CheckboxValue[]) => {
    const newOptionsSelected = opts.map((el) => el.value).filter(Boolean) as string[];
    const optionId = newOptionsSelected[newOptionsSelected.length - 1];

    if (slide === 0) {
      store.dispatch(
        setOptionsSelected({
          order: 1,
          options: subOpt.subs
            .map((el) =>
              optionId === el.id
                ? ({ ...el, sub_id: subOpt.id, sub_name: subOpt.name } as any)
                : undefined,
            )
            .filter(Boolean),
        }),
      );
    }

    if (!newOptionsSelected?.length) {
      store.dispatch(setLinkedOptionData({ index: slide, pickedData: pickedData, linkedData: [] }));

      if (curPickedId) {
        store.dispatch(setPickedOptionId({ slide: slide, pickedId: '' }));
      }
    } else {
      store.dispatch(setPickedOptionId({ slide: slide, pickedId: optionId }));
    }

    const orders = Object.keys(optionsSelected).map((el) => Number(el));

    let prevAllLinkedIdSelect: string[] = [];

    orders.forEach((order) => {
      if (order < curOrder) {
        const optionSelectedIds = Object.values(optionsSelected[order].options.map((el) => el.id));
        prevAllLinkedIdSelect = prevAllLinkedIdSelect.concat(optionSelectedIds);
      }
    });

    const newExceptOptionId = slide === 0 ? undefined : prevAllLinkedIdSelect.join(',');

    //
    getLinkedOptionByOptionIds(optionId, newExceptOptionId).then((res) => {
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
              subs: item.subs.map((sub) => ({
                ...sub,
                sub_id: item.id,
                sub_name: item.name,
                pre_option: optionId,
              })),
            })),
          })),
        }),
      );
    });
  };
  //
  const handleSelectLinkedOption = (e: CheckboxChangeEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const curLinkedData = flatMap(
      linkedOptionData[slide].linkedData.map((el) => flatMap(el.subs.map((item) => item.subs))),
    );

    const curOptionSelect = curLinkedData.filter(
      (el) => el.id === e.target.value,
    ) as OptionReplicateResponse[];

    const prevOptionSeleted = optionsSelected?.[curOrder]?.options ?? [];

    let newOptionsSelected: OptionReplicateResponse[] = prevOptionSeleted;

    /* update select */
    curOptionSelect.forEach((el: any) => {
      const optIdx = prevOptionSeleted.findIndex(
        (sub) => sub.id === el.id && sub.pre_option === el.pre_option,
      );

      if (optIdx > -1) {
        const newa = [...newOptionsSelected];
        newa.splice(optIdx, 1);
        newOptionsSelected = newa;
      } else {
        newOptionsSelected = prevOptionSeleted.concat([el]);
      }
    });

    const result = !prevOptionSeleted.length ? curOptionSelect : newOptionsSelected;

    store.dispatch(
      setOptionsSelected({
        order: curOrder,
        options: result,
      }),
    );

    /*
    /// prev
    //* slide 2
    * picked: [<m>,n,z]
    * linked: [<a>,<b>,<c>]
    //* slide 3
    * picked: [<a>,b,c]
    * linked: [v,b,n]

    //* in case, the next order already has picked-option selected(highlighted) and linked-option related to that picked-option has selected;
    //* then back to prev step, deselect that current option highlighted of the next step => remove that option, remove it linked-option, and remove current pickedId in the next step

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
      const nextPickedId = pickedOptionId[slide + 1];
      store.dispatch(
        setPickedOptionId({
          slide: slide + 1,
          pickedId: prevOptionsSelectedIds.includes(nextPickedId) ? nextPickedId : '',
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

      let allLinkedDataHasOptionSelected: { [key: string]: LinkedOptionProps[] } = { ...prevState };

      if (!allLinkedDataHasOptionSelected?.[slide]) {
        allLinkedDataHasOptionSelected[slide] = [];
      }

      /// get new linked data
      newSubs.forEach((el) => {
        const newResult = { ...allLinkedDataHasOptionSelected };
        newResult[slide] = newResult[slide].concat([el]);
        allLinkedDataHasOptionSelected = newResult;
      });

      /// filter option has the same subs
      const newAllLinkedData = allLinkedDataHasOptionSelected[slide].reduce(
        (pre: any, cur: any) => {
          const found = pre.find((item: any) => item.id === cur.id);

          if (!found) {
            return pre.concat([cur]);
          }

          return pre
            .filter((item: any) => item.id !== cur.id)
            .concat([
              {
                id: cur.id,
                name: cur.name,
                subs: uniqBy(found.subs.concat(cur.subs), 'id'),
              },
            ]);
        },
        [],
      );

      return { ...prevState, [slide]: newAllLinkedData };
    });
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
          replicate: sub.id === subOpt.id ? --sub.replicate : 1,
        })),
      }));

      store.dispatch(
        setLinkedOptionData({ index: slide, pickedData: newPickedData, linkedData: linkedData }),
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
          replicate: sub.id === subOpt.id ? ++sub.replicate : sub.replicate,
        })),
      }));

      store.dispatch(
        setLinkedOptionData({ index: slide, pickedData: newPickedData, linkedData: linkedData }),
      );
    };

  // console.log('linkedOptionData ---->>>', linkedOptionData);
  // console.log('allLinkedData ---->>>', allLinkedData);
  // console.log('optionsSelected ----->>>', optionsSelected);
  // console.log('pickedOptionId ----->>>', pickedOptionId);

  console.log('#######################################################');

  return (
    <div className={styles.nextStep}>
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
            const allSubs = flatMap(
              pickedSub.subs.map((el) => ({
                value: el.id,
                label: el.product_id,
              })),
            );

            const subPreOptionSelected =
              optionsSelected?.[curOrder]?.options?.map((el) => el.pre_option).filter(Boolean) ??
              [];

            const chosenItems = allSubs.filter((sub) => subPreOptionSelected.includes(sub.value));

            return (
              <CheckboxDynamic
                key={optIdx}
                filterBySelected
                chosenItems={chosenItems}
                onChange={handleSelectPickedOption(pickedSub)}
                data={{
                  customItemClass: 'checkbox-item',
                  isSelectAll: true,
                  multipleSelectAll: true,
                  optionRadioValue: pickedSub.id,
                  disabledSelectAll: chosenItems.length !== pickedSub.subs.length,
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
                    value: option.id,
                    label: (
                      <div
                        className={`flex-between w-full ${
                          curPickedId === option.id ? 'checkbox-item-active' : ''
                        }`}
                      >
                        <AttributeOptionLabel option={option} key={subIdx}>
                          <div>
                            <span className="product-id-label">Product ID:</span>
                            <span className="product-id-value">{option.product_id}</span>
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
                            className="flex-start"
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
                            <BodyText fontFamily="Roboto" level={6} style={{ padding: '0 8px' }}>
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
                    // onChange={handleSelectLinkedOption}
                    onOneChange={handleSelectLinkedOption}
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
