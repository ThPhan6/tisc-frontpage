import React, { useState, useEffect } from 'react';
import { BodyText } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import { HeaderDropdown } from '@/components/HeaderDropdown';
import { getBrandAlphabet, getProductSummary, getProductListByBrandId } from '@/services';
import type {
  BrandAlphabet,
  BrandDetail,
  GeneralData,
  ProductGetListParameter,
  ProductFilterType,
} from '@/types';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SmallPlusIcon } from '@/assets/icons/small-plus-icon.svg';
import { showImageUrl } from '@/helper/utils';
import { map, forEach } from 'lodash';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setBrand, setProductList, resetProductState } from '@/reducers/product';
import { pushTo } from '@/helper/history';
import { PATH } from '@/constants/path';
import {
  FilterItem,
  TopBarContainer,
  TopBarItem,
} from '@/components/Product/components/ProductTopBarItem';
import styles from '@/components/Product/styles/top-bar.less';

const ProductTopBar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [brandAlphabet, setBrandAlphabet] = useState<BrandAlphabet>({});
  const [brandData, setBrandData] = useState<any>();
  const product = useAppSelector((state) => state.product);
  const { filter } = product.list;
  const dispatch = useDispatch();

  const resetProductList = () => {
    dispatch(
      setProductList({
        filter: undefined,
        data: [],
      }),
    );
  };

  /// set brand to product reducer
  useEffect(() => {
    if (brandData) {
      let brand: BrandDetail | undefined;
      forEach(brandAlphabet, (brands) => {
        const foundedBrand = brands.find((item) => item.id === brandData.value);
        if (foundedBrand) {
          brand = foundedBrand;
        }
      });
      //
      dispatch(setBrand(brand));
    }
  }, [brandData]);

  /// load brand by alphabet from API
  useEffect(() => {
    getBrandAlphabet().then(setBrandAlphabet);
  }, []);

  // brand product summary
  useEffect(() => {
    if (product.brand && product.brand.id && product.summary?.brandId !== product.brand.id) {
      // get product summary
      getProductSummary(product.brand.id).then(() => {
        // reset filter
        resetProductList();
      });
    }
  }, [product.brand]);

  useEffect(() => {
    if (product.brand && product.brand.id && filter) {
      const params = {
        brand_id: product.brand.id,
      } as ProductGetListParameter;
      if (filter.name === 'category_id' && filter.value !== 'all') {
        params.category_id = filter.value;
      }
      if (filter.name === 'collection_id' && filter.value !== 'all') {
        params.collection_id = filter.value;
      }
      getProductListByBrandId(params);
    }
  }, [filter]);

  const gotoProductForm = () => {
    dispatch(resetProductState());
    if (product.brand && product.brand.id) {
      pushTo(PATH.productConfigurationCreate.replace(':brandId', product.brand.id));
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

  const renderDropDownList = (
    title: string,
    filterName: ProductFilterType,
    data: GeneralData[],
  ) => {
    // merge view small
    const items = [{ id: 'all', name: 'VIEW ALL' }, ...data];
    ///
    return (
      <HeaderDropdown
        align={{ offset: [26, 7] }}
        placement="bottomRight"
        containerClass={styles.topbarDropdown}
        disabled={product.summary ? false : true}
        items={items.map((item) => {
          return {
            onClick: () => {
              dispatch(
                setProductList({
                  filter: {
                    name: filterName,
                    title: item.name,
                    value: item.id,
                  },
                }),
              );
            },
            label: item.name,
          };
        })}
        trigger={['click']}
      >
        <span>
          {title}
          <DropdownIcon />
        </span>
      </HeaderDropdown>
    );
  };

  return (
    <>
      <TopBarContainer
        LeftSideContent={
          <>
            <TopBarItem
              topValue={
                product.brand?.name ? <span className="bold">{product.brand.name}</span> : 'select'
              }
              disabled={product.brand?.name ? false : true}
              bottomEnable
              bottomValue="Brands"
              customClass="brand-dropdown right-divider"
              icon={<DropdownIcon />}
              onClick={() => setVisible(true)}
            />
            <TopBarItem
              topValue={product.summary?.category_count ?? ''}
              disabled={product.summary ? false : true}
              bottomValue="Categories"
            />
            <TopBarItem
              topValue={product.summary?.collection_count ?? ''}
              disabled={product.summary ? false : true}
              bottomValue="Collections"
            />
            <TopBarItem
              topValue={product.summary?.card_count ?? ''}
              disabled={product.summary ? false : true}
              bottomValue="Cards"
            />
            <TopBarItem
              topValue={product.summary?.product_count ?? ''}
              disabled={product.summary ? false : true}
              bottomValue="Products"
            />
          </>
        }
        RightSideContent={
          <>
            {' '}
            <TopBarItem
              topValue={
                filter?.name === 'category_id' ? (
                  <FilterItem title={filter.title} onDelete={resetProductList} />
                ) : product.brand ? (
                  'view'
                ) : (
                  <span style={{ opacity: 0 }}>.</span>
                )
              }
              disabled
              bottomEnable={product.summary ? true : false}
              bottomValue={
                !product.brand
                  ? 'View By Category'
                  : renderDropDownList(
                      'Categories',
                      'category_id',
                      product.summary?.categories ?? [],
                    )
              }
              customClass="left-divider"
            />
            <TopBarItem
              topValue={
                filter?.name === 'collection_id' ? (
                  <FilterItem title={filter.title} onDelete={resetProductList} />
                ) : product.brand ? (
                  'view'
                ) : (
                  <span style={{ opacity: 0 }}>.</span>
                )
              }
              disabled
              bottomEnable={product.summary ? true : false}
              bottomValue={
                !product.brand
                  ? 'View By Collection'
                  : renderDropDownList(
                      'Collections',
                      'collection_id',
                      product.summary?.collections ?? [],
                    )
              }
              customClass="left-divider"
            />
            <TopBarItem
              topValue={<span style={{ opacity: 0 }}>.</span>}
              disabled
              bottomEnable={product.summary ? true : false}
              bottomValue="New Card"
              customClass="left-divider"
              onClick={product.summary ? gotoProductForm : undefined}
              icon={
                <span
                  className={`
                ${styles.newCardIcon}
                ${product.summary ? styles.activeNewCard : styles.disabledNewCard}`}
                >
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
        setChosenValue={setBrandData}
      />
    </>
  );
};

export default ProductTopBar;
