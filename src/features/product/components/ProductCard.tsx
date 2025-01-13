import React, { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { USER_ROLE } from '@/constants/userRoles';
import { BackTop, Spin, Tooltip, TooltipProps } from 'antd';
import { useLocation } from 'umi';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete.svg';
import { ReactComponent as LikeIcon } from '@/assets/icons/action-like-icon.svg';
import { ReactComponent as LikedIcon } from '@/assets/icons/action-liked-icon.svg';
import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as CarbonIcon } from '@/assets/icons/carbon-footprint.svg';
import { ReactComponent as ClearIcon } from '@/assets/icons/clear-energy.svg';
import { ReactComponent as DoubleupIcon } from '@/assets/icons/double-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { ReactComponent as EcoIcon } from '@/assets/icons/eco-green.svg';
import { ReactComponent as AssignIcon } from '@/assets/icons/ic-assign.svg';
import { ReactComponent as CommentIcon } from '@/assets/icons/ic-comment.svg';
import { ReactComponent as DispatchIcon } from '@/assets/icons/ic-dispatch.svg';
import { ReactComponent as ShareIcon } from '@/assets/icons/ic-share.svg';
import { ReactComponent as PowerIcon } from '@/assets/icons/power-saving.svg';
import { ReactComponent as RecycleIcon } from '@/assets/icons/recycle.svg';
import { ReactComponent as TabIcon } from '@/assets/icons/tabs-icon.svg';
import { ReactComponent as WaterIcon } from '@/assets/icons/water-saving.svg';
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
import { useBoolean, useCheckPermission, useGetUserRoleFromPathname } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import {
  deleteCustomProduct,
  duplicateCustomProduct,
  getCustomProductList,
} from '@/pages/Designer/Products/CustomLibrary/services';
import { deleteCollection, updateCollection } from '@/services';
import { capitalize, flatMap, truncate, uniqBy } from 'lodash';

import { closeActiveSpecAttributeGroup, resetProductState, setProductList } from '../reducers';
import { ProductGetListParameter, ProductItem } from '../types';
import { ProductConsiderStatus } from '@/features/project/types';
import store, { useAppSelector } from '@/reducers';
import { openModal } from '@/reducers/modal';
import { CollectionRelationType } from '@/types';

import CustomButton from '@/components/Button/index';
import { ActiveOneCustomCollapse } from '@/components/Collapse';
import { EmptyOne } from '@/components/Empty';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { loadingSelector } from '@/components/LoadingPage/slices';
import loadingStyles from '@/components/LoadingPage/styles/index.less';
import { ActionMenu } from '@/components/TableAction';
import { BodyText, RobotoBodyText } from '@/components/Typography';

