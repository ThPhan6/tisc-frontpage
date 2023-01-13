import { FC, useState } from 'react';

import { ReactComponent as ActionLeftIcon } from '@/assets/icons/action-left.svg';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';

import { useScreen } from '@/helper/common';
import { checkUndefined } from '@/helper/utils';

import { ElementSummaryProps, MenuSummaryProps, SummaryProps } from './types';

import style from './index.less';

interface ItemSummaryProps {
  sub: SummaryProps;
}

const ItemSummary: FC<ItemSummaryProps> = ({ sub }) => {
  return (
    <div className={style['item-container']}>
      <span>{checkUndefined(sub?.quantity)}</span>
      <label>{checkUndefined(sub?.label)}</label>
    </div>
  );
};

const ElementSummary: FC<ElementSummaryProps> = ({
  dataElementSummary,
  handleActiveTab,
  activeId,
}) => {
  const toggle: boolean = activeId === dataElementSummary.id;

  return (
    <div
      className={`
        ${style['element-container']}
        ${toggle ? style['menuActive'] : style['menuUnactive']}`}
      key={dataElementSummary.id}
    >
      <div
        className={style['element']}
        onClick={() => {
          handleActiveTab(dataElementSummary.id);
        }}
      >
        <span>{checkUndefined(dataElementSummary?.quantity)}</span>
        <div className={style['button-wrapper']}>
          <label> {checkUndefined(dataElementSummary?.label)}</label>
          {toggle ? <ActionLeftIcon /> : <ActionRightIcon />}
        </div>
      </div>
      {toggle && (
        <div className={style['item-wrapper']}>
          {dataElementSummary?.subs?.map((sub, index) => {
            return (
              <div className={style['item']} key={index}>
                <ItemSummary sub={sub} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const MenuSummary: FC<MenuSummaryProps> = ({
  containerClass,
  menuSummaryData,
  height = '56px',
  typeMenu = 'brand',
  typeMenuData,
  contentFilter,
}) => {
  const [activeId, setActiveId] = useState<string>('');
  const { isTablet } = useScreen();

  const handleActivetab = (id: string) => {
    if (id === activeId) {
      setActiveId('');
      return;
    }
    setActiveId(id);
  };

  const typeCircumstance = (type: MenuSummaryProps['typeMenu']) => {
    /// 100% have type
    if (!type) {
      return;
    }

    if (type === 'subscription' || type === 'project') {
      return (
        <div className={style[`${type}-container`]}>
          {typeMenuData?.map((data, index) => {
            return (
              <div className={style[`element-right`]} key={index}>
                <span>{data.quantity}</span>
                <label>{data.label}</label>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={`${style['header-summary']} ${containerClass}`}
      style={{
        height: height,
        boxShadow: isTablet ? 'inset 0 1px 0 rgba(0, 0, 0, 0.3)' : 'none',
        padding: isTablet ? '0 0 0 12px' : '',
      }}
    >
      <div className={style['brand-container']}>
        {menuSummaryData.map((data, index) => {
          return (
            <div className={style['wrapper']} key={index}>
              <ElementSummary
                dataElementSummary={data}
                activeId={activeId}
                handleActiveTab={handleActivetab}
              />
            </div>
          );
        })}
      </div>
      {typeCircumstance(typeMenu)}
      {contentFilter ? contentFilter : null}
    </div>
  );
};
