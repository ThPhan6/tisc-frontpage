import { FC, useState } from 'react';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { ReactComponent as ActionLeftIcon } from '@/assets/icons/action-left.svg';
import style from './index.less';
import { ElementSummaryProps, ItemSummaryProps, MenuSummaryProps } from './types';
import { checkUndefined } from '@/helper/utils';

const ItemSummary: FC<ItemSummaryProps> = ({ brand }) => {
  return (
    <div className={style['item-container']}>
      <span>{checkUndefined(brand?.quantity)}</span>
      <label>{checkUndefined(brand?.label)}</label>
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
          {dataElementSummary?.brands &&
            dataElementSummary.brands.map((brand) => {
              return (
                <div className={style['item']} key={brand?.id}>
                  <ItemSummary brand={brand} />
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
    switch (type) {
      case 'subscription':
        return (
          <div className={style[`${type}-container`]}>
            {typeMenuData?.map((data) => {
              return (
                <div className={style[`element-right`]}>
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
            {typeMenuData?.map((data) => {
              return (
                <div className={style[`element-right`]}>
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
        {menuSummaryData.map((data) => {
          return (
            <div className={style['wrapper']} key={data.id}>
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
