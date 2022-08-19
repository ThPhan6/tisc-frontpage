import {
  CustomDropDown,
  FilterItem,
  TopBarContainer,
  TopBarItem,
} from '@/features/product/components';
import { getFavouriteProductSummary } from '@/services';
import type { FavouriteProductSummary } from '@/types';
import React, { useEffect, useState } from 'react';
import {
  productListFilterAndSorter,
  SORTER_DROPDOWN_DATA,
} from '@/features/product/components/FilterAndSorter';
import './topBar.less';
// import { resetProductState, setProductList } from '@/features/product/reducers';
// import { useDispatch } from 'react-redux';

const ProductSummrayTopBar: React.FC = () => {
  const [productSummary, setProductSummary] = useState<FavouriteProductSummary>();

  const { filter, sort, brands, categories, resetProductListFilter, resetProductListSorter } =
    productListFilterAndSorter();

  // get profuct summary
  useEffect(() => {
    getFavouriteProductSummary().then((data) => {
      if (data) {
        setProductSummary(data);
      }
    });
  }, []);

  return (
    <div className="productSummary">
      <TopBarContainer
        LeftSideContent={
          <>
            <TopBarItem
              topValue={productSummary?.brand_count ?? '0'}
              bottomValue="Brands"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.card_count ?? '0'}
              bottomValue="Categories"
              customClass="left-divider"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.category_count ?? '0'}
              bottomValue="Cards"
              customClass="left-divider"
              cursor="default"
            />
          </>
        }
        RightSideContent={
          <>
            {/* brands */}
            <TopBarItem
              disabled
              customClass="left-divider"
              topValue={
                filter?.name === 'brand_id' ? (
                  <FilterItem title={filter.title} onDelete={resetProductListFilter} />
                ) : (
                  'select'
                )
              }
              bottomEnable={brands.length ? true : false}
              bottomValue={
                <CustomDropDown
                  items={brands}
                  menuStyle={{ width: 240 }}
                  align={{ offset: [-180, 3] }}
                >
                  Brands
                </CustomDropDown>
              }
            />

            {/* categories */}
            <TopBarItem
              disabled
              customClass="left-divider"
              topValue={
                filter?.name === 'category_id' ? (
                  <FilterItem title={filter.title} onDelete={resetProductListFilter} />
                ) : (
                  'select'
                )
              }
              bottomEnable={categories.length ? true : false}
              bottomValue={
                <CustomDropDown items={categories} position="left">
                  Categories
                </CustomDropDown>
              }
            />

            {/* sort */}
            <TopBarItem
              disabled
              customClass="left-divider"
              bottomEnable={true}
              topValue={
                sort ? (
                  <FilterItem
                    title={sort.order === 'ASC' ? 'A - Z' : 'Z - A'}
                    onDelete={resetProductListSorter}
                  />
                ) : (
                  'select'
                )
              }
              bottomValue={
                <CustomDropDown
                  items={SORTER_DROPDOWN_DATA}
                  menuStyle={{ width: 160, height: 'auto' }}
                >
                  Sort By
                </CustomDropDown>
              }
            />
          </>
        }
      />
    </div>
  );
};

export default ProductSummrayTopBar;
