import { FC, useEffect, useState } from 'react';

import { Collapse } from 'antd';

// import { ReactComponent as LineRightStepIcon } from '@/assets/icons/line-right-blue-24.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as LineRightDescriptionIcon } from '@/assets/icons/line-right-grey-24.svg';
import { ReactComponent as ActionBackIcon } from '@/assets/icons/single-left.svg';
import { ReactComponent as ActionNextIcon } from '@/assets/icons/single-right.svg';
import { ReactComponent as ActionSlideLeftIcon } from '@/assets/icons/square-single-left-24.svg';
import { ReactComponent as ActionSlideRightIcon } from '@/assets/icons/square-single-right-24.svg';

import { RadioValue } from '@/components/CustomRadio/types';

import CustomButton from '@/components/Button';
import { CollapseLevel1Props } from '@/components/Collapse/Expand';
import CheckboxList from '@/components/CustomCheckbox/CheckboxList';
import DropdownCheckboxList from '@/components/CustomCheckbox/DropdownCheckboxList';
import { CustomRadio } from '@/components/CustomRadio';
import CollapseRadioList from '@/components/CustomRadio/CollapseRadioList';
import DropdownRadioList from '@/components/CustomRadio/DropdownRadioList';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomModal } from '@/components/Modal';
import { BodyText, MainTitle } from '@/components/Typography';

import styles from './AutoStep.less';

interface NextStepProps {
  slide: number;
  setSlide: (slide: number) => void;
}

