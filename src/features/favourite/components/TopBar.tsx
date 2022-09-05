import React, { useEffect, useState } from 'react';

import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { getFavouriteProductSummary } from '../services';
import { showImageUrl } from '@/helper/utils';

import type { FavouriteProductSummary } from '../types';
import { ProductItemValue } from '@/features/product/types';

import {
  CustomDropDown,
  FilterItem,
  TopBarContainer,
  TopBarItem,
} from '@/features/product/components';
import {
  SORTER_DROPDOWN_DATA,
  onBrandFilterClick,
  onCategoryFilterClick,
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
    onClick: () => onCategoryFilterClick(el.id, el.name),
  }));
};

export const formatBrandsFavouriteToDropDownData = (brands?: ProductItemValue[]): ItemType[] => {
  if (!brands) return [];
  return brands.map((el) => ({
    key: el.id,
    label: el.name || '',
    icon: <img src={showImageUrl(el.logo)} style={{ width: 18, height: 18 }} />,
    onClick: () => onBrandFilterClick(el.id, el.name),
  }));
};

const ProductSummaryTopBar: React.FC<ProductSummaryTopBarProps> = ({ isFavouriteRetrieved }) => {
  const [productSummary, setProductSummary] = useState<FavouriteProductSummary>();

  const { filter, sort, removeFilter, resetProductListSorter } = useProductListFilterAndSorter({
    noFetchData: true,
  });

  const activeBrand = productSummary?.brands?.length !== 0 && isFavouriteRetrieved;
  const activeCategory = productSummary?.categories?.length !== 0 && isFavouriteRetrieved;
  const activeSort = activeBrand || activeCategory;

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
              customClass={`left-divider ${activeBrand ? 'cursor-pointer' : 'cursor-default'} `}
              topValue={
                filter?.name === 'brand_id' ? (
                  <FilterItem title={filter.title} onDelete={removeFilter} />
                ) : (
                  'select'
                )
              }
              bottomEnable={activeBrand}
              bottomValue={
                <CustomDropDown
                  items={formatBrandsFavouriteToDropDownData(productSummary?.brands)}
                  menuStyle={{ width: 240 }}
                  disabled={!activeBrand}
                  placement="bottomRight">
                  Brands
                </CustomDropDown>
              }
            />

            {/* categories */}
            <TopBarItem
              disabled
              customClass={`left-divider ${activeCategory ? 'cursor-pointer' : 'cursor-default'} `}
              topValue={
                filter?.name === 'category_id' ? (
                  <FilterItem title={filter.title} onDelete={removeFilter} />
                ) : (
                  'select'
                )
              }
              bottomEnable={activeCategory}
              bottomValue={
                <CustomDropDown
                  placement="bottomRight"
                  menuStyle={{ width: 240 }}
                  items={formatCategoriesFavouriteToDropDownData(productSummary?.categories)}
                  disabled={!activeCategory}>
                  Categories
                </CustomDropDown>
              }
            />

            {/* sort */}
            <TopBarItem
              disabled
              customClass={`left-divider ${activeSort ? 'cursor-pointer' : 'cursor-default'} `}
              bottomEnable={activeSort}
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
                  placement="bottomRight"
                  menuStyle={{ width: 160, height: 'auto' }}
                  disabled={!activeSort}>
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
