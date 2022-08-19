import { CollapseProductList } from '@/features/product/components';
import { useProductListFilterAndSorter } from '@/features/product/components/FilterAndSorter';
import { setProductList } from '@/features/product/reducers';
import { getUserInfoMiddleware } from '@/pages/LandingPage/services/api';
import { useAppSelector } from '@/reducers';
import { getFavouriteProductList } from '@/services';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect } from 'react';
import FavouriteForm from './components/FavouriteForm';
import ProductSummrayTopBar from './components/TopBar';
import './styles/index.less';

const MyFavourite = () => {
  const { filter, sort, resetAllProductList, dispatch } = useProductListFilterAndSorter();

  const retrievedFavourite = useAppSelector((state) => state.user.user?.retrieve_favourite);

  // clear all on first loading
  useEffect(() => {
    resetAllProductList();
  }, []);

  useEffect(() => {
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
  }, [filter, sort]);

  // check user already has retrieved favourite
  useEffect(() => {
    getUserInfoMiddleware();
  }, []);

  return (
    <div>
      <PageContainer
        pageHeaderRender={() => <ProductSummrayTopBar isFavouriteRetrieved={retrievedFavourite!} />}
      >
        {retrievedFavourite ? <CollapseProductList /> : <FavouriteForm />}
      </PageContainer>
    </div>
  );
};

export default MyFavourite;
