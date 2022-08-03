import { ReactComponent as ActionLeftIcon } from '@/assets/icons/action-left.svg';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { FC, useState } from 'react';
import style from './index.less';
import { ElementSummaryProps, MenuSummaryProps, SummaryProps } from './types';
import { checkUndefined } from '@/helper/utils';

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
          {dataElementSummary?.subs &&
            dataElementSummary.subs.map((sub) => {
              return (
                <div className={style['item']} key={sub?.id}>
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
}) => {
  const [activeId, setActiveId] = useState<string>('');

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

    switch (type) {
      case 'subscription':
        return (
          <div className={style[`${type}-container`]}>
            {typeMenuData?.map((data, index) => {
              return (
                <div className={style[`element-right`]} key={data.id ?? index}>
                  <span>{data.quantity}</span>
                  <label>{data.label}</label>
                </div>
              );
            })}
          </div>
        );

      case 'project':
        return (
          <div className={style[`${type}-container`]}>
            {typeMenuData?.map((data, index) => {
              return (
                <div className={style[`element-right`]} key={data.id ?? index}>
                  <span>{data.quantity}</span>
                  <label>{data.label}</label>
                </div>
              );
            })}
          </div>
        );

      default:
        break;
    }
  };

  return (
    <div className={`${style['header-summary']} ${containerClass}`} style={{ height: height }}>
      <div className={style['brand-container']}>
        {menuSummaryData.map((data, index) => {
          return (
            <div className={style['wrapper']} key={data?.id ?? index}>
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
    </div>
  );
};
