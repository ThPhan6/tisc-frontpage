import React, { useEffect, useState } from 'react';

import { getFavouriteProductSummary } from '../services';

import type { FavouriteProductSummary } from '../types';

import {
  CustomDropDown,
  FilterItem,
  TopBarContainer,
  TopBarItem,
} from '@/features/product/components';
import {
  SORTER_DROPDOWN_DATA,
  useProductListFilterAndSorter,
} from '@/features/product/components/FilterAndSorter';

import './topBar.less';

export interface ProductSummaryTopBarProps {
  isFavouriteRetrieved: boolean;
}

const ProductSummaryTopBar: React.FC<ProductSummaryTopBarProps> = ({ isFavouriteRetrieved }) => {
  const [productSummary, setProductSummary] = useState<FavouriteProductSummary>();

  const { filter, sort, brands, categories, resetProductListFilter, resetProductListSorter } =
    useProductListFilterAndSorter();

  const activeBrands = brands.length && isFavouriteRetrieved;
  const activeCategories = categories.length && isFavouriteRetrieved;

  // show product summary when user already has retrieved favourite
  useEffect(() => {
    if (isFavouriteRetrieved) {
      getFavouriteProductSummary().then((data) => {
        if (data) {
          setProductSummary(data);
        }
      });
    }
  }, [isFavouriteRetrieved]);

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
              topValue={productSummary?.category_count ?? '0'}
              bottomValue="Categories"
              customClass="left-divider"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.card_count ?? '0'}
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
              customClass={`left-divider ${activeBrands ? 'cursor-pointer' : 'cursor-default'} `}
              topValue={
                filter?.name === 'brand_id' ? (
                  <FilterItem title={filter.title} onDelete={resetProductListFilter} />
                ) : (
                  'select'
                )
              }
              bottomEnable={activeBrands ? true : false}
              bottomValue={
                <CustomDropDown
                  items={brands}
                  menuStyle={{ width: 240 }}
                  disabled={activeBrands ? false : true}
                  placement="bottomRight">
                  Brands
                </CustomDropDown>
              }
            />

            {/* categories */}
            <TopBarItem
              disabled
              customClass={`left-divider ${
                activeCategories ? 'cursor-pointer' : 'cursor-default'
              } `}
              topValue={
                filter?.name === 'category_id' ? (
                  <FilterItem title={filter.title} onDelete={resetProductListFilter} />
                ) : (
                  'select'
                )
              }
              bottomEnable={activeCategories ? true : false}
              bottomValue={
                <CustomDropDown
                  items={categories}
                  position="left"
                  disabled={activeCategories ? false : true}>
                  Categories
                </CustomDropDown>
              }
            />

            {/* sort */}
            <TopBarItem
              disabled
              customClass={`left-divider ${
                isFavouriteRetrieved ? 'cursor-pointer' : 'cursor-default'
              } `}
              bottomEnable={isFavouriteRetrieved ? true : false}
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
                  disabled={isFavouriteRetrieved ? false : true}>
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

export default ProductSummaryTopBar;
