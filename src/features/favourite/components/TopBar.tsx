import React, { useEffect, useState } from 'react';

import { ItemType } from 'antd/lib/menu/hooks/useItems';

import { getFavouriteProductSummary } from '../services';

import type { FavouriteProductSummary } from '../types';

import SortOrderPanel from '@/components/SortOrder';
import { TopBarContainer, TopBarItem } from '@/features/product/components';
import { useProductListFilterAndSorter } from '@/features/product/components/BrandProductFilterAndSorter';

import './topBar.less';

export interface ProductSummaryTopBarProps {
  isFavouriteRetrieved: boolean;
}

// export const formatCategoriesFavouriteToDropDownData = (
//   categories?: ProductItemValue[],
// ): ItemType[] => {
//   if (!categories) return [];
//   return categories.map((el) => ({
//     key: el.id,
//     label: el.name || '',
//     onClick: () => onCategoryFilterClick(el.id, el.name),
//   }));
// };

// export const formatBrandsFavouriteToDropDownData = (brands?: ProductItemValue[]): ItemType[] => {
//   if (!brands) return [];
//   return brands.map((el) => ({
//     key: el.id,
//     label: el.name || '',
//     icon: <img src={showImageUrl(el.logo)} style={{ width: 18, height: 18 }} />,
//     onClick: () => onBrandFilterClick(el.id, el.name),
//   }));
// };

const ProductSummaryTopBar: React.FC<ProductSummaryTopBarProps> = ({ isFavouriteRetrieved }) => {
  const [productSummary, setProductSummary] = useState<FavouriteProductSummary>();
  const brandDropDownData: ItemType[] = !productSummary?.brands.length
    ? ([] as ItemType[])
    : productSummary?.brands.map((item) => ({
        key: item.id,
        label: item.name,
        icon: item.logo,
      }));

  const categoryDropDownData: ItemType[] = !productSummary?.categories.length
    ? ([] as ItemType[])
    : productSummary?.categories.map((item) => ({
        key: item.id,
        label: item.name,
      }));

  const { filter, sort, renderItemTopBar, renderFilterDropdown } = useProductListFilterAndSorter({
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
              customClass="left-divider mr-12"
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
              topValue={renderItemTopBar('brand_id', filter, activeBrand ? 'select' : '')}
              bottomEnable={activeBrand}
              bottomValue={renderFilterDropdown(
                'Brands',
                brandDropDownData,
                false,
                undefined,
                undefined,
                { autoHeight: false },
              )}
            />

            {/* categories */}
            <TopBarItem
              disabled
              customClass={`left-divider ${activeCategory ? 'cursor-pointer' : 'cursor-default'} `}
              topValue={renderItemTopBar('category_id', filter, activeCategory ? 'select' : '')}
              bottomEnable={activeCategory}
              bottomValue={renderFilterDropdown(
                'Categories',
                categoryDropDownData,
                false,
                undefined,
                undefined,
                { autoHeight: false },
              )}
            />

            {/* sort */}
            <SortOrderPanel
              order={sort?.order}
              sort={sort}
              bottomEnable={activeSort}
              dropDownDisabled={!activeSort}
              customClass={`left-divider ${activeSort ? 'cursor-pointer' : 'cursor-default'} `}
            />
          </>
        }
      />
    </div>
  );
};

export default ProductSummaryTopBar;
