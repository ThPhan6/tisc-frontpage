import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { DEFAULT_ECO_LABELS, DEFAULT_PRODUCTION_LABELS } from '../constants';
import { Row, message } from 'antd';

import { ReactComponent as RightLeftIcon } from '@/assets/icons/action-right-left-icon.svg';
import { ReactComponent as ColorDetectionIcon } from '@/assets/icons/color-palette.svg';

import { getAllProductCategory } from '@/features/categories/services';
import { useScreen } from '@/helper/common';
import { useCheckPermission } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { cloneDeep, isEmpty } from 'lodash';

import { FeatureLabelPros, ProductAttributeFormInput } from '../types';
import { SupportCategories } from '@/features/colorDetection/types';
import { productVariantsSelector, setPartialProductDetail } from '@/features/product/reducers';
import store, { useAppSelector } from '@/reducers';
import { openModal } from '@/reducers/modal';
import { CollectionRelationType } from '@/types';

import CustomCollapse from '@/components/Collapse';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { ResponsiveCol } from '@/components/Layout';
import { BodyText } from '@/components/Typography';

import { CollectionAndLabelModal } from '../modals/CollectionAndLabel';
import { ProductLabelSwitch } from './ProductLabelSwitch';
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

export const mapLabelProduct = (
  defaultLabel: FeatureLabelPros,
  currentLabel: FeatureLabelPros,
): FeatureLabelPros => {
  const newLabel = cloneDeep(defaultLabel);
  const featureKeys = Object.keys(currentLabel);
  featureKeys.forEach((key) => {
    newLabel[key].value = currentLabel[key].value;
  });
  return newLabel;
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
    id,
    name,
    description,
    collections,
    labels,
    categories,
    ecoLabel,
    specification_attribute_groups: spec,
  } = useAppSelector((state) => state.product.details);

  const collectionValue = collections?.length ? collections.map((el) => el.name).join(', ') : '';

  const [visible, setVisible] = useState(false);

  const categoryData = useAppSelector((state) => state.category.list);
  const [isCateSupported, setIsCateSupported] = useState<boolean>();
  const [ecoLabels, setEcoLabels] = useState<FeatureLabelPros>(DEFAULT_ECO_LABELS);
  const [prodLabels, setProdLabels] = useState<FeatureLabelPros>(DEFAULT_PRODUCTION_LABELS);

  const getCategoryData = async () => {
    await getAllProductCategory();
  };

  const handleSwitch = (newData: FeatureLabelPros) => {
    setEcoLabels(newData);
    dispatch(
      setPartialProductDetail({
        ecoLabel: newData,
      }),
    );
  };

  useEffect(() => {
    getCategoryData();
    const newEcoLabels = ecoLabel ? mapLabelProduct(ecoLabels, ecoLabel) : ecoLabels;
    setEcoLabels(newEcoLabels);
  }, []);

  useEffect(() => {
    if (!ecoLabel) return;
    setEcoLabels(mapLabelProduct(ecoLabels, ecoLabel));
  }, [ecoLabel]);

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
        nestedCollapse={true}
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
          inputTitle={collectionValue ? collectionValue : id ? 'X Collection' : ''}
          value={collectionValue ? collectionValue : id ? 'X Collection' : ''}
          readOnly={editable === false}
          containerClass={!editable ? styles.viewInfo : ''}
        />

        {/* Product */}
        <InputGroup
          horizontal
          containerClass={!editable ? styles.viewInfo : ''}
          fontLevel={4}
          label="Product"
          placeholder={editable ? 'type max.64 characters short description' : ''}
          readOnly={editable === false}
          maxLength={64}
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
          labelWidth={75}
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
        <hr
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            margin: 0,
            borderTop: 0,
            borderBottom: '1px solid #cdcdcd',
          }}
        />
        {/* Label featuring */}
        {isTiscAdmin && (
          <div className={styles.labelContainer} style={{ paddingBottom: 6, paddingTop: 8 }}>
            <Row className={styles.labelRow}>
              <ResponsiveCol className={`${styles.labelCol} ${styles.firstCol}`}>
                <CustomCollapse
                  header={<BodyText level={4}>Production-Labels</BodyText>}
                  customHeaderClass={`${styles.labelCollapse} ${styles.prodLabel}`}
                  bordered={false}
                  noBorder={true}
                >
                  <ProductLabelSwitch data={prodLabels} editable={editable} />
                </CustomCollapse>
              </ResponsiveCol>
              <ResponsiveCol className={styles.labelCol}>
                <CustomCollapse
                  header={<BodyText level={4}>Eco-Labels</BodyText>}
                  customHeaderClass={`${styles.labelCollapse} ${styles.ecoLabel}`}
                  bordered={false}
                  noBorder={true}
                >
                  <ProductLabelSwitch data={ecoLabels} onClick={handleSwitch} editable={editable} />
                </CustomCollapse>
              </ResponsiveCol>
            </Row>
          </div>
        )}
        {/* Product ID */}
        <div style={{ paddingBottom: 6, paddingTop: 8 }}>
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
        <CollectionAndLabelModal
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
          chosenLabel={labels?.map((el) => ({
            value: el?.id || '',
            label: el?.name || '',
          }))}
          setChosenLabel={(selected) => {
            dispatch(
              setPartialProductDetail({
                labels: selected.map((el) => ({
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
