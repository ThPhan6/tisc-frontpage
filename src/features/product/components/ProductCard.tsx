import React, { useState } from 'react';

import { Tooltip, TooltipProps } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as LikedIcon } from '@/assets/icons/action-liked-icon.svg';
import { ReactComponent as AssignIcon } from '@/assets/icons/ic-assign.svg';
import { ReactComponent as CommentIcon } from '@/assets/icons/ic-comment.svg';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';
import { ReactComponent as ShareIcon } from '@/assets/icons/ic-share.svg';
import { ReactComponent as TabIcon } from '@/assets/icons/tabs-icon.svg';
import SampleProductImage from '@/assets/images/sample-product-img.png';

import {
  deleteProductById,
  duplicateProductById,
  getProductListByBrandId,
  getProductSummary,
  likeProductById,
} from '@/features/product/services';
import { confirmDelete } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useBoolean, useCheckPermission, useGetUserRoleFromPathname } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { capitalize, truncate } from 'lodash';

import { ProductGetListParameter, ProductItem } from '../types';
import { ProductConsiderStatus } from '@/features/project/types';
import { useAppSelector } from '@/reducers';

import CustomCollapse from '@/components/Collapse';
import InquiryRequest from '@/components/InquiryRequest';
import ShareViaEmail from '@/components/ShareViaEmail';
import { ActionMenu } from '@/components/TableAction';
import { BodyText } from '@/components/Typography';

import AssignProductModal from '../modals/AssignProductModal';
import { getProductDetailPathname } from '../utils';
import styles from './ProductCard.less';

interface CollapseProductListProps {
  showBrandLogo?: boolean;
  showActionMenu?: boolean;
  showInquiryRequest?: boolean;
  hideFavorite?: boolean;
}

