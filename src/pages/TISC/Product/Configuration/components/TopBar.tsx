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
import { showImageUrl, updateUrlParams } from '@/helper/utils';
import { flatMap, forEach, map } from 'lodash';

import { resetProductState, setBrand } from '@/features/product/reducers';
import { ProductGetListParameter } from '@/features/product/types';
import { BrandAlphabet, BrandDetail } from '@/features/user-group/types';
import { useAppSelector } from '@/reducers';

import Popover from '@/components/Modal/Popover';
import { BodyText } from '@/components/Typography';
import {
  CustomDropDown,
  FilterItem,
  TopBarContainer,
  TopBarItem,
} from '@/features/product/components';
import {
  formatAllCategoriesToDropDownData,
  formatAllCollectionsToDropDownData,
  resetProductFilter,
  useSyncQueryToState,
} from '@/features/product/components/FilterAndSorter';

import styles from './TopBar.less';

const ProductTopBar: React.FC = () => {
  useSyncQueryToState();

  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [brandAlphabet, setBrandAlphabet] = useState<BrandAlphabet>({});
  const [brandData, setBrandData] = useState<any>();
  const brand = useAppSelector((state) => state.product.brand);
  const filter = useAppSelector((state) => state.product.list.filter);
  const productSummary = useAppSelector((state) => state.product.summary);
  const brandFlatList = flatMap(brandAlphabet);

  const query = useQuery();
  const brandId = query.get(QUERY_KEY.b_id);
  const brandName = query.get(QUERY_KEY.b_name);

  /// load brand by alphabet from API
  useEffect(() => {
    getBrandAlphabet().then((data) => {
      setBrandAlphabet(data);
      if (brandId && brandName) {
        setBrandData({ value: brandId });
      }
    });
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
    if (brand && brand.id && productSummary?.brandId !== brand.id) {
      // get product summary
      getProductSummary(brand.id).then(() => {
        // reset filter
        // resetFilter();
      });
    }
  }, [brand, productSummary]);

  useEffect(() => {
    if (brand && brand.id && filter) {
      const params: ProductGetListParameter = {
        brand_id: brand.id,
      };
      if (filter.name === 'category_id') {
        params.category_id = filter.value === 'all' ? 'all' : filter.value;
      }
      if (filter.name === 'collection_id') {
        params.collection_id = filter.value === 'all' ? 'all' : filter.value;
      }
      getProductListByBrandId(params);
    }
  }, [filter, brand]);

  const gotoProductForm = () => {
    dispatch(resetProductState());
    if (brand && brand.id) {
      pushTo(PATH.productConfigurationCreate.replace(':brandId', brand.id));
    }
  };

  /// render custom radio brand list label
  const renderLabel = (item: BrandDetail) => {
    return (
      <BodyText level={5} fontFamily="Roboto">
        <img src={showImageUrl(item.logo ?? '')} className={styles.brandLogo} />
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
              topValue={brand?.name ? brand.name : 'select'}
              disabled={brand?.name ? false : true}
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
              topValue={
                filter?.name === 'category_id' ? (
                  <FilterItem title={filter.title} onDelete={resetProductFilter} />
                ) : brand ? (
                  'view'
                ) : (
                  <span style={{ opacity: 0 }}>.</span>
                )
              }
              disabled
              bottomEnable={productSummary ? true : false}
              bottomValue={
                !brand ? (
                  'View By Category'
                ) : productSummary?.categories ? (
                  <CustomDropDown
                    items={formatAllCategoriesToDropDownData(productSummary.categories)}
                    viewAllTop
                    placement="bottomRight"
                    menuStyle={{ height: 'auto', width: 240 }}>
                    Categories
                  </CustomDropDown>
                ) : (
                  'Collections'
                )
              }
              customClass="left-divider"
            />
            <TopBarItem
              topValue={
                filter?.name === 'collection_id' ? (
                  <FilterItem title={filter.title} onDelete={resetProductFilter} />
                ) : brand ? (
                  'view'
                ) : (
                  <span style={{ opacity: 0 }}>.</span>
                )
              }
              disabled
              bottomEnable={productSummary ? true : false}
              bottomValue={
                !brand ? (
                  'View By Collection'
                ) : productSummary?.collections ? (
                  <CustomDropDown
                    items={formatAllCollectionsToDropDownData(productSummary.collections)}
                    viewAllTop
                    placement="bottomRight"
                    menuStyle={{ height: 'auto', width: 240 }}>
                    Collections
                  </CustomDropDown>
                ) : (
                  'Collections'
                )
              }
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
          const chosenBrand = brandFlatList.find((el) => el.id === v.value);
          if (chosenBrand) {
            updateUrlParams({
              set: [
                { key: QUERY_KEY.b_id, value: chosenBrand.id },
                { key: QUERY_KEY.b_name, value: chosenBrand.name },
              ],
              removeAll: true,
            });
          }
          setBrandData(v);
        }}
      />
    </>
  );
};

export default ProductTopBar;
