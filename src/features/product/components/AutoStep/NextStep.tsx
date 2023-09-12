import { FC, useEffect, useState } from 'react';

import { message } from 'antd';

// import { ReactComponent as LineRightStepIcon } from '@/assets/icons/line-right-blue-24.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as LineRightDescriptionIcon } from '@/assets/icons/line-right-grey-24.svg';
import { ReactComponent as ActionSlideLeftIcon } from '@/assets/icons/square-single-left-24.svg';
import { ReactComponent as ActionSlideRightIcon } from '@/assets/icons/square-single-right-24.svg';

import { getLinkedOptionByOptionIds } from '../../services';
import { cloneDeep, flatMap, isNull, isUndefined, uniq } from 'lodash';

import { setLinkedOptionData, setPickedOptionId, setSlide, setSlideBar } from '../../reducers';
import {
  AutoStepLinkedOptionResponse,
  LinkedOptionProps,
  LinkedSubOptionProps,
} from '../../types/autoStep';
import { CheckboxValue } from '@/components/CustomCheckbox/types';
import store, { useAppSelector } from '@/reducers';

import CheckboxList from '@/components/CustomCheckbox/CheckboxList';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import { EmptyOne } from '@/components/Empty';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, MainTitle } from '@/components/Typography';

import { AttributeOptionLabel } from '../ProductAttributes/CommonAttribute';
import styles from './AutoStep.less';

interface NextStepProps {
  // options: SubOptionSelectedProps;
  step?: number;
  // setSlide: (slide: number) => void;
}

