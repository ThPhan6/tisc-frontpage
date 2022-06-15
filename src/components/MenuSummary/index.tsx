import { FC, useState } from 'react';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { ReactComponent as ActionLeftIcon } from '@/assets/icons/action-left.svg';
import style from './index.less';
import classNames from 'classnames';
import { ElementSummaryProps, ItemSummaryProps, MenuSummaryProps } from './types';
import { checkUndefined } from '@/helper/utils';

const ItemSummary: FC<ItemSummaryProps> = ({ brand }) => {
  return (
    <div className={classNames(style['item-container'])}>
      <span>{checkUndefined(brand?.quantity)}</span>
      <span>{checkUndefined(brand?.brandName)}</span>
    </div>
  );
};

const ElementSummary: FC<ElementSummaryProps> = ({ dataBrands, handleActiveTab, activeId }) => {
  const toggle: boolean = activeId === dataBrands.id;

  return (
    <div
      className={classNames(
        style['element-container'],
        toggle ? style['menuActive'] : style['menuUnactive'],
      )}
      key={dataBrands.id}
    >
      <div
        className={style['element']}
        onClick={() => {
          handleActiveTab(dataBrands.id);
        }}
      >
        <span>{checkUndefined(dataBrands?.quantity)}</span>
        <div className={style['button-wrapper']}>
          <span className={style['brandName']}> {checkUndefined(dataBrands?.brandName)}</span>
          {toggle ? <ActionLeftIcon /> : <ActionRightIcon />}
        </div>
      </div>
      {toggle && (
        <div className={classNames(style['item-wrapper'])}>
          {dataBrands?.brands &&
            dataBrands?.brands.map((brand) => {
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
  dataBrands,
  height = '56px',
  typeMenu = 'brand',
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
            <div className={style['element-right']}>
              <span className={style['price']}>$99</span>
              <span>Grand Total</span>
            </div>
          </div>
        );

      case 'project':
        return (
          <div className={style[`${type}-container`]}>
            <div className={style[`element-right`]}>
              <span className={style['price']}>$199</span>
              <span>Grand Total</span>
            </div>
            <div className={style[`element-right`]}>
              <span className={style['price']}>$199</span>
              <span>Grand Total</span>
            </div>
          </div>
        );

      default:
        break;
    }
  };

  return (
    <div className={classNames(style['header-summary'], containerClass)} style={{ height: height }}>
      <div className={classNames(style['brand-container'])}>
        {dataBrands?.map((data: any) => {
          return (
            <div className={classNames(style['wrapper'])} key={data.id}>
              <ElementSummary
                dataBrands={data}
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
