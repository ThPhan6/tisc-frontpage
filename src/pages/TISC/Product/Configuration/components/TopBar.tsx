import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PATH } from '@/constants/path';
import { QUERY_KEY } from '@/constants/util';
import { useLocation } from 'umi';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SmallPlusIcon } from '@/assets/icons/small-plus-icon.svg';

import { getBrandProductListByBrandId, getProductSummary } from '@/features/product/services';
import { getBrandAlphabet } from '@/features/user-group/services';
import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean, useQuery } from '@/helper/hook';
import { formatNumber, updateUrlParams } from '@/helper/utils';
import { flatMap, forEach, map } from 'lodash';

import { RadioValue } from '@/components/CustomRadio/types';
import {
  resetProductState,
  setBrand,
  setProductList,
  setProductSummary,
} from '@/features/product/reducers';
import { ProductGetListParameter } from '@/features/product/types';
import { BrandAlphabet, BrandDetail } from '@/features/user-group/types';
import store, { useAppSelector } from '@/reducers';
import { modalPropsSelector, openModal } from '@/reducers/modal';

import { LogoIcon } from '@/components/LogoIcon';
import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';
import { TopBarContainer, TopBarItem } from '@/features/product/components';
import {
  useProductListFilterAndSorter,
  useSyncQueryToState,
} from '@/features/product/components/BrandProductFilterAndSorter';

import styles from './TopBar.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const setViewProductLitsByCollection = () =>
  store.dispatch(
    setProductList({
      filter: [
        {
          name: 'collection_id',
          title: 'VIEW ALL',
          value: 'all',
        },
      ],
    }),
  );

