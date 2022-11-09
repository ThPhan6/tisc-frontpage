import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PATH } from '@/constants/path';
import { QUERY_KEY } from '@/constants/util';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SmallPlusIcon } from '@/assets/icons/small-plus-icon.svg';

import { getProductListByBrandId, getProductSummary } from '@/features/product/services';
import { getBrandAlphabet } from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { useQuery } from '@/helper/hook';
import { updateUrlParams } from '@/helper/utils';
import { flatMap, forEach, map } from 'lodash';

import {
  resetProductState,
  setBrand,
  setProductList,
  setProductSummary,
} from '@/features/product/reducers';
import { ProductGetListParameter } from '@/features/product/types';
import { BrandAlphabet, BrandDetail } from '@/features/user-group/types';

import { LogoIcon } from '@/components/LogoIcon';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';
import { TopBarContainer, TopBarItem } from '@/features/product/components';
import {
  useProductListFilterAndSorter,
  useSyncQueryToState,
} from '@/features/product/components/FilterAndSorter';

import styles from './TopBar.less';

export const TopBar: React.FC = () => {
  useSyncQueryToState();

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [brandAlphabet, setBrandAlphabet] = useState<BrandAlphabet>({});
  const [brandData, setBrandData] = useState<any>();
  const brandFlatList = flatMap(brandAlphabet);

  const query = useQuery();
  const brandId = query.get(QUERY_KEY.b_id);
  const brandName = query.get(QUERY_KEY.b_name);

  const { renderFilterDropdown, renderItemTopBar, productSummary, filter, productBrand } =
    useProductListFilterAndSorter({
      noFetchData: true,
    });

  /// load brand by alphabet from API
  useEffect(() => {
    getBrandAlphabet().then((data) => {
      setBrandAlphabet(data);
      if (brandId && brandName) {
        setBrandData({ value: brandId });
      }
    });

    return () => {
      dispatch(setBrand());
      dispatch(setProductList({ data: [] }));
      dispatch(setProductSummary(undefined));
    };
  }, []);

  /// set brand to product reducer
  useEffect(() => {
    if (brandData) {
      let curBrand: BrandDetail | undefined;
      forEach(brandAlphabet, (brands) => {
        const foundedBrand = brands.find((item) => item.id === brandData.value);
        if (foundedBrand) {
          curBrand = foundedBrand;
        }
      });
      dispatch(setBrand(curBrand));
    }
  }, [brandData]);

  // brand product summary
  useEffect(() => {
    if (productBrand && productBrand.id && productSummary?.brandId !== productBrand.id) {
      // get product summary
      getProductSummary(productBrand.id).then(() => {
        // reset filter
        // resetFilter();
      });
    }
  }, [productBrand, productSummary]);

  useEffect(() => {
    if (productBrand && productBrand.id && filter) {
      const params: ProductGetListParameter = {
        brand_id: productBrand.id,
      };
      if (filter.name === 'category_id') {
        params.category_id = filter.value === 'all' ? 'all' : filter.value;
      }
      if (filter.name === 'collection_id') {
        params.collection_id = filter.value === 'all' ? 'all' : filter.value;
      }
      getProductListByBrandId(params);
    }
  }, [filter, productBrand]);

  const gotoProductForm = () => {
    dispatch(resetProductState());
    if (productBrand && productBrand.id) {
      pushTo(PATH.productConfigurationCreate.replace(':brandId', productBrand.id));
    }
  };

  /// render custom radio brand list label
  const renderLabel = (item: BrandDetail) => {
    return (
      <BodyText level={5} fontFamily="Roboto">
        <LogoIcon logo={item.logo} className={styles.brandLogo} />
        <span className="brand-name">{item.name}</span>
      </BodyText>
    );
  };

  return (
    <>
      <TopBarContainer
        LeftSideContent={
          <>
            <TopBarItem
              topValue={productBrand?.name ? productBrand.name : 'select'}
              disabled={productBrand?.name ? false : true}
              bottomEnable
              bottomValue="Brands"
              customClass="brand-dropdown right-divider"
              icon={<DropdownIcon />}
              onClick={() => setVisible(true)}
            />
            <TopBarItem
              topValue={productSummary?.category_count ?? ''}
              disabled={productSummary ? false : true}
              bottomValue="Categories"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.collection_count ?? ''}
              disabled={productSummary ? false : true}
              bottomValue="Collections"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.card_count ?? ''}
              disabled={productSummary ? false : true}
              bottomValue="Cards"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.product_count ?? ''}
              disabled={productSummary ? false : true}
              bottomValue="Products"
              cursor="default"
            />
          </>
        }
        RightSideContent={
          <>
            <TopBarItem
              topValue={renderFilterDropdown('category_id')}
              disabled
              bottomEnable={productSummary ? true : false}
              bottomValue={renderItemTopBar('Categories')}
              customClass="left-divider"
            />
            <TopBarItem
              topValue={renderFilterDropdown('collection_id')}
              disabled
              bottomEnable={productSummary ? true : false}
              bottomValue={renderItemTopBar('Collections')}
              customClass="left-divider"
            />
            <TopBarItem
              topValue={<span style={{ opacity: 0 }}>.</span>}
              disabled
              bottomEnable={productSummary ? true : false}
              bottomValue="New Card"
              customClass="left-divider"
              onClick={productSummary ? gotoProductForm : undefined}
              icon={
                <span
                  className={`
                ${styles.newCardIcon}
                ${productSummary ? styles.activeNewCard : styles.disabledNewCard}`}>
                  <SmallPlusIcon />
                </span>
              }
            />
          </>
        }
      />

      <Popover
        visible={visible}
        setVisible={setVisible}
        title="select brand"
        dropdownRadioList={map(brandAlphabet, (items, key) => {
          return {
            key,
            margin: 12,
            options: items.map((item) => {
              return {
                label: renderLabel(item),
                value: item.id,
              };
            }),
          };
        })}
        dropDownRadioTitle={(data) => data.key.split('').join(' / ')}
        chosenValue={brandData}
        setChosenValue={(v) => {
          const chosenBrand = brandFlatList.find((el) => v?.value && el.id === v.value);
          if (chosenBrand) {
            updateUrlParams({
              set: [
                { key: QUERY_KEY.b_id, value: chosenBrand.id },
                { key: QUERY_KEY.b_name, value: chosenBrand.name },
                { key: QUERY_KEY.cate_id, value: 'all' },
                { key: QUERY_KEY.cate_name, value: 'VIEW ALL' },
              ],
              removeAll: true,
            });
            dispatch(
              setProductList({
                filter: {
                  name: 'category_id',
                  title: 'VIEW ALL',
                  value: 'all',
                },
              }),
            );
          }
          setBrandData(v);
        }}
      />
    </>
  );
};
