import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import {
  FilterItem,
  TopBarContainer,
  TopBarItem,
} from '@/components/Product/components/ProductTopBarItem';
import { useAppSelector } from '@/reducers';
import { setProductList } from '@/reducers/product';
import { getProductListByBrandId, getProductSummary } from '@/services';
import type { GeneralData, ProductFilterType, ProductGetListParameter } from '@/types';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

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

  useEffect(() => {
    return resetProductList;
  }, []);

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

  const renderDropDownList = (
    title: string,
    filterName: ProductFilterType,
    data: GeneralData[],
  ) => {
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
    <TopBarContainer
      LeftSideContent={
        <>
          <TopBarItem
            topValue={product.summary?.category_count ?? '0'}
            disabled={product.summary ? false : true}
            bottomValue="Categories"
            customClass={styles.category}
            style={{ paddingLeft: 0 }}
          />
          <TopBarItem
            topValue={product.summary?.collection_count ?? '0'}
            disabled={product.summary ? false : true}
            bottomValue="Collections"
            customClass="left-divider"
          />
          <TopBarItem
            topValue={product.summary?.card_count ?? '0'}
            disabled={product.summary ? false : true}
            bottomValue="Cards"
            customClass="left-divider"
          />
          <TopBarItem
            topValue={product.summary?.product_count ?? '0'}
            disabled={product.summary ? false : true}
            bottomValue="Products"
            customClass="left-divider"
          />
        </>
      }
      RightSideContent={
        <>
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
        </>
      }
    />
  );
};

export default ProductTopBar;
