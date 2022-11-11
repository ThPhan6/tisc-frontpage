import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { Col, Row, message } from 'antd';
import { useHistory, useParams } from 'umi';

import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';
import { ReactComponent as HomeButton } from '@/assets/icons/home-icon.svg';
import { ReactComponent as LogoBeta } from '@/assets/icons/logo-beta.svg';

import {
  createProductCard,
  getProductById,
  getRelatedCollectionProducts,
  updateProductCard,
} from '@/features/product/services';
import { getBrandById } from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { useCheckPermission, useQuery } from '@/helper/hook';
import { isValidURL } from '@/helper/utils';

import { ProductFormData, ProductKeyword } from '../types';
import { ProductInfoTab } from './ProductAttributes/types';
import { resetProductDetailState, setBrand } from '@/features/product/reducers';
import { ModalOpen } from '@/pages/LandingPage/types';
import { useAppSelector } from '@/reducers';

import CustomButton from '@/components/Button';
import { TableHeader } from '@/components/Table/TableHeader';
import { RobotoBodyText } from '@/components/Typography';
import { AboutPoliciesContactModal } from '@/pages/LandingPage/AboutPolicesContactModal';
import { LandingPageFooter } from '@/pages/LandingPage/footer';

import { ProductAttributeComponent } from './ProductAttributes';
import { ProductBasicInfo } from './ProductBasicInfo';
import { ProductDetailFooter } from './ProductDetailFooter';
import ProductDetailHeader from './ProductDetailHeader';
import ProductImagePreview from './ProductImagePreview';
import styles from './detail.less';
import Cookies from 'js-cookie';

const ProductDetailContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const signature = useQuery().get('signature') || '';
  // set signature  to cookies
  Cookies.set('signature', signature);
  const isPublicPage = signature ? true : false;

  const listMenuFooter: ModalOpen[] = ['About', 'Policies', 'Contact'];
  const [openModal, setOpenModal] = useState<ModalOpen>('');

  const params = useParams<{ id: string; brandId: string }>();
  const productId = params?.id || '';
  const brandId = params?.brandId || '';

  const isTiscAdmin = useCheckPermission('TISC Admin');

  const details = useAppSelector((state) => state.product.details);

  const [activeKey, setActiveKey] = useState<ProductInfoTab>('general');
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    if (brandId) {
      getBrandById(brandId).then((res) => dispatch(setBrand(res)));
    }
    return () => {
      dispatch(resetProductDetailState());
    };
  }, [brandId]);

  useEffect(() => {
    if (productId) {
      getProductById(productId);
    }
  }, [productId]);

  useEffect(() => {
    if (details.brand) {
      // load brand information
      dispatch(setBrand(details.brand));
      /// get product name
      setTitle(details?.name);
    }
    if (details.id) {
      /// load product related
      getRelatedCollectionProducts(details.id);
    }
  }, [details.id, details.brand]);

  const handleCloseModal = () => {
    setOpenModal('');
  };

  const onSave = () => {
    // check urls is valid
    const haveInvaliDownloadURL = details.downloads.some(
      (content) => isValidURL(content.url) === false,
    );
    const haveInvaliCatelogueURL = details.catelogue_downloads.some(
      (content) => isValidURL(content.url) === false,
    );
    if (haveInvaliDownloadURL || haveInvaliCatelogueURL) {
      message.error(MESSAGE_ERROR.URL_INVALID);
      return;
    }

    const data: ProductFormData = {
      brand_id: brandId || details.brand?.id || '',
      category_ids: details.categories.map((category) => category.id),
      collection_id: details.collection?.id || '',
      name: details.name.trim(),
      description: details.description.trim(),
      general_attribute_groups: details.general_attribute_groups,
      feature_attribute_groups: details.feature_attribute_groups,
      dimension_and_weight: details.dimension_and_weight,
      specification_attribute_groups: details.specification_attribute_groups,
      keywords: details.keywords.map((keyword) => keyword.trim()) as ProductKeyword,
      images: details.images.map((image) => {
        if (image.indexOf('data:image') > -1) {
          return image.split(',')[1];
        }
        return image;
      }),
      tips: details.tips,
      downloads: details.downloads,
      catelogue_downloads: details.catelogue_downloads,
    };

    if (productId) {
      updateProductCard(productId, data);
      return;
    }

    createProductCard(data).then((productDetail) => {
      if (productDetail) {
        /// push to product update, 100% have product detail id
        history.replace(PATH.productConfigurationUpdate.replace(':id', productDetail.id ?? ''));
      }
    });
  };

  // if (!details.id) {
  //   return null;
  // }

  const renderHeader = () => {
    if (isTiscAdmin) {
      return (
        <ProductDetailHeader
          title={'CATEGORY'}
          onSave={onSave}
          onCancel={history.goBack}
          customClass={styles.marginBottomSpace}
        />
      );
    }

    if (isPublicPage) {
      return (
        <div className={styles.header}>
          <LogoBeta />
          <RobotoBodyText level={5} customClass={styles.text}>
            You are viewing product page without account log in, please use Home button to direct
            back to main page for sign up/log in.
          </RobotoBodyText>
          <CustomButton
            icon={<HomeButton />}
            width="104px"
            buttonClass={styles.homeButton}
            onClick={() => pushTo(PATH.landingPage)}>
            Home
          </CustomButton>
        </div>
      );
    }

    return (
      <TableHeader
        title={title}
        customClass={styles.marginBottomSpace}
        rightAction={<CloseIcon className="closeIcon" onClick={history.goBack} />}
      />
    );
  };

  return (
    <Row className={styles.container}>
      <div className={styles.backgroundLight}>
        <Col span={24}>{renderHeader()}</Col>

        <Col span={24}>
          <Row className={isPublicPage ? styles.marginRounded : ''}>
            <Col span={12}>
              <ProductImagePreview isPublicPage={isPublicPage} />
            </Col>

            <Col span={12} className={styles.productContent}>
              <Row style={{ flexDirection: 'column', height: '100%' }}>
                <Col>
                  <ProductBasicInfo />
                </Col>

                <Col style={{ marginBottom: activeKey !== 'vendor' ? 24 : 0 }}>
                  <ProductAttributeComponent activeKey={activeKey} setActiveKey={setActiveKey} />
                </Col>

                <Col style={{ marginTop: 'auto' }}>
                  <ProductDetailFooter visible={activeKey !== 'vendor'} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </div>

      {isPublicPage ? (
        <Col span={24} className={styles.footerContent}>
          <LandingPageFooter
            setOpenModal={setOpenModal}
            listMenuFooter={listMenuFooter}
            isPublicPage
          />

          <AboutPoliciesContactModal visible={openModal} onClose={handleCloseModal} />
        </Col>
      ) : null}
    </Row>
  );
};

export default ProductDetailContainer;
