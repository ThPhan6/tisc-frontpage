import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import { BodyText } from '@/components/Typography';
import { useAppSelector } from '@/reducers';
import { setProductList } from '@/reducers/product';
import { getProductListByBrandId, getProductSummary } from '@/services';
import type { GeneralData, IFilterType, ProductGetListParameter } from '@/types';
import { capitalize } from 'lodash';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../styles/TopBar.less';

interface ProductTopBarProps {
  topValue?: string | React.ReactNode;
  disabled?: boolean;
  bottomValue?: string | React.ReactNode;
  bottomEnable?: boolean;
  icon?: React.ReactNode;
  customClass?: string;
  onClick?: () => void;
}

const TopBarItem: React.FC<ProductTopBarProps> = (props) => {
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
      {capitalize(title)}
      <DeleteIcon onClick={onDelete} />
    </span>
  );
};

const ProductTopBar: React.FC = () => {
  const product = useAppSelector((state) => state.product);
  const userBrand = useAppSelector((state) => state.user.user?.brand);
  const { filter } = product.list;
  const dispatch = useDispatch();

  const resetProductList = () => {
    dispatch(
      setProductList({
        filter: undefined,
        data: [],
      }),
    );
  };

  // brand product summary
  useEffect(() => {
    if (userBrand?.id) {
      // get product summary
      getProductSummary(userBrand.id).then(() => {
        // reset filter
        resetProductList();
      });
    }
  }, []);

  useEffect(() => {
    if (userBrand?.id && filter) {
      const params = {
        brand_id: userBrand.id,
      } as ProductGetListParameter;
      if (filter?.name === 'category_id' && filter.value !== 'all') {
        params.category_id = filter.value;
      }
      if (filter?.name === 'collection_id' && filter.value !== 'all') {
        params.collection_id = filter.value;
      }
      getProductListByBrandId(params);
    }
  }, [filter]);

  const renderDropDownList = (title: string, filterName: IFilterType, data: GeneralData[]) => {
    // merge view small
    const items = [{ id: 'all', name: 'VIEW ALL' }, ...data];
    ///
    return (
      <HeaderDropdown
        align={{ offset: [26, 7] }}
        placement="bottomRight"
        containerClass={styles.topbarDropdown}
        disabled={product.summary ? false : true}
        items={items.map((item) => {
          return {
            onClick: () => {
              dispatch(
                setProductList({
                  filter: {
                    name: filterName,
                    title: item.name,
                    value: item.id,
                  },
                }),
              );
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
            topValue={product.summary?.category_count ?? '0'}
            disabled={product.summary ? false : true}
            bottomValue="Categories"
            customClass={styles.category}
          />
          <TopBarItem
            topValue={product.summary?.collection_count ?? '0'}
            disabled={product.summary ? false : true}
            bottomValue="Collections"
          />
          <TopBarItem
            topValue={product.summary?.card_count ?? '0'}
            disabled={product.summary ? false : true}
            bottomValue="Cards"
          />
          <TopBarItem
            topValue={product.summary?.product_count ?? '0'}
            disabled={product.summary ? false : true}
            bottomValue="Products"
          />
        </div>
        <div className="right-side">
          <TopBarItem
            topValue={
              filter?.name === 'category_id' ? (
                <FilterItem title={filter.title} onDelete={resetProductList} />
              ) : userBrand ? (
                'view'
              ) : (
                <span style={{ opacity: 0 }}>.</span>
              )
            }
            disabled
            bottomEnable={product.summary ? true : false}
            bottomValue={
              !userBrand
                ? 'Categories'
                : renderDropDownList('Categories', 'category_id', product.summary?.categories ?? [])
            }
            customClass="left-divider"
          />
          <TopBarItem
            topValue={
              filter?.name === 'collection_id' ? (
                <FilterItem title={filter.title} onDelete={resetProductList} />
              ) : userBrand ? (
                'view'
              ) : (
                <span style={{ opacity: 0 }}>.</span>
              )
            }
            disabled
            bottomEnable={product.summary ? true : false}
            bottomValue={
              !userBrand
                ? 'Collections'
                : renderDropDownList(
                    'Collections',
                    'collection_id',
                    product.summary?.collections ?? [],
                  )
            }
            customClass="left-divider collection"
          />
        </div>
      </div>
    </>
  );
};

export default ProductTopBar;
