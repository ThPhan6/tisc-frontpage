import { FC } from 'react';

import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as LineRightDescriptionIcon } from '@/assets/icons/line-right-grey-24.svg';
import { ReactComponent as ActionSlideLeftIcon } from '@/assets/icons/square-single-left-24.svg';
import { ReactComponent as ActionSlideRightIcon } from '@/assets/icons/square-single-right-24.svg';

import { useCheckPermission } from '@/helper/hook';

import { setSlideBar } from '../../reducers';
import store, { useAppSelector } from '@/reducers';

import { BodyText } from '@/components/Typography';

import styles from './SlideBar.less';

export interface SlideBarProps {
  handleBackToPrevSlide: (props?: { isRemove?: boolean }) => void;
  handleGoToNextSlide: () => void;
  handleRemoveStep?: (index: number) => void;
  className?: string;
  disabledNextSlide?: boolean;
}

export const SlideBar: FC<SlideBarProps> = ({
  className = '',
  disabledNextSlide,
  handleBackToPrevSlide,
  handleGoToNextSlide,
  handleRemoveStep,
}) => {
  const isTiscAdmin = useCheckPermission(['TISC Admin', 'Consultant Team']);

  const slide = useAppSelector((state) => state.autoStep.slide as number);
  const curOrder = slide + 2;

  const slideBars = useAppSelector((state) => state.autoStep.slideBars);

  const handleChangeDescription = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTopBarData = [...slideBars];

    newTopBarData[index] = e.target.value;

    store.dispatch(setSlideBar(newTopBarData));
  };

  return (
    <div className={`${styles.topBar} ${className}`}>
      {/* slide bar */}
      <div className="flex-start">
        {slideBars.map((name, index) => {
          let curStep = index;
          ++curStep;

          const otherSlide = index >= slide + 2 || index <= slide - 1;

          return (
            <div key={index} className={`flex-start ${otherSlide ? styles.otherSlide : ''}`}>
              <div className={styles.stepCircle} style={{ background: '#2B39D4', border: 'unset' }}>
                <BodyText fontFamily="Roboto" level={5} color="white" style={{ fontWeight: 700 }}>
                  {curStep}
                </BodyText>

                {/* only delete last step */}
                {isTiscAdmin &&
                curOrder > 2 &&
                curStep === slideBars.length &&
                slide === slideBars.length - 2 ? (
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

              <BodyText
                customClass={styles.description}
                level={5}
                fontFamily="Roboto"
                color="primary-color-dark"
              >
                {name || (
                  <BodyText level={5} fontFamily="Roboto" color="mono-color-dark">
                    description
                  </BodyText>
                )}

                {isTiscAdmin ? (
                  <input
                    value={name}
                    onChange={handleChangeDescription(index)}
                    className={styles.descriptionInput}
                    placeholder="description"
                    hidden={otherSlide}
                  />
                ) : null}
              </BodyText>

              {index !== slideBars.length - 1 ? (
                <div
                  className={`${styles.lineRightIcon} ${
                    index === curOrder - 1
                      ? styles.inactiveLineRightIcon
                      : styles.activeLineRightIcon
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
          className={`${styles.slideLeftIcon} ${
            slide !== 0 ? styles.activeSlideLeftIcon : ''
          } slide-left-icon`}
          onClick={() => {
            if (slide !== 0) {
              handleBackToPrevSlide({ isRemove: false });
            }
          }}
        />
        <ActionSlideRightIcon
          className={`${styles.slideRightIcon} ${
            disabledNextSlide ? styles.inactiveSlideRightIcon : styles.activeSlideRightIcon
          } slide-right-icon`}
          onClick={disabledNextSlide ? undefined : handleGoToNextSlide}
        />
      </div>
    </div>
  );
};
