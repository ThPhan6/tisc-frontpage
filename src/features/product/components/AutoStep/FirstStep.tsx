import { FC } from 'react';

// import { ReactComponent as LineRightStepIcon } from '@/assets/icons/line-right-blue-24.svg';
import { ReactComponent as LineRightDescriptionIcon } from '@/assets/icons/line-right-grey-24.svg';
import { ReactComponent as ActionSlideLeftIcon } from '@/assets/icons/square-single-left-24.svg';
import { ReactComponent as ActionSlideRightIcon } from '@/assets/icons/square-single-right-24.svg';

import { RadioValue } from '@/components/CustomRadio/types';
import { ProductAttributes } from '@/types';

import DropdownRadioList from '@/components/CustomRadio/DropdownRadioList';
import { BodyText } from '@/components/Typography';

import styles from './AutoStep.less';

const topBarData = [1, 2, 3, 4, 5, 6, 7];

interface FirstStepProps {
  data: ProductAttributes[] | undefined;
  selected: RadioValue;
  setSelected?: (value: RadioValue) => void;
}

export const FirstStep: FC<FirstStepProps> = ({ data, selected, setSelected }) => {
  return (
    <div className={styles.firstStep}>
      <div className={styles.topBar}>
        <div className="flex-start">
          {topBarData?.map((el, index) => (
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
        <div className="flex-start slide-icons">
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
            data={data?.map((el) => ({
              label: el.name,
              options: el.subs.map((item) => ({
                label: (
                  <div className="flex-start">
                    <BodyText level={5} fontFamily="Roboto">
                      {item.name}
                    </BodyText>
                    <BodyText
                      level={5}
                      fontFamily="Roboto"
                      style={{ paddingLeft: 12, color: '#bfbfbf', fontWeight: 300 }}
                    >
                      {`${item.basis.name} (${item.basis.subs?.length ?? 0})`}
                    </BodyText>
                  </div>
                ),
                value: item.id,
              })),
            }))}
            renderTitle={(el) => el.label}
            selected={selected}
            chosenItem={selected}
            onChange={setSelected}
          />
        </div>
      </div>
    </div>
  );
};
