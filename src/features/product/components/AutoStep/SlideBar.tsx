import { FC } from 'react';

import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as LineRightDescriptionIcon } from '@/assets/icons/line-right-grey-24.svg';
import { ReactComponent as ActionSlideLeftIcon } from '@/assets/icons/square-single-left-24.svg';
import { ReactComponent as ActionSlideRightIcon } from '@/assets/icons/square-single-right-24.svg';

import { setSlideBar } from '../../reducers';
import store, { useAppSelector } from '@/reducers';

import { BodyText } from '@/components/Typography';

import styles from './SlideBar.less';

export interface SlideBarProps {
  handleBackToPrevSlide: (props?: { isRemove?: boolean }) => void;
  handleGoToNextSlide: () => void;
  handleRemoveStep?: (index: number) => void;
}

export const SlideBar: FC<SlideBarProps> = ({
  handleBackToPrevSlide,
  handleGoToNextSlide,
  handleRemoveStep,
}) => {
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
          const curStep = index + 1;
          const otherSlide = index >= slide + 2 || index <= slide - 1;

          return (
            <div key={index} className={`flex-start ${otherSlide ? styles.otherSlide : ''}`}>
              <div className={styles.stepCircle} style={{ background: '#2B39D4', border: 'unset' }}>
                <BodyText fontFamily="Roboto" level={5} color="white" style={{ fontWeight: 700 }}>
                  {curStep}
                </BodyText>

                {/* only delete last step */}
                {curOrder > 2 && curStep === slideBar.length && slide === slideBar.length - 2 ? (
                  <div
                    className={styles.removeStep}
                    onClick={() => {
                      handleRemoveStep?.(index);
                    }}
                  >
                    <RemoveIcon />
                  </div>
                ) : null}
              </div>

              <BodyText customClass={styles.description} level={5} fontFamily="Roboto">
                {name || 'description'}

                <input
                  value={name}
                  onChange={handleChangeDescription(index)}
                  className={styles.descriptionInput}
                  placeholder="description"
                  hidden={otherSlide}
                />
              </BodyText>

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
          onClick={() => {
            handleBackToPrevSlide({ isRemove: false });
          }}
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
