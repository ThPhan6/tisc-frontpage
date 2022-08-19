import { CollapseProductList } from '@/features/product/components';
import { useProductListFilterAndSorter } from '@/features/product/components/FilterAndSorter';
import { setProductList } from '@/features/product/reducers';
import { getFavouriteProductList } from '@/services';
import { PageContainer } from '@ant-design/pro-layout';
import { useEffect } from 'react';
import ProductSummrayTopBar from './components/TopBar';
import './index.less';

const MyFavourite = () => {
  const { filter, sort, dispatch } = useProductListFilterAndSorter();

  console.log('filter', filter);
  console.log('sort', sort);

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

  return (
    <PageContainer pageHeaderRender={() => <ProductSummrayTopBar />}>
      <CollapseProductList />
    </PageContainer>
  );
};

export default MyFavourite;
