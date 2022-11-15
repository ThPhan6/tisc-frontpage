import React, { useEffect } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as PlusCircleIcon } from '@/assets/icons/plus-circle-icon.svg';
import { ReactComponent as VendorManagementIcon } from '@/assets/icons/vendor-management-icon.svg';

import { pushTo } from '@/helper/history';

import { ProductGetListParameter } from '@/features/product/types';

import { RobotoBodyText } from '@/components/Typography';
import { TopBarContainer, TopBarItem } from '@/features/product/components';
import { useProductListFilterAndSorter } from '@/features/product/components/FilterAndSorter';

import styles from './index.less';

export const ProductListTopBar: React.FC = () => {
  const { renderFilterDropdown, renderItemTopBar, productSummary, filter, productBrand } =
    useProductListFilterAndSorter({
      noFetchData: true,
    });

  // useEffect(() => {
  //   return () => {
  //     dispatch(setBrand());
  //     dispatch(setProductList({ data: [] }));
  //     dispatch(setProductSummary(undefined));
  //   };
  // }, []);

  // brand product summary
  useEffect(() => {
    if (productBrand && productBrand.id && productSummary?.brandId !== productBrand.id) {
      // get product summary
      // getProductSummary(productBrand.id);
    }
  }, [productBrand, productSummary]);

  useEffect(() => {
    if (productBrand && productBrand.id && filter) {
      const params: ProductGetListParameter = {
        brand_id: productBrand.id,
      };
      if (filter.name === 'collection_id') {
        params.collection_id = filter.value === 'all' ? 'all' : filter.value;
      }
      if (filter.name === 'company_id') {
        params.company_id = filter.value === 'all' ? 'all' : filter.value;
      }
      // getProductListByBrandId(params);
    }
  }, [filter, productBrand]);

  const gotoProductForm = () => {
    // dispatch(resetProductState());
    // if (productBrand && productBrand.id) {
    pushTo(PATH.designerOfficeLibraryCreate.replace(':brandId', ''));
    // }
  };

  return (
    <>
      <TopBarContainer
        LeftSideContent={
          <>
            <TopBarItem
              topValue={renderFilterDropdown('company_id')}
              disabled
              bottomEnable={productSummary ? true : false}
              bottomValue={renderItemTopBar('Companies')}
              customClass={styles.paddingLeftNone}
            />
            <TopBarItem
              topValue={renderFilterDropdown('collection_id')}
              disabled
              bottomEnable={productSummary ? true : false}
              bottomValue={renderItemTopBar('Collections')}
              customClass="left-divider"
            />
          </>
        }
        RightSideContent={
          <>
            <TopBarItem
              bottomValue="New Product"
              cursor="pointer"
              customClass="left-divider mr-0"
              onClick={gotoProductForm}
              icon={<PlusCircleIcon />}
            />
            <TopBarItem
              topValue={
                <RobotoBodyText level={5} customClass={styles.fontBold}>
                  Click to open
                </RobotoBodyText>
              }
              customClass="left-divider mr-12"
              bottomValue="Vendor Management"
              cursor="pointer"
              onClick={() => pushTo(PATH.designerCustomResource)}
              icon={<VendorManagementIcon />}
            />
          </>
        }
      />
    </>
  );
};
