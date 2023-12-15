import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { message } from 'antd';

import { ReactComponent as RightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';
import { ReactComponent as ColorDetectionIcon } from '@/assets/icons/color-palette.svg';

import { getAllProductCategory } from '@/features/categories/services';
import { useScreen } from '@/helper/common';
import { useCheckPermission } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { isEmpty } from 'lodash';

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

import { MultiCollectionModal } from '../modals/MultiCollectionModal';
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
  /// brand and designer
  const productVariant = useAppSelector(productVariantsSelector);

  const {
    name,
    description,
    collections,
    categories,
    specification_attribute_groups: spec,
  } = useAppSelector((state) => state.product.details);

  const collectionValue = collections?.length ? collections.map((el) => el.name).join(', ') : '';

  const [visible, setVisible] = useState(false);

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

    const categoryIds = categories?.map((el) => el.id);

    /// category supported contains its main or sub or itself's wood/stone
    categoryData.forEach((mainCate) => {
      mainCate.subs.forEach((subCate) => {
        subCate.subs.forEach((item) => {
          if (categoryIds.includes(item.id)) {
            if (
              ''
                .concat(mainCate?.name ?? '', subCate?.name ?? '', item?.name ?? '')
                .toLowerCase()
                .includes(SupportCategories.wood) ||
              ''
                .concat(mainCate?.name ?? '', subCate?.name ?? '', item?.name ?? '')
                .toLowerCase()
                .includes(SupportCategories.stone)
            ) {
              cateSupported = true;
            }
          }
        });
      });
    });

    setIsCateSupported(cateSupported);
  }, [categories]);

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
          inputClass="text-overflow"
          placeholder={editable ? 'create or assign from the list' : ''}
          rightIcon={
            <div className="flex-end">
              {/* Color detection */}
              {isTiscAdmin ? (
                <ColorDetectionIcon
                  className={setActiveColorAIIcon() ? styles.activeColorIcon : ''}
                  onClick={openColorAI}
                  style={{ marginLeft: 14 }}
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
          inputTitle={collectionValue}
          value={collectionValue}
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
        {/* Description */}
        <FormGroup
          label="Description"
          layout="horizontal"
          // formClass="mb-16"
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
        {/* Product ID */}
        <div className="mb-4">
          <InputGroup
            horizontal
            fontLevel={4}
            containerClass={`${styles.inputVariant} ${!editable ? styles.viewInfo : ''}`}
            label="Selection ID"
            readOnly={true}
            noWrap
            value={productId}
            inputTitle={productId}
          />
        </div>
      </CustomCollapse>
      {editable && brand?.id ? (
        <MultiCollectionModal
          brandId={brand.id}
          collectionType={CollectionRelationType.Brand}
          categoryIds={categories?.map((el) => el.id)}
          isCateSupported={activeColorAI}
          visible={visible}
          setVisible={setVisible}
          chosenValue={collections?.map((el) => ({
            value: el?.id || '',
            label: el?.name || '',
          }))}
          setChosenValue={(selected) => {
            dispatch(
              setPartialProductDetail({
                collections: selected.map((el) => ({
                  name: String(el.label),
                  id: String(el.value),
                })),
              }),
            );
          }}
        />
      ) : null}
    </>
  );
};