import { assignProductModalTitle } from '../modals/AssignProductModal';
import { getProductDetailPathname } from '../utils';
import styles from './ProductCard.less';
import { CheckBoxDropDown } from './ProductTopBarItem';
import CollectionGallery from '@/features/gallery/CollectionGallery';

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
  setCollapseKey?: (key: number) => void;
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
  setCollapseKey,
}) => {
  const { isTablet } = useScreen();
  const normalProductfilter = useAppSelector((state) => state.product.list.filter);
  const [liked, setLiked] = useState(product.is_liked);

  const { data } = useAppSelector((state) => state.product.list);
  const location = useLocation();

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
        if (location.pathname == PATH.designerFavourite && data) {
          const newData = data
            .map((collection) => {
              const newProducts = collection.products.filter((item) => item.id !== product.id);
              return {
                ...collection,
                products: newProducts,
              };
            })
            .filter((collection) => collection?.products?.length > 0);
          store.dispatch(
            setProductList({
              data: newData,
            }),
          );
        }
      }
    });
  };

  const reloadProductInformation = () => {
    setCollapseKey?.(-1);

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
        const cateFilter = filter.find((item) => item.name === 'category_id');
        const collFilter = filter.find((item) => item.name === 'collection_id');
        if (cateFilter) {
          params.category_id = cateFilter.value === 'all' ? 'all' : cateFilter.value;
        }
        if (collFilter) {
          params.collection_id = collFilter.value === 'all' ? 'all' : collFilter.value;
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

  const ecoLabelsProps: Partial<TooltipProps> = {
    placement: 'left',
    zIndex: 1,
    mouseEnterDelay: 0,
    showArrow: false,
    align: {
      offset: [41, 0],
    },
    overlayClassName: `${styles.ecoTooltip}`,
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
      tooltipText: 'Make Inquiry/Request',
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
      tooltipText: 'Assign to Project',
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
          <div className={styles.productName}>
            <BodyText level={6} fontFamily="Roboto" customClass="product-description">
              {product.name || 'N/A'}
            </BodyText>
          </div>
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
        {product.ecoLabel && (
          <div className={`${styles.ecoLabels}`}>
            {product.ecoLabel['carbon_footprint'].value && (
              <Tooltip title={product.ecoLabel['carbon_footprint'].name} {...ecoLabelsProps}>
                <CarbonIcon />
              </Tooltip>
            )}
            {product.ecoLabel['clear_energy'].value && (
              <Tooltip title={product.ecoLabel['clear_energy'].name} {...ecoLabelsProps}>
                <ClearIcon />
              </Tooltip>
            )}
            {product.ecoLabel['eco_green'].value && (
              <Tooltip title={product.ecoLabel['eco_green'].name} {...ecoLabelsProps}>
                <EcoIcon />
              </Tooltip>
            )}
            {product.ecoLabel['power_saving'].value && (
              <Tooltip title={product.ecoLabel['power_saving'].name} {...ecoLabelsProps}>
                <PowerIcon />
              </Tooltip>
            )}
            {product.ecoLabel['recycle_reuse'].value && (
              <Tooltip title={product.ecoLabel['recycle_reuse'].name} {...ecoLabelsProps}>
                <RecycleIcon />
              </Tooltip>
            )}
            {product.ecoLabel['water_saving'].value && (
              <Tooltip title={product.ecoLabel['water_saving'].name} {...ecoLabelsProps}>
                <WaterIcon />
              </Tooltip>
            )}
          </div>
        )}
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
  const { isMobile } = useScreen();
  const loading = useAppSelector(loadingSelector);
  const { data, allProducts, filter } = useAppSelector((state) => state.product.list);
  const isTiscAdmin = useCheckPermission(['TISC Admin', 'Consultant Team']);
  const isBrandUser = useCheckPermission(['Brand Admin', 'Brand Team']);
  const isDesignerUser = useCheckPermission(['Design Admin', 'Design Team']);
  const [collapseKey, setCollapseKey] = useState<number>(-1);
  const [activeLabels, setActiveLabels] = useState<{ id: string; name: string }[]>([]);
  const [groups, setGroups] = useState<any>([]);
  const isOpenGallery = useBoolean(false);
  const isOpenLabel = useBoolean(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [customLoading, setCustomLoading] = useState(false);
  const firstLoad = useBoolean(true);
  const [delayDuration, setDelayDuration] = useState<number>(20000);
  const location = useLocation();
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  useEffect(() => {
    if (data) {
      const activeProducts =
        activeLabels.length === 0
          ? data[collapseKey]?.products
          : data[collapseKey]?.products.filter((product) => {
              if (
                activeLabels
                  .map((label) => label.id)
                  .every((label) =>
                    product.labels.map((activeLabel: any) => activeLabel.id).includes(label),
                  )
              )
                return true;
              return false;
            });

      const newData = data.map((item, index: number) => {
        const temp = uniqBy(
          flatMap(item.products.map((product: any) => product.labels)),
          'id',
        ).filter(Boolean);
        if (index === collapseKey) {
          return {
            ...item,
            products: activeProducts,
            labels: temp,
          };
        }

        return { ...item, labels: temp };
      });

      setGroups(newData);
    }
  }, [JSON.stringify(activeLabels), collapseKey, JSON.stringify(data)]);

  const filterByCategory = filter
    ? filter.find((item) => item.name === 'category_id')
      ? true
      : false
    : false;

  const onChangeDescription = (index: number) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!data) {
      return;
    }
    e.stopPropagation();

    const latestData = [...data];

    latestData[index] = { ...latestData[index], description: e.target.value };

    store.dispatch(setProductList({ data: [...latestData] }));
  };

  if (loading) {
    return null;
  }

  if (typeof filter == 'undefined' || filter.length == 0) {
    if (location.pathname == PATH.designerBrandProduct && !allProducts?.length) {
      // return (
      //   <div className={loadingStyles.container}>
      //     <Spin size="large" />
      //   </div>
      // );
    } else if (firstLoad.value) {
      if (location.pathname == PATH.productConfiguration) {
        // First time load to TISC-Conf but login as Designer or Brand previously
        store.dispatch(resetProductState());
        firstLoad.setValue(false);
      } else if (
        location.pathname == PATH.designerFavourite ||
        location.pathname == PATH.brandProduct
      ) {
        // First time load to Designer Favourite
        if (allProducts?.length) store.dispatch(resetProductState());
        setTimeout(() => {
          firstLoad.setValue(false);
        }, delayDuration);
        // if (!data?.length) {
        //   return (
        //     <div className={loadingStyles.container}>
        //       <Spin size="large" />
        //     </div>
        //   );
        // }
      }
    }
  } else {
    if (!firstLoad.value && location.pathname == PATH.productConfiguration) {
      setTimeout(() => {
        firstLoad.setValue(true);
      }, delayDuration);
      // if (!data?.length) {
      //   return (
      //     <div className={loadingStyles.container}>
      //       <Spin size="large" />
      //     </div>
      //   );
      // }
    }
  }

  if (!allProducts?.length && !data?.length) {
    return <EmptyOne />;
  }
  const onChangeGallery = (images: any) => {
    const newImages = images.map((image: string) => {
      const parts = image.split('base64,');
      return parts[1] || image;
    });
    setGalleryImages(newImages);
  };
  return (
    <>
      {customLoading ? (
        <div className={loadingStyles.container}>
          <Spin size="large" />
        </div>
      ) : null}
      {groups?.map((group: any, index: number) => (
        <ActiveOneCustomCollapse
          groupIndex={index}
          groupName="product-group"
          className={styles.productCardCollapse}
          customHeaderClass={`${styles.productCardHeaderCollapse} ${
            (group.description || isTiscAdmin) && !filterByCategory
              ? styles.productHeaderCollapse
              : ''
          }`}
          expandIcon={undefined}
          key={index}
          collapsible={group.count === 0 ? 'disabled' : undefined}
          forceOnKeyChange
          onChange={() => {
            isOpenLabel.setValue(false);
            isOpenGallery.setValue(false);
            setActiveLabels([]);
            setCollapseKey(collapseKey === index ? -1 : index);
          }}
          header={
            <div style={{ width: '100%' }}>
              <div className="header-text flex-between text-uppercase">
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
            </div>
          }
        >
          <div style={{ marginBottom: 8, boxShadow: 'rgba(0, 0, 0, 0.5) 1px 1px 3px' }}>
            {(group.description || isTiscAdmin) && !filterByCategory ? (
              <div style={{ background: '#fff' }}>
                <div
                  className="flex-between"
                  style={{ minHeight: 40, borderBottom: '1px solid #bfbfbf' }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {!isTiscAdmin ? (
                    <RobotoBodyText level={5} style={{ margin: '8px 16px' }}>
                      {group.description}
                    </RobotoBodyText>
                  ) : (
                    <CustomTextArea
                      customStyles={{ width: '100%', marginRight: 8 }}
                      styles={{
                        paddingLeft: 16,
                        paddingTop: 11,
                        paddingBottom: 11,
                        overflow: 'hidden',
                        resize: 'none',
                      }}
                      placeholder="type description"
                      value={group.description}
                      onChange={onChangeDescription(index)}
                      borderBottomColor=""
                      autoResize
                    />
                  )}
                </div>
              </div>
            ) : null}
            {!filterByCategory ? (
              <div className={styles.galleryContainer}>
                <div
                  className={styles.group}
                  style={{
                    boxShadow: `0px -0.5px 0px 0px ${
                      isOpenGallery.value && group.images ? '#bfbfbf' : '#000'
                    } inset`,
                  }}
                >
                  {((group.description || isTiscAdmin) && !filterByCategory) ||
                  (isBrandUser && group?.images?.length > 0) ||
                  (isDesignerUser && group?.images?.length > 0) ? (
                    <div
                      className={`header-text ${styles.gallery} ${
                        isOpenGallery.value ? `${styles.active} ${styles.galleryActive}` : ''
                      }`}
                      onClick={() => {
                        isOpenGallery.setValue((pre) => !pre);
                      }}
                    >
                      <BodyText level={5} fontFamily="Roboto">
                        GALLERY
                      </BodyText>
                      <div
                        style={{ marginRight: 16, marginLeft: 8, height: 20, cursor: 'pointer' }}
                      >
                        {isOpenGallery.value ? <DropupIcon /> : <DropdownIcon />}
                      </div>
                    </div>
                  ) : null}

                  <div className={'d-flex'} style={{ alignItems: 'center' }}>
                    <div
                      className={`${styles.label} ${
                        activeLabels[0] || isOpenLabel.value ? styles.active : ''
                      }`}
                    >
                      <CheckBoxDropDown
                        items={group.labels}
                        onChange={(values) => {
                          setActiveLabels(values);
                        }}
                        viewAllTop={true}
                        textCapitalize={false}
                        placement={'bottomLeft'}
                        menuStyle={{ height: 'max-content', width: '100%' }}
                        handleChangeDropDownIcon={(visible: boolean) => {
                          isOpenLabel.setValue(visible);
                        }}
                        className={'header-text'}
                        selected={activeLabels}
                      >
                        <span
                          className={'text-overflow'}
                          style={{
                            maxWidth: 150,
                          }}
                        >
                          FILTER BY
                        </span>
                      </CheckBoxDropDown>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                      {!isMobile
                        ? activeLabels.map((activeLabel: any, labelIndex: number) => (
                            <div className={styles.labelContainer} style={{ padding: 8 }}>
                              <div
                                key={labelIndex}
                                style={{
                                  borderRadius: 12,
                                  height: 22,
                                  paddingLeft: 16,
                                  paddingRight: 1,
                                }}
                                className={'d-flex flex-center'}
                              >
                                <span
                                  className={'text-capitalize'}
                                  style={{
                                    paddingRight: 8,
                                    maxWidth: 400,
                                    width: 'fit-content',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {activeLabel.name}
                                </span>
                                <RemoveIcon
                                  className={styles.removeIcon}
                                  onClick={() => {
                                    setActiveLabels(
                                      activeLabels.filter(
                                        (item: any) => item.id !== activeLabel.id,
                                      ),
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
                </div>
                <div
                  className={` ${
                    isOpenGallery.value ? styles.galleryContentIn : styles.galleryContentOut
                  }`}
                  style={{
                    height: !isTiscAdmin && (!group.images || !group.images[0]) ? 0 : 'unset',
                    boxShadow: '0px -0.5px 0px 0px #000 inset',
                  }}
                >
                  <CollectionGallery onChangeImages={onChangeGallery} data={group.images} />
                </div>
              </div>
            ) : null}
            {isTiscAdmin && !filterByCategory ? (
              <div style={{ background: '#fff' }}>
                <div
                  style={{
                    minHeight: 40,
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                  }}
                >
                  {isTiscAdmin ? (
                    <>
                      <CustomButton
                        style={{ marginRight: 16, borderRadius: 12 }}
                        properties={'warning'}
                        variant={'primary'}
                        size={'small'}
                        disabled={group.type === CollectionRelationType.Color}
                        onClick={() => {
                          confirmDelete(() => {
                            deleteCollection(group.id).then(() => {
                              const brandId = groups[0].products[0].brand?.id || '';
                              getProductSummary(brandId).then(() => {
                                const params = {
                                  brand_id: brandId,
                                  collection_id: 'all',
                                } as ProductGetListParameter;
                                getProductListByBrandId(params);
                              });
                            });
                          });
                        }}
                      >
                        Delete
                      </CustomButton>
                      <CustomButton
                        style={{ marginRight: 16, borderRadius: 12 }}
                        properties={'standard'}
                        variant={'primary'}
                        size={'small'}
                        onClick={() => {
                          const brandId = groups[0].products[0].brand?.id || '';
                          setCustomLoading(true);
                          updateCollection(group.id, {
                            name: group.name,
                            description: group.description,
                            images: galleryImages,
                            brand_id: brandId,
                          }).then(() => {
                            setCustomLoading(false);
                          });
                        }}
                      >
                        Save
                      </CustomButton>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.productCardContainer}>
            {group.products.map((productItem: any, itemIndex: number) => (
              <ProductCard
                key={productItem.id || itemIndex}
                product={productItem}
                showInquiryRequest={showInquiryRequest}
                showActionMenu={showActionMenu}
                hideFavorite={hideFavorite}
                setCollapseKey={setCollapseKey}
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
            setCollapseKey={setCollapseKey}
          />
        ))}
      </div>
      {/* Scroll to top Button */}
      {showBackTop && (
        <BackTop>
          <CustomButton
            style={{
              position: 'fixed',
              bottom: 40,
              right: 25,
              zIndex: 1,
              paddingLeft: 20,
              paddingRight: 20,
              borderRadius: 40,
            }}
            properties={'rounded'}
            variant={'primaryDark'}
            size={'medium'}
          >
            <DoubleupIcon style={{ marginRight: 16 }} /> Back To Top
          </CustomButton>
        </BackTop>
      )}
    </>
  );
};