export const TopBar: React.FC = () => {
  useSyncQueryToState();

  const isTablet = useScreen().isTablet;

  const dispatch = useDispatch();
  const { renderFilterDropdown, renderItemTopBar, productSummary, filter, productBrand } =
    useProductListFilterAndSorter({
      category: true,
    });

  const [brandAlphabet, setBrandAlphabet] = useState<BrandAlphabet>({});

  const query = useQuery();

  const location = useLocation<{ fromMyWorkspace?: boolean }>();
  const brandId = query.get(QUERY_KEY.b_id);
  const brandName = query.get(QUERY_KEY.b_name);
  const cate_id = query.get(QUERY_KEY.cate_id);
  const coll_id = query.get(QUERY_KEY.coll_id);
  const coll_name = query.get(QUERY_KEY.coll_name);
  const firstLoad = useBoolean(true);

  const [checkedBrand, setCheckedBrand] = useState<RadioValue>({
    label: productBrand?.name || '',
    value: productBrand?.id || '',
  });

  useEffect(() => {
    if (
      !checkedBrand.value ||
      ((!filter || filter.length == 0) && firstLoad.value && (coll_id || cate_id))
    ) {
      return;
    }

    /// set default filter value
    setViewProductLitsByCollection();
  }, []);

  /// load brand by alphabet from API
  useEffect(() => {
    showPageLoading();
    getBrandAlphabet().then((data) => {
      setBrandAlphabet(data);
      if (brandId && brandName) {
        setCheckedBrand({ value: brandId, label: brandName });
      }
      if (!brandId) {
        hidePageLoading();
      }
    });

    return () => {
      dispatch(setBrand());
      dispatch(setProductList({ data: [] }));
      dispatch(setProductSummary(undefined));
    };
  }, [brandId]);

  // brand product summary
  useEffect(() => {
    /// set brand to product reducer
    if (checkedBrand) {
      let curBrand: BrandDetail | undefined;
      forEach(brandAlphabet, (brands) => {
        const foundedBrand = brands.find((item) => item.id === checkedBrand.value);

        if (foundedBrand) {
          curBrand = foundedBrand;
        }
      });
      dispatch(setBrand(curBrand));
    }

    if (
      checkedBrand &&
      (checkedBrand.value as string) &&
      productSummary?.brandId !== (checkedBrand.value as string)
    ) {
      // prevent call api on first loading
      if (
        coll_id &&
        coll_name &&
        firstLoad.value &&
        (!filter || filter.length == 0) &&
        location.state?.fromMyWorkspace
      ) {
        return;
      }

      // get product summary
      getProductSummary(checkedBrand.value as string, false).then((res) => {
        /// in case collection filter has chosen,
        /// updated its filter name and param after reloading
        const collFilter = filter?.find((item) => item.name === 'collection_id');
        if (
          res.collections.length &&
          brandId &&
          brandName &&
          coll_id &&
          coll_name &&
          filter &&
          collFilter &&
          collFilter.value !== 'all'
        ) {
          const collectionFilterName =
            res.collections.find((collection) => collection.id === collFilter?.value)?.name || '';

          /// update collection filter name
          dispatch(
            setProductList({
              filter: [
                {
                  name: 'collection_id',
                  value: collFilter.value,
                  title: collectionFilterName ?? '',
                },
              ],
            }),
          );
          /// update params
          updateUrlParams({
            set: [
              { key: QUERY_KEY.b_id, value: brandId },
              { key: QUERY_KEY.b_name, value: brandName },
              { key: QUERY_KEY.coll_id, value: collFilter.value },
              { key: QUERY_KEY.coll_name, value: collectionFilterName },
            ],
          });
        }
      });
    }
  }, [checkedBrand?.value]);

  useEffect(() => {
    if (checkedBrand?.value) {
      /// set get default product list by collection
      const params: ProductGetListParameter = {
        brand_id: checkedBrand.value as string,
        collection_id: !filter ? 'all' : undefined,
      };
      const cateFilter = filter?.find((item) => item.name === 'category_id');
      const collFilter = filter?.find((item) => item.name === 'collection_id');
      if (cateFilter) {
        params.category_id = cateFilter.value === 'all' ? 'all' : cateFilter.value;
      }
      if (collFilter) {
        params.collection_id = collFilter.value === 'all' ? 'all' : collFilter.value;
      }

      if (
        (!filter || filter.length == 0) &&
        firstLoad.value &&
        (coll_id || cate_id || location.state?.fromMyWorkspace)
      ) {
        firstLoad.setValue(false);
        return;
      }

      getBrandProductListByBrandId(params);
    }
  }, [filter, checkedBrand?.value, firstLoad.value]);

  const gotoProductForm = () => {
    dispatch(resetProductState());
    if (checkedBrand && checkedBrand.value) {
      pushTo(PATH.productConfigurationCreate.replace(':brandId', checkedBrand.value as string));
    }
  };

  return (
    <>
      <TopBarContainer
        LeftSideContent={
          <>
            <TopBarItem
              topValue={
                checkedBrand && checkedBrand.value && checkedBrand.label
                  ? productBrand?.name || checkedBrand.label
                  : 'select'
              }
              disabled={!checkedBrand.label}
              bottomEnable
              bottomValue="Brands"
              customClass="brand-dropdown right-divider"
              icon={<DropdownIcon />}
              onClick={() =>
                dispatch(
                  openModal({
                    type: 'Select Brand',
                    title: 'Select Brand',
                    props: {
                      selectBrand: {
                        brands: brandAlphabet,
                        checkedBrand,
                        onChecked: setCheckedBrand,
                      },
                    },
                  }),
                )
              }
            />
            <TopBarItem
              topValue={formatNumber(productSummary?.category_count) ?? ''}
              disabled={!productSummary}
              bottomValue="Categories"
              cursor="default"
            />
            <TopBarItem
              topValue={formatNumber(productSummary?.collection_count) ?? ''}
              disabled={!productSummary}
              bottomValue="Collections"
              cursor="default"
            />
            <TopBarItem
              topValue={formatNumber(productSummary?.card_count) ?? ''}
              disabled={!productSummary}
              bottomValue="Cards"
              cursor="default"
            />
          </>
        }
        RightSideContent={
          <>
            <TopBarItem
              topValue={renderItemTopBar(
                'category_id',
                filter,
                checkedBrand && !filter?.find((item) => item.name !== 'category_id') ? 'view' : '',
              )}
              disabled
              bottomEnable={productSummary ? true : false}
              bottomValue={renderFilterDropdown(
                'Categories',
                productSummary?.categories.length
                  ? productSummary?.categories.map((category) => ({
                      key: category.id,
                      label: category.name,
                    }))
                  : [],
                true,
                'View by categories',
                undefined,
                { autoHeight: false, borderFirstItem: true },
              )}
              customClass="left-divider white-space"
            />
            <TopBarItem
              topValue={renderItemTopBar(
                'collection_id',
                filter,
                checkedBrand && !filter?.find((item) => item.name !== 'collection_id')
                  ? 'view'
                  : '',
              )}
              disabled
              bottomEnable={productSummary ? true : false}
              bottomValue={renderFilterDropdown(
                'Collections',
                productSummary?.collections
                  ? productSummary?.x_collection
                    ? [
                        ...productSummary?.collections.map((collection) => ({
                          key: collection.id,
                          label: collection.name,
                        })),
                        { key: '-1', label: 'X Collection' },
                      ]
                    : productSummary?.collections.map((collection) => ({
                        key: collection.id,
                        label: collection.name,
                      }))
                  : [],
                true,
                'View by Collections',
                undefined,
                { autoHeight: false, borderFirstItem: true },
              )}
              customClass={`left-divider white-space ${
                filter?.find((item) => item.name === 'collection_id')?.value === 'all'
                  ? styles.hideDeleteIcon
                  : ''
              }`}
            />
            {isTablet ? null : (
              <TopBarItem
                disabled
                bottomEnable={productSummary ? true : false}
                bottomValue="New Card"
                customClass="left-divider mr-12 white-space"
                onClick={productSummary ? gotoProductForm : undefined}
                icon={
                  <span
                    className={`${styles.newCardIcon} ${
                      productSummary ? styles.activeNewCard : styles.disabledNewCard
                    }`}
                  >
                    <SmallPlusIcon />
                  </span>
                }
              />
            )}
          </>
        }
      />
    </>
  );
};

