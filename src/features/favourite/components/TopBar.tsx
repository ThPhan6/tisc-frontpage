import React, { useEffect, useState } from 'react';

import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { getFavouriteProductSummary } from '../services';
import { showImageUrl } from '@/helper/utils';

import type { FavouriteProductSummary } from '../types';
import { setProductList } from '@/features/product/reducers';
import { ProductItemValue } from '@/features/product/types';
import store from '@/reducers';

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

export const formatCategoriesFavouriteToDropDownData = (
  categories?: ProductItemValue[],
): ItemType[] => {
  if (!categories) return [];
  return categories.map((el) => ({
    key: el.id,
    label: el.name || '',
    onClick: () =>
      store.dispatch(
        setProductList({
          filter: {
            name: 'category_id',
            title: el.name || '',
            value: el.id,
          },
        }),
      ),
  }));
};

export const formatBrandsFavouriteToDropDownData = (brands?: ProductItemValue[]): ItemType[] => {
  if (!brands) return [];
  return brands.map((el) => ({
    key: el.id,
    label: el.name || '',
    icon: <img src={showImageUrl(el.logo)} style={{ width: 18, height: 18 }} />,
    onClick: () =>
      store.dispatch(
        setProductList({
          filter: {
            name: 'brand_id',
            title: el.name || '',
            value: el.id,
          },
        }),
      ),
  }));
};

const ProductSummaryTopBar: React.FC<ProductSummaryTopBarProps> = ({ isFavouriteRetrieved }) => {
  const [productSummary, setProductSummary] = useState<FavouriteProductSummary>();

  const { filter, sort, removeFilter, resetProductListSorter } = useProductListFilterAndSorter();

  const activeBrands = productSummary?.brands.length && isFavouriteRetrieved;
  const activeCategories = productSummary?.categories.length && isFavouriteRetrieved;

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
                  <FilterItem title={filter.title} onDelete={removeFilter} />
                ) : (
                  'select'
                )
              }
              bottomEnable={activeBrands ? true : false}
              bottomValue={
                <CustomDropDown
                  items={formatBrandsFavouriteToDropDownData(productSummary?.brands)}
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
                  <FilterItem title={filter.title} onDelete={removeFilter} />
                ) : (
                  'select'
                )
              }
              bottomEnable={activeCategories ? true : false}
              bottomValue={
                <CustomDropDown
                  items={formatCategoriesFavouriteToDropDownData(productSummary?.categories)}
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
