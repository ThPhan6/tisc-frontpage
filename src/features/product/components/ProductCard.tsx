import React, { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { USER_ROLE } from '@/constants/userRoles';
import { Tooltip, TooltipProps, message } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as LikedIcon } from '@/assets/icons/action-liked-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
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
import { confirmDelete, useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import { useCheckPermission, useGetUserRoleFromPathname } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import {
  deleteCustomProduct,
  duplicateCustomProduct,
  getCustomProductList,
} from '@/pages/Designer/Products/CustomLibrary/services';
import { getCollections, updateCollection } from '@/services';
import { capitalize, truncate } from 'lodash';

import { setProductList } from '../reducers';
import { GroupProductList, ProductGetListParameter, ProductItem } from '../types';
import { ProductConsiderStatus } from '@/features/project/types';
import store, { useAppSelector } from '@/reducers';
import { openModal } from '@/reducers/modal';
import { CollectionRelationType } from '@/types';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import { ActiveOneCustomCollapse } from '@/components/Collapse';
import { EmptyOne } from '@/components/Empty';
import { CustomInput } from '@/components/Form/CustomInput';
import { loadingSelector } from '@/components/LoadingPage/slices';
import { ActionMenu } from '@/components/TableAction';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import { assignProductModalTitle } from '../modals/AssignProductModal';
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
  isCustomProduct?: boolean;
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
  isCustomProduct,
  onSpecifyClick,
}) => {
  const { isTablet } = useScreen();
  const normalProductfilter = useAppSelector((state) => state.product.list.filter);
  const [liked, setLiked] = useState(product.is_liked);

  // custom product
  const customProductFilter = useAppSelector((state) => state.customProduct.filter);

  const filter = isCustomProduct ? customProductFilter : normalProductfilter;

  const unlistedDisabled =
    product.specifiedDetail?.consider_status === ProductConsiderStatus.Unlisted;

  // check user role to redirect
  const userRole = useGetUserRoleFromPathname();
  const isDesignFirmUser = userRole === USER_ROLE.design;
  const hanldeRedirectURL = () => {
    const path = getProductDetailPathname(userRole, product.id, '', isCustomProduct);
    pushTo(path);
  };

  // check user permission to action
  const showShareEmail = useCheckPermission([
    'Brand Admin',
    'Design Admin',
    'Brand Team',
    'Design Team',
  ]);
  const isTiscAdmin = useCheckPermission(['TISC Admin', 'Consultant Team']);

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
    if (isCustomProduct) {
      const filterBy =
        !filter || filter?.value === 'all'
          ? undefined
          : {
              company_id: filter.name === 'company_id' ? filter?.value : undefined,
              collection_id: filter.name === 'collection_id' ? filter.value : undefined,
            };

      getCustomProductList(filterBy);

      return;
    }

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

  const handleDeleteCustomProduct = () => {
    confirmDelete(() => {
      deleteCustomProduct(product.id ?? '').then((isSccess) => {
        if (isSccess) {
          reloadProductInformation();
        }
      });
    });
  };

  const handleCopyCustomProduct = () => {
    duplicateCustomProduct(product.id ?? '').then((isSuccuess) => {
      if (isSuccuess) {
        reloadProductInformation();
      }
    });
  };

  const tooltipProps: Partial<TooltipProps> = {
    align: { offset: [0, 0] },
    placement: 'bottom',
    zIndex: 1,
  };

  const rightActions: {
    tooltipText: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
    show: boolean;
  }[] = [
    {
      tooltipText: 'Duplicate',
      show: isTiscAdmin && !isTablet,
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
      show: Boolean(showInquiryRequest && isDesignFirmUser && !isCustomProduct),
      Icon: CommentIcon,
      onClick: () =>
        store.dispatch(
          openModal({
            type: 'Inquiry Request',
            title: 'INQUIRY/REQUEST',
            props: { shareViaEmail: { product } },
          }),
        ),
    },
    {
      tooltipText: 'Assign Product',
      show: isDesignFirmUser && !hideAssign,
      Icon: AssignIcon,
      onClick: () =>
        store.dispatch(
          openModal({
            type: 'Assign Product',
            title: assignProductModalTitle,
            props: {
              isCustomProduct,
              productId: product.id,
            },
          }),
        ),
    },
    {
      tooltipText: 'Share via Email',
      show: showShareEmail,
      Icon: ShareIcon,
      onClick: () =>
        store.dispatch(
          openModal({
            type: 'Share via email',
            title: 'Share Via Email',
            props: { shareViaEmail: { isCustomProduct, product } },
          }),
        ),
    },
  ];

  return (
    <div className={styles.productCardItemWrapper}>
      <div
        className={`${styles.productCardItem} ${hasBorder ? styles.border : ''} ${
          unlistedDisabled ? styles.disabled : ''
        }`}
      >
        <div className={styles.imageWrapper} onClick={hanldeRedirectURL}>
          <div
            style={{
              backgroundImage: `url(${
                product.images[0] ? showImageUrl(product.images[0]) : SampleProductImage
              }`,
            }}
            className={styles.imageWrapper_image}
          />
          <div className={styles.imagePlaceholder}>
            <BodyText level={5} fontFamily="Roboto" style={{ fontSize: 13 }}>
              {product.description}
            </BodyText>
          </div>
        </div>
        <div className={styles.productInfo} onClick={hanldeRedirectURL}>
          <BodyText level={6} fontFamily="Roboto" customClass="product-description">
            {product.name || 'N/A'}
          </BodyText>
          <BodyText level={7} fontFamily="Roboto" customClass="text-uppercase">
            {product.brand?.name ?? 'N/A'}
          </BodyText>
        </div>

        <div className={styles.productAction}>
          <div className={`${styles.leftAction} flex-center`}>
            {hideFavorite ? null : (
              <Tooltip title="Favourite" {...tooltipProps}>
                <BodyText
                  level={6}
                  fontFamily="Roboto"
                  customClass="action-like"
                  onClick={likeProduct}
                >
                  {liked ? <LikedIcon /> : <LikeIcon />}
                  {isDesignFirmUser
                    ? null
                    : `${likeCount.toLocaleString('en-us')} ${likeCount <= 1 ? 'like' : 'likes'}`}
                </BodyText>
              </Tooltip>
            )}
            {showSpecify && isDesignFirmUser ? (
              <Tooltip title={'Specify'} {...tooltipProps}>
                <DispatchIcon
                  onClick={unlistedDisabled ? undefined : onSpecifyClick}
                  className={unlistedDisabled ? styles.unlistedDisabled : ''}
                />
              </Tooltip>
            ) : null}
            {showActionMenu && isDesignFirmUser && !isTablet ? (
              <ActionMenu
                containerStyle={{ height: 16 }}
                placement="bottomLeft"
                offsetAlign={[-12, 8]}
                className={styles.actionMenu}
                overlayClassName={styles.actionMenuOverLay}
                editActionOnMobile={false}
                actionItems={[
                  {
                    type: 'copy',
                    label: 'Copy',
                    onClick: () => handleCopyCustomProduct(),
                  },
                  {
                    type: 'updated',
                    label: 'Edit',
                    onClick: () =>
                      pushTo(PATH.designerCustomProductUpdate.replace(':id', product.id)),
                  },
                  {
                    type: 'deleted',
                    label: 'Delete',
                    onClick: () => handleDeleteCustomProduct(),
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
      </div>
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
  const loading = useAppSelector(loadingSelector);
  const { data, allProducts } = useAppSelector((state) => state.product.list);
  const isTiscAdmin = useCheckPermission('TISC Admin');
  const [collapseKey, setCollapseKey] = useState<number>();

  const onChangeDescription = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data) {
      return;
    }

    const latestData = [...data];

    latestData[index] = { ...latestData[index], description: e.target.value };

    store.dispatch(setProductList({ data: [...latestData] }));
  };

  if (loading) {
    return null;
  }

  if (!allProducts?.length && !data?.length) {
    return <EmptyOne />;
  }

  return (
    <>
      {data?.map((group, index) => (
        <ActiveOneCustomCollapse
          groupIndex={index}
          groupName="product-group"
          className={styles.productCardCollapse}
          customHeaderClass={`${styles.productCardHeaderCollapse} ${
            group.description || isTiscAdmin ? styles.productHeaderCollapse : ''
          }`}
          expandIcon={undefined}
          key={index}
          collapsible={group.count === 0 ? 'disabled' : undefined}
          forceOnKeyChange
          onChange={() => {
            setCollapseKey(collapseKey === index ? undefined : index);
          }}
          header={
            <div style={{ width: '100%' }}>
              <div className="header-text flex-between">
                <BodyText
                  data-text={`${group.name} (${group.count})`}
                  level={5}
                  fontFamily="Roboto"
                >
                  {showBrandLogo ? <img src={showImageUrl(group.brand_logo)} /> : null}

                  {truncate(capitalize(group.name), { length: 40 })}
                  <span className="product-count">({group.count})</span>
                </BodyText>
                <div style={{ marginRight: 16, height: 20 }}>
                  {collapseKey === index ? <DropupIcon /> : <DropdownIcon />}
                </div>
              </div>
              {group.description || isTiscAdmin ? (
                <div className="border-top-light description">
                  <div
                    className="flex-between "
                    style={{ minHeight: 40, margin: '8px 16px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {isTiscAdmin ? (
                      <CustomInput
                        placeholder="type description"
                        value={group.description}
                        onChange={onChangeDescription(index)}
                        style={{
                          color: isTiscAdmin ? '#2b39d4' : '#000',
                          cursor: isTiscAdmin ? 'text' : 'default',
                          border: 'unset',
                          borderColor: 'unset',
                        }}
                        disabled={!isTiscAdmin}
                      />
                    ) : (
                      <RobotoBodyText level={6}> {group.description} </RobotoBodyText>
                    )}
                    {isTiscAdmin ? (
                      <CustomSaveButton
                        onClick={() => {
                          if (!group.description) {
                            message.error('Please enter description');
                            return;
                          }

                          updateCollection(group.id, {
                            name: group.name,
                            description: group.description,
                          });
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          }
        >
          <div className={styles.productCardContainer}>
            {group.products.map((productItem, itemIndex) => (
              <ProductCard
                key={productItem.id || itemIndex}
                product={productItem}
                showInquiryRequest={showInquiryRequest}
                showActionMenu={showActionMenu}
                hideFavorite={hideFavorite}
              />
            ))}
          </div>
        </ActiveOneCustomCollapse>
      ))}

      <div className={styles.productCardContainer}>
        {allProducts?.map((productItem, itemIndex) => (
          <ProductCard
            key={productItem.id || itemIndex}
            product={productItem}
            showInquiryRequest={showInquiryRequest}
            showActionMenu={showActionMenu}
            hideFavorite={hideFavorite}
          />
        ))}
      </div>
    </>
  );
};
