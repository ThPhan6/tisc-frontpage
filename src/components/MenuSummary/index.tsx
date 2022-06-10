import { FC, useState } from 'react';
import { ReactComponent as ActionRightIcon } from '@/assets/icons/action-right.svg';
import { ReactComponent as ActionLeftIcon } from '@/assets/icons/action-left.svg';
import style from './index.less';
import classNames from 'classnames';
import { ElementSummaryProps, ItemSummaryProps, MenuSummaryProps } from './types';

const ItemSummary: FC<ItemSummaryProps> = ({ brand, active }) => {
  console.log(active);

  return (
    <div
      className={classNames(
        style['d-flex'],
        style['item'],
        active
          ? classNames(style['display'] && style['active'])
          : classNames(style['display-none']),
      )}
      key={brand.id}
    >
      <div className={classNames(style['flex-column'], style['px'])}>
        <label>{brand.quantity}</label>
        <span>{brand.brandName}</span>
      </div>
    </div>
  );
};

const ElementSummary: FC<ElementSummaryProps> = ({ data /* idElement */ }) => {
  const [toggle, setToggle] = useState(false);
  // const [idElement, setIdElement] = useState<string>();

  const onClick = (event: React.MouseEvent<Element>) => {
    const currentTarget = event.currentTarget.id;
    // setIdElement(currentTarget);

    console.log(currentTarget, data.id);
    // console.log(idElement);

    if (currentTarget == data.id) {
      setToggle(true);

      if (toggle) {
        setToggle(false);
      }
    }
  };

  return toggle == true ? (
    <div className={classNames(style['d-flex'], style['element'])} key={data.id}>
      <div
        className={classNames(
          style['cursor-pointer'],
          toggle ? style['active'] : style['unactive'],
        )}
        id={data.id}
        onClick={onClick}
      >
        <label>{data.quantity}</label>
        <div className={style['d-flex']}>
          <span className={style['mr']}>{data.brandName}</span>
          {toggle ? <ActionLeftIcon /> : <ActionRightIcon />}
        </div>
      </div>
      {data.brands &&
        data.brands.map((brand: any) => {
          return <ItemSummary brand={brand} active={toggle} />;
        })}
    </div>
  ) : (
    <div
      className={classNames(style['d-flex'], style['element'], style['border-lef'])}
      key={data.id}
    >
      <div
        className={classNames(style['cursor-pointer'], style['unactive'])}
        id={data.id}
        onClick={onClick}
      >
        <label>{data.quantity}</label>
        <div className={style['d-flex']}>
          <span className={style['mr']}>{data.brandName}</span>
          <ActionRightIcon />
        </div>
      </div>
    </div>
  );
};

export const MenuSummary: FC<MenuSummaryProps> = () => {
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
          id: '28',
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

  // const [toggle, setToggle] = useState(false);
  // const [idElement, setIdElement] = useState<string>();

  // const handleId = (event: React.MouseEvent<Element>) => {
  //   setIdElement(event.currentTarget.id);
  // };

  return (
    <div className={classNames(style['wrap'], style['d-flex'])}>
      <div className={style['d-flex']}>
        {dataBrands.map((data) => {
          return (
            <div
              className={classNames(style['px'], style['border-left'])}
              key={data.id}
              // onClick={handleId}
            >
              <ElementSummary
                data={data}
                // idElement={idElement}
                // onClick={handleId}
                // toggle={toggle}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
