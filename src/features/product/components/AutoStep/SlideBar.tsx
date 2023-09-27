import { FC } from 'react';

import { ReactComponent as LineRightDescriptionIcon } from '@/assets/icons/line-right-grey-24.svg';
import { ReactComponent as ActionSlideLeftIcon } from '@/assets/icons/square-single-left-24.svg';
import { ReactComponent as ActionSlideRightIcon } from '@/assets/icons/square-single-right-24.svg';

import { setSlideBar } from '../../reducers';
import store, { useAppSelector } from '@/reducers';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import styles from './SlideBar.less';

export interface SlideBarProps {
  handleBackToPrevSlide: () => void;
  handleGoToNextSlide: () => void;
}

export const SlideBar: FC<SlideBarProps> = ({ handleBackToPrevSlide, handleGoToNextSlide }) => {
  const slide = useAppSelector((state) => state.autoStep.slide as number);
  const curOrder = slide + 2;

  const slideBar = useAppSelector((state) => state.autoStep.slideBar);

  const handleChangeDescription = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTopBarData = [...slideBar];

    newTopBarData[index] = e.target.value;

    store.dispatch(setSlideBar(newTopBarData));
  };

  return (
    <div className={styles.topBar}>
      {/* slide bar */}
      <div className="flex-start">
        {slideBar.map((name, index) => {
          let newStep = index;
          const otherSlide = index >= slide + 2 || index <= slide - 1;
          return (
            <div key={index} className={`flex-start ${otherSlide ? styles.otherSlide : ''}`}>
              <div className={styles.stepCircle} style={{ background: '#2B39D4', border: 'unset' }}>
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
                defaultWidth={76}
                placeholder="description"
                readOnly={otherSlide}
              />
              {index !== slideBar.length - 1 ? (
                <div
                  className={`${styles.lineRightIcon} ${styles.activeLineRightIcon} ${
                    index === curOrder - 1 ? styles.inactiveLineRightIcon : ''
                  }`}
                >
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
  );
};
