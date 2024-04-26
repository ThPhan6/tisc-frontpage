import { FC } from 'react';

// import { ReactComponent as LineRightStepIcon } from '@/assets/icons/line-right-blue-24.svg';
import { ReactComponent as LineRightDescriptionIcon } from '@/assets/icons/line-right-grey-24.svg';
import { ReactComponent as ActionSlideLeftIcon } from '@/assets/icons/square-single-left-24.svg';
import { ReactComponent as ActionSlideRightIcon } from '@/assets/icons/square-single-right-24.svg';

import { flatMap } from 'lodash';

import { setSubOptionSelected } from '../../reducers';
import store, { useAppSelector } from '@/reducers';
import { ProductAttributes, ProductMainSubAttributes } from '@/types';

import DropdownRadioList from '@/components/CustomRadio/DropdownRadioList';
import { BodyText } from '@/components/Typography';

import styles from './AutoStep.less';
import slideBarStyles from './SlideBar.less';

const topBarData = [1, 2, 3, 4, 5, 6, 7];

interface FirstStepProps {
  data: ProductAttributes[] | undefined;
  selected: string;
}

export const FirstStep: FC<FirstStepProps> = ({ data, selected }) => {
  const activeAttrGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);
  const currentActiveSpecAttributeGroupId = activeAttrGroupId?.['specification_attribute_groups'];

  return (
    <div className={styles.firstStep}>
      <div className={slideBarStyles.topBar}>
        <div className="flex-start">
          {topBarData?.map((el, index) => (
            <div key={index} className="flex-start">
              <div className={slideBarStyles.stepCircle}>
                <BodyText fontFamily="Roboto" level={5} color="mono-color-medium">
                  {el}
                </BodyText>
              </div>
              <BodyText
                fontFamily="Roboto"
                level={5}
                color="mono-color-medium"
                customClass={slideBarStyles.description}
                style={{ fontWeight: 300 }}
              >
                description
              </BodyText>
              {index !== topBarData.length - 1 ? (
                <div className={slideBarStyles.lineRightIcon}>
                  <LineRightDescriptionIcon />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex-start slide-icons">
          <ActionSlideLeftIcon className={slideBarStyles.slideLeftIcon} />
          <ActionSlideRightIcon className={slideBarStyles.slideRightIcon} />
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.content}>
          <BodyText level={5} fontFamily="Roboto" customClass={styles.header}>
            select option dataset
          </BodyText>
          <DropdownRadioList
            data={data?.map((item) => ({
              label: item.name,
              options: flatMap(
                item.subs.map((sub) =>
                  sub.subs.map((el) => ({
                    label: (
                      <div className="flex-start">
                        <BodyText level={5} fontFamily="Roboto">
                          {el.name}
                        </BodyText>
                        <BodyText level={5} fontFamily="Roboto" style={{ paddingLeft: 12 }}>
                          {`${el.basis.name} (${el.basis.subs?.length ?? 0})`}
                        </BodyText>
                      </div>
                    ),
                    value: item.id,
                  })),
                ),
              ),
            }))}
            renderTitle={(el) => el.label}
            selected={{ label: '', value: selected }}
            chosenItem={{ label: '', value: selected }}
            collapseLevel="2"
            onChange={(optSelected) => {
              if (currentActiveSpecAttributeGroupId) {
                store.dispatch(
                  setSubOptionSelected({
                    [currentActiveSpecAttributeGroupId]: optSelected.value as string,
                  }),
                );
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
