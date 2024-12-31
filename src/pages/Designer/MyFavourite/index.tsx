import { useEffect } from 'react';

import { QUERY_KEY } from '@/constants/util';
import { PageContainer } from '@ant-design/pro-layout';

import { getFavouriteProductList } from '@/features/favourite/services';
import { useBoolean, useQuery } from '@/helper/hook';

import { setProductList } from '@/features/product/reducers';
import { useAppSelector } from '@/reducers';

import FavouriteForm from '@/features/favourite/components/FavouriteForm';
import ProductSummaryTopBar from '@/features/favourite/components/TopBar';
import { CollapseProductList } from '@/features/product/components';
import { useProductListFilterAndSorter } from '@/features/product/components/BrandProductFilterAndSorter';

const MyFavourite = () => {
  const query = useQuery();
  const cate_id = query.get(QUERY_KEY.cate_id);
  const brand_id = query.get(QUERY_KEY.brand_id);
  const sort_order = query.get(QUERY_KEY.sort_order);
  const firstLoad = useBoolean(true);

  const { filter, sort, dispatch } = useProductListFilterAndSorter({ category: true, brand: true });

  const retrievedFavourite = useAppSelector((state) => state.user.user?.retrieve_favourite);

  useEffect(() => {
    if (retrievedFavourite) {
      dispatch(
        setProductList({
          data: [],
        }),
      );

      const noFiltering = (!filter || filter.length == 0) && !sort;

      if ((cate_id || brand_id || sort_order) && noFiltering && firstLoad.value) {
        firstLoad.setValue(false);
        return;
      }
      const cateFilter = filter?.find((item) => item.name === 'category_id');
      const brandFilter = filter?.find((item) => item.name === 'brand_id');
      getFavouriteProductList({
        category_id: cateFilter ? cateFilter.value : undefined,
        brand_id: brandFilter ? brandFilter.value : undefined,
        order: sort?.order,
      });
    }
  }, [JSON.stringify(filter), sort?.order, retrievedFavourite]);

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => (
          <ProductSummaryTopBar isFavouriteRetrieved={retrievedFavourite as boolean} />
        )}
      >
        {retrievedFavourite ? <CollapseProductList /> : <FavouriteForm />}
      </PageContainer>
    </div>
  );
};

export default MyFavourite;
