import { FC, useState } from 'react';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { ReactComponent as ActionLeftIcon } from '@/assets/icons/action-left.svg';
import style from './index.less';
import classNames from 'classnames';
import { ElementSummaryProps, ItemSummaryProps, MenuSummaryProps } from './types';

const dataBrands = [
  {
    id: '1',
    quantity: 4,
    brandName: 'BRAND COMPANIES',
    brands: [
      {
        id: '11',
        quantity: 8,
        brandName: 'Locations',
      },
      {
        id: '18',
        quantity: 4,
        brandName: 'Teams',
      },
    ],
  },
  {
    id: '2',
    quantity: 3,
    brandName: 'COUNTRIES',
    brands: [
      {
        id: '21',
        quantity: 0,
        brandName: 'Asia',
      },
      {
        id: '22',
        quantity: 0,
        brandName: 'Africa',
      },
      {
        id: '23',
        quantity: 1,
        brandName: 'Africa',
      },
      {
        id: '34',
        quantity: 1,
        brandName: 'Africa',
      },
    ],
  },
  {
    id: '3',
    quantity: 1123,
    brandName: 'PRODUCTS',
    brands: [
      {
        id: '31',
        quantity: 5,
        brandName: 'Categorys',
      },
      {
        id: '32',
        quantity: 19,
        brandName: 'Collections',
      },
      {
        id: '33',
        quantity: 192,
        brandName: 'Cards',
      },
    ],
  },
];

const checkBrandProps = (prop: string | number | undefined) => {
  return prop === undefined ? 'N/A' : prop;
};

const ItemSummary: FC<ItemSummaryProps> = ({ brand }) => {
  return (
    <div className={classNames(style['item-container'])}>
      <div className={style['flex-column']}>
        <span>{checkBrandProps(brand?.quantity)}</span>
        <span>{checkBrandProps(brand?.brandName)}</span>
      </div>
    </div>
  );
};

const ElementSummary: FC<ElementSummaryProps> = ({ data, handleActiveTab, activeId }) => {
  const toggle: boolean = activeId === data.id;

  return (
    <div
      className={classNames(
        style['element-container'],
        toggle ? style['active'] : style['unactive'],
      )}
      key={data.id}
    >
      <div
        onClick={() => {
          handleActiveTab(data.id);
        }}
      >
        <span>{checkBrandProps(data?.quantity)}</span>
        <div className={style['d-flex']}>
          <span className={style['mr-8']}> {checkBrandProps(data?.brandName)}</span>
          {toggle ? <ActionLeftIcon /> : <ActionRightIcon />}
        </div>
      </div>
      {toggle && (
        <div className={classNames(style['d-flex'])}>
          {data?.brands?.map((brand) => {
            return <ItemSummary brand={brand} key={brand?.id} />;
          })}
        </div>
      )}
    </div>
  );
};

export const MenuSummary: FC<MenuSummaryProps> = ({ containerClass }) => {
  const [activeId, setActiveId] = useState<string>('');

  const handleActivetab = (id: string) => {
    if (id === activeId) {
      setActiveId('');
      return;
    }
    setActiveId(id);
  };

  return (
    <div className={containerClass}>
      <div className={classNames(style['menu-container'])}>
        {dataBrands?.map((data) => {
          return (
            <div className={classNames(style['border-left'], style['px-12'])} key={data.id}>
              <ElementSummary data={data} activeId={activeId} handleActiveTab={handleActivetab} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
