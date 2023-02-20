import React, { useState } from 'react';

import { PATH } from '@/constants/path';
import { Col, Row, message } from 'antd';
import { useHistory } from 'umi';

import { useGetOneCustomProduct } from './hook';
import { createCustomProduct, updateCustomProduct } from './services';
import { formatImageIfBase64, throttleAction } from '@/helper/utils';

import {
  CustomProductRequestBody,
  NameContentProps,
  ProductInfoTab,
  ProductOptionProps,
} from './types';
import { useAppSelector } from '@/reducers';

import { SpecificationTab } from './components/SpecificationTab';
import { SummaryTab } from './components/SummaryTab';
import { ResponsiveCol } from '@/components/Layout';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';
import ProductDetailHeader from '@/features/product/components/ProductDetailHeader';
import ProductImagePreview from '@/features/product/components/ProductImagePreview';

import styles from './ProductLibraryDetail.less';
import { invalidCustomProductSelector } from './slice';

const LIST_TAB = [
  { tab: 'SUMMARY', key: 'summary' },
  { tab: 'SPECIFICATION', key: 'specification' },
];

const ProductLibraryUpdate: React.FC = () => {
  const history = useHistory();

  const [activeKey, setActiveKey] = useState<ProductInfoTab>('summary');
  const productData = useAppSelector((state) => state.customProduct.details);

  const { productId, specOptionData, setSpecOptionData } = useGetOneCustomProduct();

  const { invalidAttributes } = useAppSelector(invalidCustomProductSelector);

  const onSave = async () => {
    /// filter option data and delete its field type
    const productOptions: ProductOptionProps[] =
      (await specOptionData
        ?.filter((el) => el.type === 'option')
        .map(({ type, isCollapse, ...el }) => {
          if (el.id && !isNaN(Number(el.id))) {
            return {
              items: el.items,
              sequence: el.sequence,
              tag: el.tag,
              title: el.title,
              use_image: el.use_image,
            };
          }

          return el;
        })) || [];

    const invalidOptions =
      productOptions.length > 0 && productOptions.some((el) => !el.title || el.items.length === 0);

    /// filter specification data and delete its field type
    const productSpecificationData: NameContentProps[] =
      (await specOptionData
        ?.filter((el) => el.type === 'specification')
        .map(({ type, isCollapse, id, ...el }) => el)) || [];

    const invalidSpecifications =
      productSpecificationData.length > 0 &&
      productSpecificationData.some((el) => !el.content || !el.name);

    switch (true) {
      case !productData.company.name:
        message.error('Company is required');
        return;
      case !productData.collection.name:
        message.error('Collection is required');
        return;
      case !productData.name:
        message.error('Product name is required');
        return;
      case !productData.description:
        message.error('Description is required');
        return;
      case productData.images.length < 1:
        message.error('Required at least one image');
        return;
      case productData.images.length > 4:
        message.error('Maximum 4 images are allowed');
        return;
      case invalidAttributes:
        message.error('Product attribute is missing');
        return;
      case invalidOptions:
        message.error('Product option is missing');
        return;
      case invalidSpecifications:
        message.error('Product specification is missing');
        return;
    }

    const productOptionData: ProductOptionProps[] = await productOptions.map((el) => ({
      ...el,
      id: el.id || undefined,
      items: el.items.map((item) => ({
        ...item,
        id: item.id || undefined,
        image: el.use_image && item.image ? formatImageIfBase64(item.image) : undefined,
      })),
    }));

    const data: CustomProductRequestBody = {
      company_id: productData.company.id,
      collection_id: productData.collection.id,
      name: productData.name,
      dimension_and_weight: productData.dimension_and_weight,
      description: productData.description.trim(),
      attributes: productData.attributes,
      specifications: productSpecificationData,
      options: productOptionData,
      images: productData.images?.map((image) => formatImageIfBase64(image)),
    };

    if (productId) {
      updateCustomProduct(productId, data);
    } else {
      createCustomProduct(data).then((res) => {
        if (res) {
          history.replace(PATH.designerCustomProductUpdate.replace(':id', res.id));
        }
      });
    }
  };

  return (
    <Row className={styles.container}>
      <Col span={24}>
        <ProductDetailHeader
          title={productId && productData ? productData.name : 'Entry the product info below'}
          onSave={throttleAction(onSave)}
          onCancel={history.goBack}
          hideSelect
          customClass={`${styles.marginBottomSpace} ${
            productId && productData.name ? '' : styles.colorLight
          }`}
        />
      </Col>

      <Col span={24}>
        <Row gutter={[8, 8]}>
          <ResponsiveCol>
            <ProductImagePreview
              hideInquiryRequest
              isCustomProduct
              disabledAssignProduct
              disabledShareViaEmail
            />
          </ResponsiveCol>

          <ResponsiveCol className={styles.productContent}>
            <Row style={{ flexDirection: 'column', height: '100%' }}>
              <Col>
                <CustomTabs
                  listTab={LIST_TAB}
                  activeKey={activeKey}
                  centered={true}
                  tabPosition="top"
                  tabDisplay="space"
                  customClass={styles.listTab}
                  onChange={(key) => setActiveKey(key as ProductInfoTab)}
                />

                <CustomTabPane active={activeKey === 'summary'}>
                  <SummaryTab />
                </CustomTabPane>

                <CustomTabPane active={activeKey === 'specification'}>
                  <SpecificationTab
                    productId={productId}
                    activeKey="specification"
                    specOptionData={specOptionData}
                    setSpecOptionData={setSpecOptionData}
                  />
                </CustomTabPane>
              </Col>
            </Row>
          </ResponsiveCol>
        </Row>
      </Col>
    </Row>
  );
};

export default ProductLibraryUpdate;
