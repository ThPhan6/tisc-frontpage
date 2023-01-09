import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { PATH } from '@/constants/path';
import { QUERY_KEY } from '@/constants/util';

import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SmallPlusIcon } from '@/assets/icons/small-plus-icon.svg';

import { getProductListByBrandId, getProductSummary } from '@/features/product/services';
import { getBrandAlphabet } from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { useBoolean, useQuery } from '@/helper/hook';
import { updateUrlParams } from '@/helper/utils';
import { flatMap, forEach, map } from 'lodash';

import { RadioValue } from '@/components/CustomRadio/types';
import {
  resetProductState,
  setBrand,
  setFromMyWorkspace,
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
} from '@/features/product/components/FilterAndSorter';

import styles from './TopBar.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

export const TopBar: React.FC = () => {
  useSyncQueryToState();

  const dispatch = useDispatch();
  const { renderFilterDropdown, renderItemTopBar, productSummary, filter, productBrand } =
    useProductListFilterAndSorter({
      category: true,
    });

  const isFromMyWorkspace = useAppSelector((state) => state.product.myWorkSpace);

  const [brandAlphabet, setBrandAlphabet] = useState<BrandAlphabet>({});
  const [brandData, setBrandData] = useState<RadioValue>();

  const query = useQuery();
  const brandId = query.get(QUERY_KEY.b_id);
  const brandName = query.get(QUERY_KEY.b_name);
  const cate_id = query.get(QUERY_KEY.cate_id);
  const coll_id = query.get(QUERY_KEY.coll_id);
  const coll_name = query.get(QUERY_KEY.coll_name);
  const firstLoad = useBoolean(true);

  const [brandSelected, setBrandSelected] = useState<RadioValue>({
    label: productBrand?.name || '',
    value: productBrand?.id || '',
  });

  useEffect(() => {
    if (isFromMyWorkspace) {
      /// set default filter value
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
  }, []);

  /// load brand by alphabet from API
  useEffect(() => {
    showPageLoading();
    getBrandAlphabet().then((data) => {
      setBrandAlphabet(data);
      if (brandId && brandName) {
        setBrandSelected({ value: brandId, label: brandName });
      }
      if (!brandId) {
        hidePageLoading();
      }
    });

    return () => {
      dispatch(setBrand());
      dispatch(setProductList({ data: [] }));
      dispatch(setProductSummary(undefined));
      dispatch(setFromMyWorkspace(false));
    };
  }, [brandId]);

  /// set brand to product reducer
  useEffect(() => {
    if (brandSelected) {
      let curBrand: BrandDetail | undefined;
      forEach(brandAlphabet, (brands) => {
        const foundedBrand = brands.find((item) => item.id === brandSelected.value);

        if (foundedBrand) {
          curBrand = foundedBrand;
        }
      });
      dispatch(setBrand(curBrand));
    }
  }, [brandSelected?.value]);

  // brand product summary
  useEffect(() => {
    if (
      brandSelected &&
      (brandSelected.value as string) &&
      productSummary?.brandId !== (brandSelected.value as string)
    ) {
      // prevent call api on first loading
      if (coll_id && coll_name && firstLoad.value && !filter) {
        return;
      }

      // get product summary
      getProductSummary(brandSelected.value as string).then((res) => {
        /// in case collection filter has chosen,
        /// updated its filter name and param after reloading
        if (
          res.collections.length &&
          brandId &&
          brandName &&
          coll_id &&
          coll_name &&
          filter &&
          filter.name === 'collection_id' &&
          filter.value !== 'all'
        ) {
          const collectionFilterName =
            res.collections.find((collection) => collection.id === filter?.value)?.name || '';

          /// update collection filter name
          dispatch(
            setProductList({
              filter: {
                name: 'collection_id',
                value: filter.value,
                title: collectionFilterName ?? '',
              },
            }),
          );
          /// update params
          updateUrlParams({
            set: [
              { key: QUERY_KEY.b_id, value: brandId },
              { key: QUERY_KEY.b_name, value: brandName },
              { key: QUERY_KEY.coll_id, value: filter.value },
              { key: QUERY_KEY.coll_name, value: collectionFilterName },
            ],
          });
        }
      });
    }
  }, [brandSelected?.value, productSummary?.brandId, filter && firstLoad.value === true]);

  useEffect(() => {
    if (brandSelected?.value) {
      const params: ProductGetListParameter = {
        brand_id: brandSelected.value as string,
        category_id: !filter ? 'all' : undefined,
      };

      if (filter?.name === 'category_id') {
        params.category_id = filter.value === 'all' ? 'all' : filter.value;
      }
      if (filter?.name === 'collection_id') {
        params.collection_id = filter.value === 'all' ? 'all' : filter.value;
      }

      if (!filter && firstLoad.value && (coll_id || cate_id)) {
        firstLoad.setValue(false);
        return;
      }

      getProductListByBrandId(params);
    }
  }, [filter?.value, filter?.name, brandSelected?.value, firstLoad.value]);

  const gotoProductForm = () => {
    dispatch(resetProductState());
    if (brandSelected && brandSelected.value) {
      pushTo(PATH.productConfigurationCreate.replace(':brandId', brandSelected.value as string));
    }
  };

  return (
    <>
      <TopBarContainer
        LeftSideContent={
          <>
            <TopBarItem
              topValue={
                brandSelected && brandSelected.value && brandSelected.label
                  ? productBrand?.name || brandSelected.label
                  : 'select'
              }
              disabled={!brandSelected.label}
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
                        checkedBrand: brandData,
                        onChecked: setBrandData,
                      },
                    },
                  }),
                )
              }
            />
            <TopBarItem
              topValue={productSummary?.category_count ?? ''}
              disabled={!productSummary}
              bottomValue="Categories"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.collection_count ?? ''}
              disabled={!productSummary}
              bottomValue="Collections"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.card_count ?? ''}
              disabled={!productSummary}
              bottomValue="Cards"
              cursor="default"
            />
            <TopBarItem
              topValue={productSummary?.product_count ?? ''}
              disabled={!productSummary}
              bottomValue="Products"
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
                brandSelected && filter?.name !== 'category_id' ? 'view' : '',
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
                brandSelected && filter?.name !== 'collection_id' ? 'view' : '',
              )}
              disabled
              bottomEnable={productSummary ? true : false}
              bottomValue={renderFilterDropdown(
                'Collections',
                productSummary?.collections
                  ? productSummary?.collections.map((collection) => ({
                      key: collection.id,
                      label: collection.name,
                    }))
                  : [],
                true,
                'View by Collections',
                undefined,
                { autoHeight: false, borderFirstItem: true },
              )}
              customClass="left-divider white-space"
            />
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
        <LogoIcon logo={item.logo} className={styles.brandLogo} />
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
              { key: QUERY_KEY.cate_id, value: 'all' },
              { key: QUERY_KEY.cate_name, value: 'VIEW ALL' },
            ],
            removeAll: true,
          });
          store.dispatch(
            setProductList({
              filter: {
                name: 'category_id',
                title: 'VIEW ALL',
                value: 'all',
              },
            }),
          );
        }
        onChecked(v);
      }}
    />
  );
};
