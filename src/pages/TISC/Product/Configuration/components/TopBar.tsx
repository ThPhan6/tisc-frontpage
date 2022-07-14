import React, { useState, useEffect } from 'react';
import { BodyText } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import { getBrandAlphabet, getProductSummary, getProductListByBrandId } from '@/services';
import type { IBrandAlphabet, IBrandDetail, IGeneralData, IProductGetListParameter } from '@/types';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SmallPlusIcon } from '@/assets/icons/small-plus-icon.svg';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { showImageUrl } from '@/helper/utils';
import { map, forEach, isUndefined } from 'lodash';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setBrand, setProductList } from '@/reducers/product';
import styles from '../styles/topbar.less';

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
        level={6}
        fontFamily="Roboto"
        customClass={`topbar-group-btn ${disabled && !bottomEnable ? 'disabled' : ''}`}
      >
        <span>{bottomValue}</span>
        {icon ? icon : null}
      </BodyText>
    </div>
  );
};
interface IFilterItem {
  title: string;
  onDelete?: () => void;
}
const FilterItem: React.FC<IFilterItem> = ({ title, onDelete }) => {
  return (
    <span className={styles.filterItem}>
      {title}
      <DeleteIcon onClick={onDelete} />
    </span>
  );
};

type IFilterType = 'category_id' | 'collection_id';
interface ITopBarFilter {
  name: IFilterType;
  title: string;
  value: string;
}
const ProductTopBar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [brandAlphabet, setBrandAlphabet] = useState<IBrandAlphabet>({});
  const [brandData, setBrandData] = useState<any>();
  const [filter, setFilter] = useState<ITopBarFilter>();
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
        setFilter(undefined);
      });
    }
  }, [product.brand]);

  useEffect(() => {
    if (product.brand && product.brand.id && filter) {
      const params = {
        brand_id: product.brand.id,
      } as IProductGetListParameter;
      if (filter.name === 'category_id' && filter.value !== 'all') {
        params.category_id = filter.value;
      }
      if (filter.name === 'collection_id' && filter.value !== 'all') {
        params.collection_id = filter.value;
      }
      getProductListByBrandId(params);
    }
  }, [product.brand, filter]);

  useEffect(() => {
    if (isUndefined(filter)) {
      // reset product list
      setProductList([]);
    }
  }, [filter]);

  /// render custom radio brand list label
  const renderLabel = (item: IBrandDetail) => {
    return (
      <BodyText level={5} fontFamily="Roboto">
        <img src={showImageUrl(item.logo ?? '')} className={styles.brandLogo} />
        <span>{item.name}</span>
      </BodyText>
    );
  };

  const renderDropDownList = (title: string, filterName: IFilterType, data: IGeneralData[]) => {
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
              setFilter({
                name: filterName,
                title: item.name,
                value: item.id,
              });
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
            topValue={
              filter?.name === 'category_id' ? (
                <FilterItem title={filter.title} onDelete={() => setFilter(undefined)} />
              ) : (
                `view`
              )
            }
            disabled
            bottomEnable={product.summary ? true : false}
            bottomValue={renderDropDownList(
              'Categories',
              'category_id',
              product.summary?.categories ?? [],
            )}
            customClass="left-divider"
          />
          <TopBarItem
            topValue={
              filter?.name === 'collection_id' ? (
                <FilterItem title={filter.title} onDelete={() => setFilter(undefined)} />
              ) : (
                `view`
              )
            }
            disabled
            bottomEnable={product.summary ? true : false}
            bottomValue={renderDropDownList(
              'Collections',
              'collection_id',
              product.summary?.collections ?? [],
            )}
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
                className={`
                  ${styles.newCardIcon}
                  ${product.summary ? styles.activeNewCard : styles.disabledNewCard}`}
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
