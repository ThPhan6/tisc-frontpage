import { CollapseProductList } from '@/features/product/components';
import { useProductListFilterAndSorter } from '@/features/product/components/FilterAndSorter';
import { setProductList } from '@/features/product/reducers';
import { useAppSelector } from '@/reducers';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect } from 'react';
import FavouriteForm from '@/features/favourite/components/FavouriteForm';
import ProductSummaryTopBar from '@/features/favourite/components/TopBar';
import './index.less';
import { getFavouriteProductList } from '@/features/favourite/services/index';

const MyFavourite = () => {
  const { filter, sort, resetAllProductList, dispatch } = useProductListFilterAndSorter();

  const retrievedFavourite = useAppSelector((state) => state.user.user?.retrieve_favourite);

  // clear all on first loading
  useEffect(() => {
    resetAllProductList();
  }, [retrievedFavourite]);

  useEffect(() => {
    if (retrievedFavourite) {
      dispatch(
        setProductList({
          data: [],
        }),
      );
      getFavouriteProductList({
        category_id: filter?.name === 'category_id' ? filter.value : undefined,
        brand_id: filter?.name === 'brand_id' ? filter.value : undefined,
        // sort: sort?.sort,
        order: sort?.order,
      });
    }
  }, [filter, sort, retrievedFavourite]);

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => <ProductSummaryTopBar isFavouriteRetrieved={retrievedFavourite!} />}
      >
        {retrievedFavourite ? <CollapseProductList /> : <FavouriteForm />}
      </PageContainer>
    </div>
  );
};

export default MyFavourite;
