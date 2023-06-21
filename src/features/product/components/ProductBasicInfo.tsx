import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { message } from 'antd';

import { ReactComponent as RightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';
import { ReactComponent as ColorDetectionIcon } from '@/assets/icons/color-palette.svg';

import { getAllProductCategory } from '@/features/categories/services';
import { useScreen } from '@/helper/common';
import { useCheckPermission } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { concat, isEmpty } from 'lodash';

import { ProductAttributeFormInput } from '../types';
import { SupportCategories } from '@/features/colorDetection/types';
import { productVariantsSelector, setPartialProductDetail } from '@/features/product/reducers';
import store, { useAppSelector } from '@/reducers';
import { openModal } from '@/reducers/modal';
import { CollectionRelationType } from '@/types';

import CustomCollapse from '@/components/Collapse';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { BodyText } from '@/components/Typography';

import { CollectionModal } from '../modals/CollectionModal';
import styles from './detail.less';

export const getProductVariant = (specGroup: ProductAttributeFormInput[]): string => {
  const variants: string[] = [];

  specGroup.forEach((el) => {
    el.attributes.forEach((attr) => {
      if (attr.type === 'Options' && attr.basis_options) {
        attr.basis_options.forEach((opt) => {
          if (!isEmpty(opt.option_code)) {
            variants.push(opt.option_code);
          }
        });
      }
    });
  });

  return variants.join(' - ');
};

export const ProductBasicInfo: React.FC = () => {
  const isTablet = useScreen().isTablet;
  const dispatch = useDispatch();
  const isTiscAdmin = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const editable = isTiscAdmin && !isTablet;

  const brand = useAppSelector((state) => state.product.brand);
  const spec = useAppSelector((state) => state.product.details.specification_attribute_groups);
  /// brand and designer
  const productVariant = useAppSelector(productVariantsSelector);

  const { name, description, collection } = useAppSelector((state) => state.product.details);
  const [visible, setVisible] = useState(false);

  const categoryChosen = useAppSelector((state) => state.product.details.categories);
  const categoryData = useAppSelector((state) => state.category.list);
  const [isCateSupported, setIsCateSupported] = useState<boolean>();

  const getCategoryData = async () => {
    await getAllProductCategory();
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  useEffect(() => {
    let cateSupported = false;

    const categoryIds = categoryChosen?.map((el) => el.id);

    /// category supported contains its main or sub or itself's wood/stone
    categoryData.forEach((mainCate) => {
      mainCate.subs.forEach((subCate) => {
        subCate.subs.forEach((item) => {
          if (categoryIds.includes(item.id)) {
            if (
              ''
                .concat(subCate?.name ?? '', subCate?.name ?? '', item?.name ?? '')
                .includes(SupportCategories.wood) ||
              ''
                .concat(subCate?.name ?? '', subCate?.name ?? '', item?.name ?? '')
                .includes(SupportCategories.stone)
            ) {
              cateSupported = true;
            }
          }
        });
      });
    });

    setIsCateSupported(cateSupported);
  }, [categoryChosen]);

  const images = useAppSelector((state) => state.product.details.images);
  const activeColorAI = isTiscAdmin && !!images.length && isCateSupported;

  const productId = isTiscAdmin ? getProductVariant(spec) : productVariant;

  const openColorAI = () => {
    if (activeColorAI) {
      store.dispatch(openModal({ type: 'Color AI', title: 'COLOUR AI' }));
      return;
    }

    if (isTablet) {
      return;
    }

    if (!images.length) {
      message.info('Please upload at least one image');
      return;
    }

    if (!isCateSupported) {
      message.info('Please pick supported category');
    }
  };

  const setActiveColorAIIcon = () => {
    if (isTablet && activeColorAI) {
      return true;
    }

    if (activeColorAI) {
      return true;
    }

    return false;
  };

  return (
    <>
      <CustomCollapse
        showActiveBoxShadow
        defaultActiveKey={['1']}
        header={
          <div className="header-group">
            <BodyText level={4} customClass="brand-label">
              Brand
            </BodyText>
            <BodyText level={6} fontFamily="Roboto" customClass="brand-name">
              {brand?.name ?? 'N/A'}
            </BodyText>
            {brand?.logo ? <img src={showImageUrl(brand.logo)} /> : null}
          </div>
        }
        customHeaderClass={styles.productHeaderCollapse}
      >
        {/* Collection */}
        <InputGroup
          horizontal
          fontLevel={4}
          label="Collection"
          placeholder={editable ? 'create or assign from the list' : ''}
          rightIcon={
            <div className="flex-end">
              {/* Color detection */}
              {isTiscAdmin ? (
                <ColorDetectionIcon
                  className={setActiveColorAIIcon() ? styles.activeColorIcon : ''}
                  onClick={openColorAI}
                />
              ) : null}

              {/* Collection */}
              {editable ? (
                <RightLeftIcon
                  className={brand?.id ? 'mono-color' : 'mono-color-medium'}
                  onClick={() => setVisible(true)}
                  style={{ marginLeft: 14 }}
                />
              ) : null}
            </div>
          }
          noWrap
          value={collection?.name ?? ''}
          readOnly={editable === false}
          containerClass={!editable ? styles.viewInfo : ''}
        />

        {/* Product */}
        <InputGroup
          horizontal
          containerClass={!editable ? styles.viewInfo : ''}
          fontLevel={4}
          label="Product"
          placeholder={editable ? 'type max.100 characters short description' : ''}
          readOnly={editable === false}
          maxLength={100}
          noWrap
          value={name}
          onChange={(e) => {
            dispatch(
              setPartialProductDetail({
                name: e.target.value,
              }),
            );
          }}
        />
        {/* Product ID */}
        <InputGroup
          horizontal
          fontLevel={4}
          containerClass={`${styles.inputVariant} ${!editable ? styles.viewInfo : ''}`}
          label="Product ID"
          readOnly={true}
          noWrap
          value={productId}
          inputTitle={productId}
        />
        {/* Description */}
        <FormGroup
          label="Description"
          layout="horizontal"
          formClass="mb-16"
          labelFontSize={4}
          noColon
        >
          <CustomTextArea
            maxWords={50}
            placeholder={editable ? 'max.50 words of product summary' : ''}
            value={description}
            onChange={(e) => {
              dispatch(
                setPartialProductDetail({
                  description: e.target.value,
                }),
              );
            }}
            customClass={`${styles.customTextArea} ${editable ? '' : styles.viewInfo}`}
            readOnly={editable === false}
            autoResize
          />
        </FormGroup>
      </CustomCollapse>
      {editable && brand?.id ? (
        <CollectionModal
          brandId={brand.id}
          collectionType={CollectionRelationType.Brand}
          visible={visible}
          setVisible={setVisible}
          chosenValue={{
            value: collection?.id || '',
            label: collection?.name || '',
          }}
          setChosenValue={(selected) => {
            if (selected) {
              dispatch(
                setPartialProductDetail({
                  collection: {
                    name: String(selected.label),
                    id: String(selected.value),
                  },
                }),
              );
            }
          }}
        />
      ) : null}
    </>
  );
};
