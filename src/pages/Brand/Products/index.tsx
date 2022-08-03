import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  FilterItem,
  renderDropDownList,
  TopBarContainer,
  TopBarItem,
  CollapseProductList,
} from '@/features/product/components';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { resetProductState, setProductList } from '@/features/product/reducers';
import { getProductListByBrandId, getProductSummary } from '@/features/product/services';
import type { ProductGetListParameter } from '@/features/product/types';

const BrandProductListPage: React.FC = () => {
  const dispatch = useDispatch();
  const filter = useAppSelector((state) => state.product.list.filter);
  const summary = useAppSelector((state) => state.product.summary);
  const userBrand = useAppSelector((state) => state.user.user?.brand);

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

    return () => {
      dispatch(resetProductState());
    };
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

  return (
    <PageContainer
      pageHeaderRender={() => (
        <TopBarContainer
          LeftSideContent={
            <>
              <TopBarItem
                topValue={summary?.category_count ?? '0'}
                disabled={summary ? false : true}
                bottomValue="Categories"
                customClass={`category ${summary?.category_count ? 'bold' : ''}`}
              />
              <TopBarItem
                topValue={summary?.collection_count ?? '0'}
                disabled={summary ? false : true}
                bottomValue="Collections"
                customClass={`left-divider ${summary?.collection_count ? 'bold' : ''}`}
              />
              <TopBarItem
                topValue={summary?.card_count ?? '0'}
                disabled={summary ? false : true}
                bottomValue="Cards"
                customClass={`left-divider ${summary?.card_count ? 'bold' : ''}`}
              />
              <TopBarItem
                topValue={summary?.product_count ?? '0'}
                disabled={summary ? false : true}
                bottomValue="Products"
                customClass={`left-divider ${summary?.product_count ? 'bold' : ''}`}
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
                bottomEnable={summary ? true : false}
                bottomValue={
                  !userBrand
                    ? 'Categories'
                    : renderDropDownList(
                        'Categories',
                        'category_id',
                        summary?.categories ?? [],
                        summary ? false : true,
                      )
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
                bottomEnable={summary ? true : false}
                bottomValue={
                  !userBrand
                    ? 'Collections'
                    : renderDropDownList(
                        'Collections',
                        'collection_id',
                        summary?.collections ?? [],
                        summary ? false : true,
                      )
                }
                customClass="left-divider collection"
              />
            </>
          }
        />
      )}
    >
      <CollapseProductList />
    </PageContainer>
  );
};

export default BrandProductListPage;
