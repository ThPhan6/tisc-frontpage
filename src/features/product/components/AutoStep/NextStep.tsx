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
import { cloneDeep, flatMap, isNull, isUndefined } from 'lodash';

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
  const slide = useAppSelector((state) => state.autoStep.slide as number);

  let curOrder = slide;
  curOrder += 2;

  const slideBar = useAppSelector((state) => state.autoStep.slideBar);

  const step = useAppSelector((state) => state.autoStep.step);

  const [forceEnableCollapse, setForceEnableCollapse] = useState<boolean>(false);

  const optionsSelected = useAppSelector((state) => state.autoStep.optionsSelected);

  const pickedOptionId = useAppSelector((state) => state.autoStep.pickedOptionId);

  const curPickeId = pickedOptionId[slide];

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

    const isGetLinkedOption =
      /// have picked and linked ids
      !!prevOptionSelected.length &&
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

    if (!isGetLinkedOption) {
      return;
    }
    const optionId = pickedOptionId[curOrder];

    if (slide === 0) {
      const res = await getLinkedOptionByOptionIds(optionId);

      newLinkedOptionData[newSlide] = { ...newLinkedOptionData[newSlide], linkedData: res };

      store.dispatch(setLinkedOptionData(newLinkedOptionData));
    } else {
      const newExceptOptionIds = prevOptionSelected
        .filter((el) => (el?.order as number) <= curOrder)
        .join(',');

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

    const curAllLinkedIdSelect = prevOptionSelected.some((el) => el.order === curOrder);

    console.log('curAllLinkedIdSelect', curAllLinkedIdSelect);

    const isGetLinkedOption =
      /// have picked id
      // !!newOptionsSelected.length &&
      /// have linked id
      curAllLinkedIdSelect &&
      /// have picked data
      !!newLinkedOptionData[newSlide]?.pickedData?.length &&
      /// dont have linked data
      !newLinkedOptionData[newSlide]?.linkedData?.length;

    let newLinkedData: any = [];

    // console.log(
    //   curAllLinkedIdSelect,
    //   !!newLinkedOptionData?.[newSlide]?.pickedData?.length,
    //   !newLinkedOptionData[newSlide]?.linkedData?.length,
    // );

    // console.log('isGetLinkedOption', isGetLinkedOption);

    if (isGetLinkedOption) {
      const optionId = pickedOptionId[curOrder];

      const orders = Object.keys(optionsSelected).map((el) => Number(el));

      let prevAllLinkedIdSelect: string[] = [];

      orders.forEach((order) => {
        if (order < curOrder) {
          const optionSelectedIds = Object.values(
            optionsSelected[order].options.map((el) => el.id),
          );
          prevAllLinkedIdSelect = prevAllLinkedIdSelect.concat(optionSelectedIds);
        }
      });

      const newExceptOptionIds = prevAllLinkedIdSelect.join(',');

      newLinkedData =
        !optionId || (newSlide > 0 && !newExceptOptionIds)
          ? []
          : await getLinkedOptionByOptionIds(optionId, newExceptOptionIds);
    }

    const prevOptionSelectedIds = prevOptionSelected.map((el) => el.id);

    /// next picked data is collected by prev linked data and its option selected
    const newPickedData: LinkedOptionProps[] = [];

    const prevLinkedSubOptions = flatMap(
      linkedOptionData[prevSlide].linkedData.map((el) => el.subs),
    );

    prevLinkedSubOptions.forEach((el) => {
      const a: OptionReplicateResponse[] = [];
      el.subs.forEach((sub) => {
        if (prevOptionSelectedIds.includes(sub.id)) {
          a.push(sub as any);
        }
      });

      if (a.length) {
        newPickedData.push({ id: el.id, name: el.name, subs: a });
      }
    });

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

      if (curPickeId) {
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
  const handleSelectLinkedOption = (/* opts: CheckboxValue[] */ e: CheckboxChangeEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const curLinkedData = flatMap(
      linkedOptionData[slide].linkedData.map((el) => flatMap(el.subs.map((item) => item.subs))),
    );

    const subOptionSelected = curLinkedData.filter((el) => el.id === e.target.value);

    console.log('subOptionSelected', subOptionSelected);

    const prevOptionSeleted = optionsSelected?.[curOrder]?.options ?? [];

    console.log('subOptionSelected', subOptionSelected);

    let a: any[] = prevOptionSeleted;

    subOptionSelected.forEach((el: any) => {
      const optIdx = prevOptionSeleted.findIndex(
        (sub) => sub.id === el.id && sub.pre_option === el.pre_option,
      );

      console.log('optIdx', optIdx);

      if (optIdx > -1) {
        const newa = [...a].splice(optIdx, 1);

        console.log('newa', newa);

        a = newa;
      } else {
        a = prevOptionSeleted.concat([el]);
      }
    });

    console.log('a', a);

    store.dispatch(
      setOptionsSelected({
        order: curOrder,
        options: !prevOptionSeleted.length ? subOptionSelected : a,
      }),
    );
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
  // console.log('optionsSelected ----->>>', optionsSelected);
  // console.log('currentSubLinkedOptionSelected', currentSubLinkedOptionSelected);

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
                          curPickeId === option.id ? 'checkbox-item-active' : ''
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
