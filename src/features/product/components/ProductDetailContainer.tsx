import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { MESSAGE_ERROR } from '@/constants/message';
import { PATH } from '@/constants/path';
import { USER_ROLE } from '@/constants/userRoles';
import { QUERY_KEY } from '@/constants/util';
import { Col, Row, message } from 'antd';
import { useHistory, useParams } from 'umi';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

import {
  createProductCard,
  getProductById,
  getRelatedCollectionProducts,
  updateProductCard,
} from '@/features/product/services';
import { getBrandById } from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { useGetQueryFromOriginURL, useGetUserRoleFromPathname, useQuery } from '@/helper/hook';
import { getValueByCondition, isValidURL, throttleAction } from '@/helper/utils';
import { pick, sortBy } from 'lodash';

import { ProductAttributeFormInput, ProductFormData, ProductKeyword } from '../types';
import { AutoStepOnAttributeGroupResponse } from '../types/autoStep';
import { ProductInfoTab } from './ProductAttributes/types';
import { ProductDimensionWeight } from '@/features/dimension-weight/types';
import {
  resetProductDetailState,
  setBrand,
  setPartialProductDetail,
} from '@/features/product/reducers';
import store, { useAppSelector } from '@/reducers';
import { ModalType } from '@/reducers/modal';

import { ResponsiveCol } from '@/components/Layout';
import { PublicHeader } from '@/components/PublicHeader';
import { TableHeader } from '@/components/Table/TableHeader';
import { RobotoBodyText } from '@/components/Typography';
import { LandingPageFooter } from '@/pages/LandingPage/footer';

import { ProductAttributeComponent } from './ProductAttributes';
import { ProductBasicInfo } from './ProductBasicInfo';
import { ProductDetailFooter } from './ProductDetailFooter';
import ProductDetailHeader from './ProductDetailHeader';
import ProductImagePreview from './ProductImagePreview';
import styles from './detail.less';
import Cookies from 'js-cookie';

const filterNewAttributeGroup = (
  data: ProductAttributeFormInput[],
  type: ProductInfoTab,
): ProductAttributeFormInput[] =>
  data.map((el: any) => {
    if (el.id.indexOf('new') !== -1) {
      if (type !== 'specification') {
        return {
          name: el?.name || '',
          attributes: el?.attributes || [],
          selection: !!el?.selection,
          steps: el?.steps ?? [],
        };
      }

      return {
        name: el?.name || '',
        attributes: el?.attributes || [],
        selection: !!el?.selection,
        steps: el?.steps ?? [],
        type: el.type,
      };
    }

    if (type !== 'specification') {
      delete el?.type;
      return el;
    }

    return el;
  });