interface ProductCardProps extends Omit<CollapseProductListProps, 'showBrandLogo'> {
  product: ProductItem;
  hasBorder?: boolean;
  hideFavorite?: boolean;
  hideAssign?: boolean;
  showSpecify?: boolean;
  onSpecifyClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  hasBorder,
  hideFavorite,
  hideAssign,
  showInquiryRequest,
  showSpecify,
  showActionMenu,
  onSpecifyClick,
}) => {
  const filter = useAppSelector((state) => state.product.list.filter);

  const [liked, setLiked] = useState(product.is_liked);
  const showShareEmailModal = useBoolean();
  const showAssignProductModal = useBoolean();
  const showInquiryRequestModal = useBoolean();

  const unlistedDisabled =
    product.specifiedDetail?.consider_status === ProductConsiderStatus.Unlisted;

  // check user role to redirect
  const userRole = useGetUserRoleFromPathname();
  const hanldeRedirectURL = () => {
    const path = getProductDetailPathname(userRole, product.id);
    pushTo(path);
  };

  // check user permission to action
  const showShareEmail = useCheckPermission(['Brand Admin', 'Design Admin']);
  const isTiscAdmin = useCheckPermission('TISC Admin');
  const isDesignerUser = useCheckPermission('Design Admin');

  const [likeCount, setLikeCount] = useState(product.favorites ?? 0);
  const likeProduct = () => {
    likeProductById(product.id ?? '').then((isSuccess) => {
      if (isSuccess) {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount(likeCount + (newLiked ? 1 : -1));
      }
    });
  };

  const reloadProductInformation = () => {
    if (filter && product.brand?.id) {
      getProductSummary(product.brand.id).then(() => {
        const params = {
          brand_id: product.brand?.id,
        } as ProductGetListParameter;
        if (filter.name === 'category_id') {
          params.category_id = filter.value === 'all' ? 'all' : filter.value;
        }
        if (filter.name === 'collection_id') {
          params.collection_id = filter.value === 'all' ? 'all' : filter.value;
        }
        getProductListByBrandId(params);
      });
    }
  };

  const handleDeleteProduct = () => {
    confirmDelete(() => {
      deleteProductById(product.id ?? '').then((isSuccess) => {
        if (isSuccess && filter && product.brand && product.brand.id) {
          reloadProductInformation();
        }
      });
    });
  };

  const duplicateProduct = () => {
    duplicateProductById(product.id ?? '').then((isSuccess) => {
      if (isSuccess) {
        reloadProductInformation();
      }
    });
  };

  const tooltipProps: Partial<TooltipProps> = { align: { offset: [0, 0] }, placement: 'bottom' };

  const rightActions: {
    tooltipText: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
    show: boolean;
  }[] = [
    {
      tooltipText: 'Duplicate',
      show: isTiscAdmin,
      Icon: TabIcon,
      onClick: duplicateProduct,
    },
    {
      tooltipText: 'Delete',
      show: isTiscAdmin,
      Icon: DeleteIcon,
      onClick: handleDeleteProduct,
    },
    {
      tooltipText: 'Inquiry/Request',
      show: Boolean(showInquiryRequest && isDesignerUser),
      Icon: CommentIcon,
      onClick: () => showInquiryRequestModal.setValue(true),
    },
    {
      tooltipText: 'Assign Product',
      show: isDesignerUser && !hideAssign,
      Icon: AssignIcon,
      onClick: () => showAssignProductModal.setValue(true),
    },
    {
      tooltipText: 'Share via Email',
      show: showShareEmail,
      Icon: ShareIcon,
      onClick: () => showShareEmailModal.setValue(true),
    },
  ];

  return (
    <div
      className={`${styles.productCardItem} ${hasBorder ? styles.border : ''} ${
        unlistedDisabled ? styles.disabled : ''
      }`}>
      <div className={styles.imageWrapper} onClick={hanldeRedirectURL}>
        <div
          style={{
            backgroundImage: `url(${
              product.images?.[0] ? showImageUrl(product.images?.[0]) : SampleProductImage
            }`,
          }}
          className={styles.imageWrapper_image}
        />
        <div className={styles.imagePlaceholder}>
          <BodyText level={5} fontFamily="Roboto">
            {product.description}
          </BodyText>
        </div>
      </div>
      <div className={styles.productInfo} onClick={hanldeRedirectURL}>
        <BodyText level={6} fontFamily="Roboto" customClass="product-description">
          {product.name}
        </BodyText>
        <BodyText level={7} fontFamily="Roboto" customClass="text-uppercase">
          {product.brand?.name ?? 'N/A'}
        </BodyText>
      </div>
      <div className={styles.productAction}>
        <div className={`${styles.leftAction} flex-center`}>
          {hideFavorite ? null : (
            <Tooltip title="Favourite" {...tooltipProps}>
              <BodyText level={6} fontFamily="Roboto" customClass="action-like">
                {liked ? <LikedIcon onClick={likeProduct} /> : <LikeIcon onClick={likeProduct} />}
                {`${likeCount.toLocaleString('en-us')} ${likeCount <= 1 ? 'like' : 'likes'}`}
              </BodyText>
            </Tooltip>
          )}
          {showSpecify && isDesignerUser ? (
            <Tooltip title={'Specify'} {...tooltipProps}>
              <DispatchIcon
                onClick={unlistedDisabled ? undefined : onSpecifyClick}
                className={unlistedDisabled ? styles.unlistedDisabled : ''}
              />
            </Tooltip>
          ) : null}
          {showActionMenu && isDesignerUser ? (
            <ActionMenu
              placement="bottomLeft"
              offsetAlign={[-12, -6]}
              actionItems={[
                {
                  type: 'copy',
                  label: 'Copy',
                  onClick: () => {},
                },
                {
                  type: 'updated',
                  label: 'Edit',
                  onClick: () => {},
                },
                {
                  type: 'deleted',
                  label: 'Delete',
                  onClick: () => {},
                },
              ]}
            />
          ) : null}
        </div>

        <div className={`${styles.rightAction} flex-center`}>
          {rightActions.map(({ Icon, onClick, show, tooltipText }, index) =>
            show ? (
              <Tooltip key={index} title={tooltipText} {...tooltipProps}>
                <Icon onClick={onClick} />
              </Tooltip>
            ) : null,
          )}
        </div>
      </div>

      {showShareEmailModal.value ? (
        <ShareViaEmail
          visible={showShareEmailModal.value}
          setVisible={showShareEmailModal.setValue}
          product={product}
        />
      ) : null}

      {showAssignProductModal.value && product.id ? (
        <AssignProductModal
          visible={showAssignProductModal.value}
          setVisible={showAssignProductModal.setValue}
          productId={product.id}
        />
      ) : null}

      {showInquiryRequestModal.value ? (
        <InquiryRequest
          visible={showInquiryRequestModal.value}
          setVisible={showInquiryRequestModal.setValue}
          product={product}
        />
      ) : null}
    </div>
  );
};

export default ProductCard;

export const CollapseProductList: React.FC<CollapseProductListProps> = ({
  showBrandLogo,
  showActionMenu = false,
  showInquiryRequest = false,
  hideFavorite = false,
}) => {
  const list = useAppSelector((state) => state.product.list);

  // if (!product.list.data.length) {
  //   return <EmptyDataMessage message={EMPTY_DATA_MESSAGE.product} />;
  // }

  return (
    <>
      {list.data.map((group, index) => (
        <CustomCollapse
          className={styles.productCardCollapse}
          customHeaderClass={styles.productCardHeaderCollapse}
          key={index}
          collapsible={group.count === 0 ? 'disabled' : undefined}
          header={
            <div className="header-text">
              <BodyText level={5} fontFamily="Roboto">
                {showBrandLogo ? <img src={showImageUrl(group.brand_logo)} /> : null}

                {truncate(capitalize(group.name), { length: 40 })}
                <span className="product-count">({group.count})</span>
              </BodyText>
            </div>
          }>
          <div className={styles.productCardContainer}>
            {group.products.map((productItem, productKey) => (
              <div className={styles.productCardItemWrapper} key={productKey}>
                <ProductCard
                  product={productItem}
                  showInquiryRequest={showInquiryRequest}
                  showActionMenu={showActionMenu}
                  hideFavorite={hideFavorite}
                />
              </div>
            ))}
          </div>
        </CustomCollapse>
      ))}
    </>
  );
};