export const NextStep: FC<NextStepProps> = ({ step }) => {
  // const [curPickeId, setCurPickeId] = useState<string>('');

  const [allLinkedData, setAllLinkedData] = useState<{ [slide: string]: LinkedOptionProps[] }>({});

  const slide = useAppSelector((state) => state.autoStep.slide as number);

  const [forceEnableCollapse, setForceEnableCollapse] = useState<boolean>(false);

  const slideBar = useAppSelector((state) => state.autoStep.slideBar);

  const pickedOptionIds = useAppSelector((state) => state.autoStep.pickedOptionIds);
  const pickedIds = pickedOptionIds[slide]?.pickedIds ?? [];
  const linkedIds = pickedOptionIds[slide]?.linkedIds ?? [];
  const curPickeId = pickedIds[0];

  const curAllLinkedIdSelect = !slide
    ? []
    : flatMap(Object.values(pickedOptionIds[slide - 1].linkedIds));

  const curAllPickedIdSelect = flatMap(
    pickedOptionIds.map((el, index) => (index <= slide ? el.pickedIds : [])),
  );
  const exceptOptionIds = [...curAllPickedIdSelect, ...curAllLinkedIdSelect];

  const linkedOptionData = useAppSelector((state) => state.autoStep.linkedOptionData);
  const pickedData = linkedOptionData[slide]?.pickedData ?? [];
  const linkedData = linkedOptionData[slide]?.linkedData ?? [];

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

  const handleBackToPrevSlide = () => {
    handleForceEnableCollapse();

    const curSlide = cloneDeep(slide);

    if (curSlide === 0) {
      return;
    }

    let newSlide = curSlide;
    --newSlide;

    store.dispatch(setSlide(newSlide));

    const optionId = pickedOptionIds[newSlide].pickedIds.join(',');
    const isGetLinkedOption = optionId && !linkedOptionData[newSlide]?.linkedData.length;

    if (!isGetLinkedOption) {
      return;
    }

    const newLinkedOptionData = [...linkedOptionData];

    if (slide === 0) {
      getLinkedOptionByOptionIds(optionId).then((res) => {
        newLinkedOptionData[newSlide] = { ...newLinkedOptionData[newSlide], linkedData: res };

        store.dispatch(setLinkedOptionData(newLinkedOptionData));
      });
    } else {
      getLinkedOptionByOptionIds(optionId, exceptOptionIds.join(',')).then((res) => {
        newLinkedOptionData[newSlide] = { ...newLinkedOptionData[newSlide], linkedData: res };

        store.dispatch(setLinkedOptionData(newLinkedOptionData));
      });
    }
  };

  /* each slide has 2 steps */
  const handleGoToNextSlide = async () => {
    handleForceEnableCollapse();

    const curSlide = slide;

    if (!slideBar[curSlide] || !slideBar[curSlide + 1]) {
      message.error('Please enter description');
      return;
    }

    const allLinkedIds = flatMap(Object.values(linkedIds));

    if (!allLinkedIds.length || !pickedIds?.length) {
      message.error('Please select options');
      return;
    }

    let newSlide = curSlide;
    ++newSlide;

    store.dispatch(setSlide(newSlide));

    let newSlideBarStep = newSlide;
    ++newSlideBarStep;

    /// add new slide bar
    if (isUndefined(slideBar[newSlideBarStep])) {
      store.dispatch(setSlideBar([...slideBar, '']));
    }

    /// set new picked data selected by all linked data and filter with all linked ids
    const newPickedData: LinkedOptionProps[] = [];

    allLinkedData?.[slide]?.forEach((el) => {
      const subItemSelected: LinkedSubOptionProps[] = [];
      let subOptionId = '';
      let subOptionName = '';

      el.subs.forEach((sub) => {
        const newAllLinkedIds = uniq(flatMap(Object.values(linkedIds).filter(Boolean)));

        if (newAllLinkedIds.includes(sub.id)) {
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

    const oldSlide = curSlide;

    const curPickedDataIds: string[] = flatMap(
      linkedOptionData[newSlide]?.pickedData.map((el) => el.subs.map((item) => item.id)),
    );

    const prevAllLinkedIds = flatMap(Object.values(pickedOptionIds[oldSlide]?.linkedIds));

    /* same option picked = prev all linked ids === cur picked data */
    const isPickedSameOption = curPickedDataIds.every((id) => prevAllLinkedIds?.includes(id));

    const newPickedOptionIds = [...pickedOptionIds];

    // console.log(
    //   newPickedOptionIds?.[oldSlide]?.linkedIds,
    //   '<<======== old linked ids ',
    //   newPickedOptionIds?.[newSlide]?.linkedIds,
    //   '<<======== new linked ids ',
    // );

    // console.log('newPickedIds', newPickedIds);

    /* current linked id is the key of linkedId on cur slide   */
    const curPickedIds = newPickedOptionIds?.[newSlide]?.linkedIds
      ? Object.keys(newPickedOptionIds[newSlide].linkedIds)
      : [];

    // console.log('curPickedIds', curPickedIds);

    const newLinkedId = {};
    if (curPickedIds.length) {
      curPickedIds.forEach((el) => {
        newLinkedId[el] = newPickedOptionIds?.[newSlide]?.linkedIds?.[el]?.length
          ? Object.values(newPickedOptionIds[newSlide].linkedIds[el])
          : [];
      });
    }

    // console.log('newLinkedId', newLinkedId);

    /* new picked id = prev linked id paired with cur picked id */
    const newPickedIds =
      flatMap(Object.values(newPickedOptionIds[oldSlide].linkedIds)).filter((el) =>
        newPickedOptionIds?.[newSlide]?.pickedIds?.includes(el),
      ) ?? [];

    /// filter current pickedIds with prev linkedIds
    newPickedOptionIds[newSlide] = {
      pickedIds: isPickedSameOption
        ? newPickedOptionIds?.[newSlide]?.pickedIds ?? []
        : newPickedIds,
      linkedIds: isPickedSameOption ? newPickedOptionIds?.[newSlide]?.linkedIds ?? {} : newLinkedId,
    };

    // console.log('newPickedOptionIds', newPickedOptionIds);

    const optionId = newPickedOptionIds[newSlide]?.pickedIds?.join(',');

    /// 2 cases to get new linked data ///
    const isGetLinkedOption =
      /// 1: already has picked and linked ids but not have linked data
      (optionId &&
        !linkedOptionData[newSlide]?.linkedData.length &&
        pickedOptionIds[newSlide].linkedIds.length) ||
      /// 2: picked id of current step has been changed; mean prev linked ids has been re-selected, compared to cur picked data
      (optionId && !isPickedSameOption);

    const newLinkedOptionData = [...linkedOptionData];

    let newLinkedData: any = [];

    if (isGetLinkedOption) {
      /* except option id will be get all prev pickedIds selected */

      const newCurAllLinkedIdSelect = !newSlide
        ? []
        : flatMap(Object.values(pickedOptionIds[newSlide - 1].linkedIds));

      const newCurAllPickedIdSelect = flatMap(
        pickedOptionIds.map((el, index) => (index <= slide ? el.pickedIds : [])),
      );

      const newExceptOptionIds = [...newCurAllPickedIdSelect, ...newCurAllLinkedIdSelect];

      newLinkedData = await getLinkedOptionByOptionIds(optionId, newExceptOptionIds.join(','));
    }

    /// update linked option data
    newLinkedOptionData[newSlide] = {
      pickedData: newPickedData,
      linkedData: isPickedSameOption
        ? linkedOptionData[newSlide]?.linkedData ?? []
        : newLinkedData ?? [],
    };

    store.dispatch(setPickedOptionId(newPickedOptionIds));

    store.dispatch(setLinkedOptionData(newLinkedOptionData));
  };

  const handleSelectPickedOption = (opts: CheckboxValue[]) => {
    const newPickedOptionIds = opts.map((el) => el.value).filter(Boolean) as string[];
    const optionId = newPickedOptionIds[newPickedOptionIds.length - 1];

    if (!newPickedOptionIds?.length) {
      store.dispatch(
        setPickedOptionId({
          index: slide,
          pickedIds: [],
          linkedIds: {},
        }),
      );
    } else {
      store.dispatch(
        setPickedOptionId({
          index: slide,
          pickedIds: newPickedOptionIds,
          linkedIds: { [optionId]: linkedIds[optionId] },
        }),
      );
    }

    if (!newPickedOptionIds.length) {
      store.dispatch(setLinkedOptionData({ index: slide, pickedData: pickedData, linkedData: [] }));
      store.dispatch(
        setPickedOptionId({
          index: slide,
          pickedIds: newPickedOptionIds,
          linkedIds: { [optionId]: [] },
        }),
      );

      return;
    }

    //
    getLinkedOptionByOptionIds(optionId, exceptOptionIds.join(',')).then((res) => {
      store.dispatch(
        setLinkedOptionData({ index: slide, pickedData: pickedData, linkedData: res }),
      );
    });
  };

  const handleSelectLinkedOption =
    (curSubs: AutoStepLinkedOptionResponse) => (opts: CheckboxValue[]) => {
      const linkedOptionIds = opts.map((el) => el.value) as string[];

      store.dispatch(
        setPickedOptionId({
          index: slide,
          pickedIds: pickedIds,
          linkedIds: { [curPickeId]: linkedOptionIds },
        }),
      );

      /// set all linked data when select for setting when click to next slide
      setAllLinkedData((prevState) => {
        const newSubs = flatMap(linkedOptionData[slide].linkedData.map((el) => el.subs));

        const result: { [key: string]: LinkedOptionProps[] } = { ...prevState };

        if (!result?.[slide]) {
          result[slide] = [];
        }

        /// get new linked data
        newSubs.forEach((el) => {
          result[slide].push(el);
        });

        // console.log(result, '<<<------- result');

        /// filter option has the same subs
        const finalResult = result[slide].filter(
          (el, index, arr) => arr.map((item) => item.id).indexOf(el.id) === index,
        );

        // console.log({ ...prevState, [slide]: finalResult }, '<<<------- finalResult');

        return { ...prevState, [slide]: finalResult };
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
  // console.log('pickedOptionIds ----->>>', pickedOptionIds);
  // console.log('allLinkedData ----->>>', allLinkedData);
  // console.log('allLinkedData ---->>>', allLinkedData);

  return (
    <div className={styles.nextStep}>
      <div className={styles.topBar}>
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
              <CheckboxList
                key={optIdx}
                filterBySelected
                selected={[{ label: '', value: pickedIds[pickedIds.length - 1] }]}
                onChange={handleSelectPickedOption}
                data={{
                  customItemClass: 'checkbox-item',
                  isSelectAll: true,
                  multipleSelectAll: true,
                  // combinable: true,
                  unTick: !linkedIds?.[pickedIds[pickedIds.length - 1]]?.length,
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
                      <MainTitle
                        level={4}
                        style={{ fontWeight: 600, textTransform: 'capitalize', color: '#000' }}
                      >
                        Select all
                      </MainTitle>
                    </div>
                  ),
                  options: pickedSub.subs.map((option, subIdx) => ({
                    value: option.id,
                    label: (
                      <div className="flex-between w-full">
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
              const selected = linkedIds?.[curPickeId]?.map((el) => ({
                label: '',
                value: el ?? '',
              }));

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
                    selected={selected}
                    chosenItem={selected}
                    forceEnableCollapse={forceEnableCollapse}
                    onChange={handleSelectLinkedOption(option)}
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