const ProductDetailContainer: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const projectProductId = useGetQueryFromOriginURL(QUERY_KEY.project_product_id);

  const signature = useQuery().get('signature') || '';
  // set signature  to cookies
  Cookies.set('signature', signature);
  const isPublicPage = !!signature;

  const listMenuFooter: ModalType[] = ['About', 'Policies', 'Contact'];

  const params = useParams<{ id: string; brandId: string }>();
  const productId = params?.id || '';
  const brandId = params?.brandId || '';

  const currentUser = useGetUserRoleFromPathname();
  const isTiscUser = currentUser === USER_ROLE.tisc;
  const isBrandUser = currentUser === USER_ROLE.brand;
  const isDesignerUser = currentUser === USER_ROLE.design;

  const details = useAppSelector((state) => state.product.details);

  const [activeKey, setActiveKey] = useState<ProductInfoTab>(
    projectProductId ? 'specification' : 'general',
  );
  const [title, setTitle] = useState<string>('');
  const { labels } = useAppSelector((state) => state.label);
  const selectedSubLabels = useAppSelector((state) => state.product.details.label_ids);

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
      getProductById(productId, { isDetail: true });
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

  const onSave = () => {
    if (!details.categories?.length) {
      message.error('Please select category');
      return;
    }

    // if (!details.collections?.length) {
    //   message.error('Please select collection');
    //   return;
    // }

    // check urls is valid
    const haveInvaliDownloadURL = details.downloads.some(
      (content) => isValidURL(content.url) === false,
    );
    const haveInvaliCatelogueURL = details.catelogue_downloads?.some(
      (content) => isValidURL(content.url) === false,
    );
    if (haveInvaliDownloadURL || haveInvaliCatelogueURL) {
      message.error(MESSAGE_ERROR.URL_INVALID);
      return;
    }

    const productGeneralData = filterNewAttributeGroup(details.general_attribute_groups, 'feature');

    const productGeneralDataTitle = productGeneralData?.some((el) => !el.name);

    if (productGeneralDataTitle && productGeneralData?.length) {
      message.error('General attribute title is required');
      return;
    }

    const productFeatureData = filterNewAttributeGroup(details.feature_attribute_groups, 'feature');

    const productFeatureDataTitle = productFeatureData?.some((el) => !el.name);

    if (productFeatureDataTitle && productFeatureData?.length) {
      message.error('Feature attribute title is required');
      return;
    }

    const newProductSpecData = filterNewAttributeGroup(
      details.specification_attribute_groups,
      'specification',
    );

    const productSpecDataTitle = newProductSpecData.some((el) => !el.name);

    if (productSpecDataTitle && newProductSpecData?.length) {
      message.error('Specification attribute title is required');
      return;
    }

    const productSpecData: ProductAttributeFormInput[] = newProductSpecData.map((el) => ({
      ...el,
      attributes: el?.attributes ?? [],
      steps: !el?.steps?.length
        ? []
        : el.steps.map((step) => {
            const newStep = { ...step } as AutoStepOnAttributeGroupResponse;

            if (newStep?.id?.indexOf('new') !== -1) {
              delete (newStep as any).id;
            }

            const options = newStep.options.map((s) => ({
              id: s.id,
              pre_option: s.pre_option,
              replicate: s?.replicate ?? 0,
              picked: !!s.picked,
            }));

            return { name: step.name, order: step.order, options: options };
          }),
    }));

    const allSubLabels = labels.reduce((pre, cur: any) => {
      return pre.concat(cur.subs);
    }, []);

    const filteredSubLabels = selectedSubLabels?.filter((id) =>
      allSubLabels.find((item: any) => item.id === id),
    );

    const data: ProductFormData = {
      brand_id: brandId || details.brand?.id || '',
      category_ids: details.categories.map((category) => category.id),
      collection_ids: details.collections.map((collection) => collection.id),
      label_ids: filteredSubLabels,
      name: details.name.trim(),
      description: details.description.trim(),
      general_attribute_groups: productGeneralData,
      feature_attribute_groups: productFeatureData,
      specification_attribute_groups: productSpecData,
      dimension_and_weight: {
        with_diameter: details.dimension_and_weight.with_diameter,
        attributes: details.dimension_and_weight.attributes
          .filter((el) => (el.conversion_value_1 ? true : false))
          .map((el) => pick(el, 'id', 'conversion_value_1', 'conversion_value_2', 'with_diameter')),
      } as ProductDimensionWeight,
      product_information: details.product_information,
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
      ecoLabel: details.ecoLabel,
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

  const query = useQuery();

  const noPreviousPage = query.get(QUERY_KEY.no_previous_page);
  const newTabFromRequest = query.get(QUERY_KEY.new_tab_from_request);

  const handleCloseProductDetail = () => {
    if (newTabFromRequest) {
      pushTo(PATH.brandHomePage);
      return;
    }

    if (!noPreviousPage) {
      history.goBack();
      return;
    }

    pushTo(
      getValueByCondition(
        [
          [isTiscUser, PATH.tiscHomePage],
          [isBrandUser, PATH.brandProduct],
          [isDesignerUser, PATH.designerBrandProduct],
        ],
        '',
      ),
    );
  };

  const renderHeader = () => {
    if (isTiscUser) {
      const categoriesSelected = sortBy(details.categories, 'name')
        .slice(0, 3)
        .map((category) => category);

      const renderCateLabel = (): any => {
        if (!categoriesSelected.length) {
          return (
            <RobotoBodyText level={4} color="mono-color-medium" style={{ textTransform: 'none' }}>
              select
            </RobotoBodyText>
          );
        }

        return (
          <div className="flex-center">
            {categoriesSelected.map((cate, index) => (
              <div key={cate.id || index} className="flex-center" style={{ marginRight: 8 }}>
                <RobotoBodyText level={6}>{cate.name}</RobotoBodyText>
                <DeleteIcon
                  className={styles.deleteIcon}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    store.dispatch(
                      setPartialProductDetail({
                        categories: details.categories.filter(
                          (cateChosen) => cateChosen.id !== cate.id,
                        ),
                      }),
                    );
                  }}
                />
              </div>
            ))}
            {details.categories.length > 3 ? (
              <div title={details.categories.map((cate) => cate.name).join(', ')}>...</div>
            ) : null}
          </div>
        );
      };

      return (
        <ProductDetailHeader
          title={'CATEGORY'}
          label={renderCateLabel()}
          onSave={throttleAction(onSave)}
          onCancel={handleCloseProductDetail}
          customClass={`${styles.marginBottomSpace} ${
            categoriesSelected.length ? styles.monoColor : ''
          }`}
        />
      );
    }
    if (isPublicPage) {
      return <PublicHeader />;
    }

    return (
      <TableHeader
        title={title}
        customClass={styles.marginBottomSpace}
        rightAction={<CloseIcon className="closeIcon" onClick={handleCloseProductDetail} />}
      />
    );
  };

  return (
    <Row className={styles.container}>
      <div className={styles.backgroundLight}>
        <Col span={24}>{renderHeader()}</Col>

        <Col span={24} style={{ margin: isPublicPage ? '0 24px' : '' }}>
          <Row className={isPublicPage ? styles.marginRounded : ''} gutter={[8, 8]}>
            <ResponsiveCol>
              <ProductImagePreview />
            </ResponsiveCol>

            <ResponsiveCol className={styles.productContent}>
              <Row style={{ flexDirection: 'column', height: '100%' }}>
                <Col>
                  <ProductBasicInfo />
                </Col>

                <Col style={{ marginBottom: activeKey !== 'vendor' ? 24 : 0 }}>
                  <ProductAttributeComponent activeKey={activeKey} setActiveKey={setActiveKey} />
                </Col>

                <Col style={{ marginTop: 'auto' }}>
                  <ProductDetailFooter infoTab={activeKey} />
                </Col>
              </Row>
            </ResponsiveCol>
          </Row>
        </Col>
      </div>

      {isPublicPage ? (
        <Col span={24} className={styles.footerContent}>
          <LandingPageFooter listMenuFooter={listMenuFooter} />
        </Col>
      ) : null}
    </Row>
  );
};

export default ProductDetailContainer;
