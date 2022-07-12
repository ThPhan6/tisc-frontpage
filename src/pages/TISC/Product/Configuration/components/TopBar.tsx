import React, { useState, useEffect } from 'react';
import { BodyText } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import { getBrandAlphabet, getProductSummary } from '@/services';
import type { IBrandAlphabet, IBrandDetail, IGeneralData } from '@/types';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SmallPlusIcon } from '@/assets/icons/small-plus-icon.svg';
import { showImageUrl } from '@/helper/utils';
import { map, forEach, debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setBrand } from '@/reducers/product';
import classnames from 'classnames';
import styles from '../styles/topbar.less';

type IViewType = 'Categories' | 'Collections';

interface IProductTopBar {
  topValue?: string | React.ReactNode;
  disabled?: boolean;
  bottomValue?: string | React.ReactNode;
  bottomEnable?: boolean;
  icon?: React.ReactNode;
  customClass?: string;
  onClick?: () => void;
}
const TopBarItem: React.FC<IProductTopBar> = (props) => {
  const { topValue, bottomValue, icon, disabled, bottomEnable, customClass, onClick } = props;
  return (
    <div className={`item ${customClass ?? ''}`} onClick={onClick}>
      <BodyText level={5} fontFamily="Roboto" customClass={disabled ? 'disabled ' : ''}>
        {topValue}
      </BodyText>
      <BodyText
        level={5}
        fontFamily="Roboto"
        customClass={`topbar-group-btn ${disabled && !bottomEnable ? 'disabled' : ''}`}
      >
        <span>{bottomValue}</span>
        {icon ? icon : null}
      </BodyText>
    </div>
  );
};
const DEFAULT_FILTER = { id: '', name: '' };
interface ITopBarFilter {
  Categories: IGeneralData;
  Collections: IGeneralData;
}
const ProductTopBar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [brandAlphabet, setBrandAlphabet] = useState<IBrandAlphabet>({});
  const [brandData, setBrandData] = useState<any>();
  const [filter, setFilter] = useState<ITopBarFilter>({
    Categories: DEFAULT_FILTER,
    Collections: DEFAULT_FILTER,
  });
  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();

  /// set brand to product reducer
  useEffect(() => {
    if (brandData) {
      let brand: IBrandDetail | undefined;
      forEach(brandAlphabet, (brands) => {
        const foundedBrand = brands.find((item) => item.id === brandData.value);
        if (foundedBrand) {
          brand = foundedBrand;
        }
      });
      //
      dispatch(setBrand(brand));
    }
  }, [brandData]);

  /// load brand by alphabet from API
  useEffect(() => {
    getBrandAlphabet().then(setBrandAlphabet);
  }, []);

  // brand product summary
  useEffect(() => {
    if (product.brand && product.brand.id) {
      // get product summary
      getProductSummary(product.brand.id).then(() => {
        // reset filter
        setFilter({
          Categories: DEFAULT_FILTER,
          Collections: DEFAULT_FILTER,
        });
      });
    }
  }, [product.brand]);

  useEffect(
    () =>
      debounce(() => {
        if (product.brand && product.brand.id && filter) {
          console.log('call product');
        }
      }, 200),
    [filter],
  );

  /// render custom radio brand list label
  const renderLabel = (item: IBrandDetail) => {
    return (
      <BodyText level={5} fontFamily="Roboto">
        <img src={showImageUrl(item.logo)} className={styles.brandLogo} />
        <span>{item.name}</span>
      </BodyText>
    );
  };

  const renderDropDownList = (title: IViewType, data: IGeneralData[]) => {
    // merge view small
    const items = [{ id: 'all', name: 'VIEW ALL' }, ...data];
    ///
    return (
      <HeaderDropdown
        align={{ offset: [40, 7] }}
        placement="bottomRight"
        containerClass={styles.topbarDropdown}
        disabled={product.summary ? false : true}
        items={items.map((item) => {
          return {
            onClick: () => {
              let newItem = { ...item };
              if (newItem.id === 'all') {
                newItem = DEFAULT_FILTER;
              }
              if (title === 'Categories') {
                setFilter({
                  Collections: DEFAULT_FILTER,
                  [title]: newItem,
                });
              } else {
                setFilter({
                  Categories: DEFAULT_FILTER,
                  [title]: newItem,
                });
              }
            },
            label: item.name,
          };
        })}
        trigger={['click']}
      >
        <span>
          {title}
          <DropdownIcon />
        </span>
      </HeaderDropdown>
    );
  };

  return (
    <>
      <div className={styles.topbarContainer}>
        <div className="left-side">
          <TopBarItem
            topValue={
              product.brand?.name ? <span className="bold">{product.brand.name}</span> : 'select'
            }
            disabled={product.brand?.name ? false : true}
            bottomEnable
            bottomValue="Brands"
            customClass="brand-dropdown right-divider"
            icon={<DropdownIcon />}
            onClick={() => setVisible(true)}
          />
          <TopBarItem
            topValue={product.summary?.category_count ?? ''}
            disabled={product.summary ? false : true}
            bottomValue="Categories"
          />
          <TopBarItem
            topValue={product.summary?.collection_count ?? ''}
            disabled={product.summary ? false : true}
            bottomValue="Collections"
          />
          <TopBarItem
            topValue={product.summary?.card_count ?? ''}
            disabled={product.summary ? false : true}
            bottomValue="Cards"
          />
          <TopBarItem
            topValue={product.summary?.product_count ?? ''}
            disabled={product.summary ? false : true}
            bottomValue="Products"
          />
        </div>
        <div className="right-side">
          <TopBarItem
            topValue="view"
            disabled
            bottomEnable={product.summary ? true : false}
            bottomValue={renderDropDownList('Categories', product.summary?.categories ?? [])}
            customClass="left-divider"
          />
          <TopBarItem
            topValue="view"
            disabled
            bottomEnable={product.summary ? true : false}
            bottomValue={renderDropDownList('Collections', product.summary?.collections ?? [])}
            customClass="left-divider"
          />
          <TopBarItem
            topValue=""
            disabled
            bottomEnable={product.summary ? true : false}
            bottomValue="New Card"
            customClass="left-divider"
            icon={
              <span
                className={classnames(
                  styles.newCardIcon,
                  product.summary ? styles.activeNewCard : styles.disabledNewCard,
                )}
              >
                <SmallPlusIcon />
              </span>
            }
          />
        </div>
      </div>
      <Popover
        visible={visible}
        setVisible={setVisible}
        title="select brand"
        dropdownRadioList={map(brandAlphabet, (items, key) => {
          return {
            key,
            margin: 12,
            options: items.map((item) => {
              return {
                label: renderLabel(item),
                value: item.id,
              };
            }),
          };
        })}
        dropDownRadioTitle={(data) => data.key.split('').join(' / ')}
        chosenValue={brandData}
        setChosenValue={setBrandData}
      />
    </>
  );
};

export default ProductTopBar;
