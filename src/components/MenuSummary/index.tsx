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

const ElementSummary: FC<ElementSummaryProps> = ({ data, handleActiveTab, activeId }) => {
  const toggle: boolean = activeId === data.id;

  return (
    <div
      className={classNames(
        style['element-container'],
        toggle ? style['menuActive'] : style['menuUnactive'],
      )}
      key={data.id}
    >
      <div
        className={style['element']}
        onClick={() => {
          handleActiveTab(data.id);
        }}
      >
        <span>{checkUndefined(data?.quantity)}</span>
        <div className={style['button-wrapper']}>
          <span className={style['brandName']}> {checkUndefined(data?.brandName)}</span>
          {toggle ? <ActionLeftIcon /> : <ActionRightIcon />}
        </div>
      </div>
      {toggle && (
        <div className={classNames(style['item-wrapper'])}>
          {data?.brands &&
            data?.brands.map((brand) => {
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
}) => {
  const [activeId, setActiveId] = useState<string>('');

  const handleActivetab = (id: string) => {
    if (id === activeId) {
      setActiveId('');
      return;
    }
    setActiveId(id);
  };

  return (
    <div className={classNames(style['menu-container'], containerClass)} style={{ height: height }}>
      {dataBrands?.map((data) => {
        return (
          <div className={classNames(style['wrapper'])} key={data.id}>
            <ElementSummary data={data} activeId={activeId} handleActiveTab={handleActivetab} />
          </div>
        );
      })}
    </div>
  );
};