const NextStep: FC<NextStepProps> = ({ slide, setSlide }) => {
  // const [subItemSelected, setSubItemSelected] = useState<string>('');

  const [topBars, setTopBars] = useState<string[]>(['a']);

  const handleBackToPrevSlide = () => {
    if (slide === 1) {
      return;
    }

    let newSlide = slide;

    setSlide(--newSlide);
  };

  const handleGoToNextSlide = () => {
    if (slide === topBars.length) {
      return;
    }

    let newSlide = slide;

    setSlide(++newSlide);
  };

  const handleChangeDescription = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTopBarData = topBars;

    newTopBarData[index] = e.target.value;

    console.log('newTopBarData', newTopBarData);

    setTopBars(newTopBarData);
  };

  return (
    <div className={styles.nextStep}>
      <div className={styles.topBar}>
        <div className="flex-start">
          {topBars.map((name, index) => {
            let step = index;

            return (
              <div key={index} className="flex-start">
                <div
                  className={styles.stepCircle}
                  style={{ background: '#2B39D4', border: 'unset' }}
                >
                  <BodyText fontFamily="Roboto" level={5} color="white" style={{ fontWeight: 700 }}>
                    {++step}
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
                />
                {index !== topBars.length - 1 ? (
                  <div className={styles.lineRightIcon}>
                    <LineRightDescriptionIcon />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="flex-start">
          <ActionSlideLeftIcon
            className={`${styles.slideLeftIcon} ${slide !== 1 ? styles.activeSlideLeftIcon : ''}`}
            onClick={handleBackToPrevSlide}
          />
          <ActionSlideRightIcon
            className={`${styles.slideRightIcon} ${
              slide !== topBars.length ? styles.activeSlideRightIcon : ''
            }`}
            onClick={handleGoToNextSlide}
          />
        </div>
      </div>
      <div className={styles.mainContent}>
        {/* left side */}
        <div className={styles.content} style={{ marginRight: 8 }}>
          <CheckboxList
            // selected={currentValue}
            // chosenItem={chosenValue}
            data={{
              isSelectAll: true,
              options: [],
              label: (
                <div className="flex-between">
                  <BodyText
                    level={5}
                    fontFamily="Roboto"
                    style={{ fontWeight: 500, textTransform: 'capitalize' }}
                  >
                    Sub Option Name
                  </BodyText>
                  <MainTitle level={4} style={{ fontWeight: 600 }}>
                    Select all
                  </MainTitle>
                </div>
              ),
            }}
            // onChange={setCurrentValue}
          />
        </div>

        {/* right side */}
        <div className={styles.content}>
          <BodyText
            level={5}
            fontFamily="Roboto"
            customClass={styles.header}
            style={{ textTransform: 'capitalize' }}
          >
            select option dataset
          </BodyText>

          <DropdownCheckboxList
            data={[1, 2, 3].map((item) => ({
              label: item,
              options: [12, 21, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el: any) => ({
                label: el,
                value: el,
              })),
            }))}
            renderTitle={(data) => data.label}
            isSelectAll
            // selected={}
            // chosenItem={}
            // onChange={}
          />
        </div>
      </div>
    </div>
  );
};

interface FirstStepProps {
  selected: RadioValue;
  setSelected?: (value: RadioValue) => void;
}

const FirstStep: FC<FirstStepProps> = ({ selected, setSelected }) => {
  const topBarData = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className={styles.firstStep}>
      <div className={styles.topBar}>
        <div className="flex-start">
          {topBarData.map((el, index) => (
            <div key={index} className="flex-start">
              <div className={styles.stepCircle}>
                <BodyText fontFamily="Roboto" level={5} color="mono-color-medium">
                  {el}
                </BodyText>
              </div>
              <BodyText
                fontFamily="Roboto"
                level={5}
                color="mono-color-medium"
                customClass={styles.description}
              >
                description
              </BodyText>
              {index !== topBarData.length - 1 ? (
                <div className={styles.lineRightIcon}>
                  <LineRightDescriptionIcon />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex-start">
          <ActionSlideLeftIcon className={styles.slideLeftIcon} />
          <ActionSlideRightIcon className={styles.slideRightIcon} />
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.content}>
          <BodyText level={5} fontFamily="Roboto" customClass={styles.header}>
            select option dataset
          </BodyText>
          <DropdownRadioList
            data={[12, 21, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el: any, idx) => ({
              label: el,
              options: [12, 21, 2, 3, 10].map((item: any, index) => ({
                label: item,
                value: `${item}-${index}-${idx}`,
              })),
            }))}
            renderTitle={(data) => data.label}
            selected={selected}
            chosenItem={selected}
            onChange={setSelected}
          />
        </div>
      </div>
    </div>
  );
};

interface AutoStepProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  step: number;
}

export const AutoStep: FC<AutoStepProps> = ({ visible, setVisible, step }) => {
  const [curStep, setCurStep] = useState<number>(0);
  const [slide, setSlide] = useState<number>(1);

  const [subOptionSelected, setSubOptionSelected] = useState<RadioValue>({ value: '', label: '' });

  useEffect(() => {
    setCurStep(step);
  }, [step]);

  const handleBackToSelectOption = () => {
    setCurStep(0);
  };

  const handleGoToNextStep = () => {
    setCurStep(1);
  };

  const handleAfterClosePopup = () => {
    setSubOptionSelected({ value: '', label: '' });
    setSlide(1);
    setCurStep(0);
  };

  return (
    <CustomModal
      title={
        <MainTitle level={3} style={{ textTransform: 'uppercase' }}>
          Auto-Steps
        </MainTitle>
      }
      secondaryModal
      visible={visible}
      onCancel={() => setVisible(false)}
      className={styles.modalContainer}
      maskClosable={false}
      afterClose={handleAfterClosePopup}
      width={'80%'}
      closeIcon={<CloseIcon />}
      footer={
        curStep === 0 ? (
          <CustomButton
            size="small"
            properties="rounded"
            disabled={!subOptionSelected.value}
            icon={<ActionNextIcon />}
            onClick={handleGoToNextStep}
          />
        ) : (
          <div className="flex-end">
            <CustomButton
              size="small"
              properties="rounded"
              icon={<ActionBackIcon />}
              onClick={handleBackToSelectOption}
            />
            <CustomButton
              size="small"
              properties="rounded"
              // disabled={slide !== 3}
              style={{ marginLeft: 16 }}
            >
              Create
            </CustomButton>
          </div>
        )
      }
    >
      {curStep === 0 ? (
        <FirstStep selected={subOptionSelected} setSelected={setSubOptionSelected} />
      ) : (
        <NextStep slide={slide} setSlide={setSlide} />
      )}
    </CustomModal>
  );
};
