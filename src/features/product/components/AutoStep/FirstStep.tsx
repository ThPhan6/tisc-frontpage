import { FC, useContext } from 'react';

// import { ReactComponent as LineRightStepIcon } from '@/assets/icons/line-right-blue-24.svg';
import { ReactComponent as LineRightDescriptionIcon } from '@/assets/icons/line-right-grey-24.svg';
import { ReactComponent as ActionSlideLeftIcon } from '@/assets/icons/square-single-left-24.svg';
import { ReactComponent as ActionSlideRightIcon } from '@/assets/icons/square-single-right-24.svg';

import { flatMap } from 'lodash';

import { setSubOptionSelected } from '../../reducers';
import { ProductAttributeFormInput } from '../../types';
import store, { useAppSelector } from '@/reducers';
import { ProductSubAttributes } from '@/types';

import DropdownRadioList from '@/components/CustomRadio/DropdownRadioList';
import { BodyText } from '@/components/Typography';

import { ProductAttributeComponentContext } from '../ProductAttributes';
import styles from './AutoStep.less';
import slideBarStyles from './SlideBar.less';

const topBarData = [1, 2, 3, 4, 5, 6, 7];

interface FirstStepProps {
  attributeGroup: ProductAttributeFormInput[];
  selected: string;
}

export const FirstStep: FC<FirstStepProps> = ({ attributeGroup, selected }) => {
  const { attributeListFilterByBrand } = useContext(ProductAttributeComponentContext);
  const attributes = attributeListFilterByBrand.specification;

  const activeAttrGroupId = useAppSelector((state) => state.product.curAttrGroupCollapseId);
  const currentActiveSpecAttributeGroupId = activeAttrGroupId?.['specification_attribute_groups'];

  const renderRadioLabel = (item: ProductSubAttributes) => {
    return (
      <div className="flex-start" style={{ paddingLeft: 16 }}>
        <BodyText level={5} fontFamily="Roboto">
          {item.name}
        </BodyText>
        <BodyText
          level={5}
          fontFamily="Roboto"
          style={{ paddingLeft: 12 }}
          color="mono-color-medium"
        >
          {`${`${item.basis.subs?.length > 1 ? 'items' : 'item'} (${
            item.basis.subs?.length ?? 0
          })`}`}
        </BodyText>
      </div>
    );
  };

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
            data={attributes.map((item) => ({
              label: item.name,
              count: item.subs.length,
              options: flatMap(
                item.subs.map((sub) =>
                  sub.subs.map((el) => ({
                    label: renderRadioLabel(el),
                    value: item.id,
                  })),
                ),
              ),
              subs: item.subs.map((el) => ({
                name: el.name,
                count: el.subs.length,
                options: el.subs.map((sub) => ({
                  label: renderRadioLabel(sub),
                  value: sub.id,
                })),
              })),
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