export const SelectBrandModal = () => {
  const { brands, checkedBrand, onChecked } = useAppSelector(modalPropsSelector).selectBrand;
  const brandFlatList = flatMap(brands);
  /// render custom radio brand list label
  const renderLabel = (item: BrandDetail) => {
    return (
      <BodyText level={5} fontFamily="Roboto">
        <LogoIcon logo={item.logo} className={styles.brandLogo} size={18} />
        <span className="brand-name">{item.name}</span>
      </BodyText>
    );
  };

  return (
    <Popover
      visible
      title="select brand"
      dropdownRadioList={map(brands, (items, key) => ({
        key,
        margin: 12,
        options: items.map((item) => ({
          label: renderLabel(item),
          value: item.id,
        })),
      }))}
      dropDownRadioTitle={(data) => data.key.split('').join(' / ')}
      chosenValue={checkedBrand}
      setChosenValue={(v) => {
        const chosenBrand = brandFlatList.find((el) => v?.value && el.id === v.value);
        if (chosenBrand) {
          updateUrlParams({
            set: [
              { key: QUERY_KEY.b_id, value: chosenBrand.id },
              { key: QUERY_KEY.b_name, value: chosenBrand.name },
              { key: QUERY_KEY.coll_id, value: 'all' },
              { key: QUERY_KEY.coll_name, value: 'VIEW ALL' },
            ],
            removeAll: true,
          });
          // set view default product list by collection
          setViewProductLitsByCollection();
        }
        onChecked(v);
      }}
    />
  );
};
