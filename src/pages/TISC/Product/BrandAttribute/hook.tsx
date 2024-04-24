import { PATH } from '@/constants/path';
import { useLocation, useParams } from 'umi';

import { BrandAttributeParamProps } from './types';

import { BranchTabKey } from './BranchHeader';
import { replaceBrandAttributeBrandId } from './util';

export const useCheckBrandAttributePath = () => {
  const param = useParams<BrandAttributeParamProps>();
  const brandId = param.brandId;
  const brandName = param.brandName;
  const id = param?.id;

  const componentPath = replaceBrandAttributeBrandId(PATH.options, brandId, brandName, id);
  const componentCreatePath = replaceBrandAttributeBrandId(
    PATH.createOptions,
    brandId,
    brandName,
    id,
  );
  const componentUpdatePath = replaceBrandAttributeBrandId(
    PATH.updateOptions,
    brandId,
    brandName,
    id,
  );
  const linkagePath = replaceBrandAttributeBrandId(PATH.LinkageDataSet, brandId, brandName, id);

  const generalAttributePath = replaceBrandAttributeBrandId(
    PATH.attributeGeneral,
    brandId,
    brandName,
    id,
  );
  const generalAttributeCreatePath = replaceBrandAttributeBrandId(
    PATH.attributeGeneralCreate,
    brandId,
    brandName,
    id,
  );
  const generalAttributeUpdatePath = replaceBrandAttributeBrandId(
    PATH.attributeGeneralUpdate,
    brandId,
    brandName,
    id,
  );

  const featureAttributePath = replaceBrandAttributeBrandId(
    PATH.attributeFeature,
    brandId,
    brandName,
    id,
  );
  const featureAttributeCreatePath = replaceBrandAttributeBrandId(
    PATH.attributeFeatureCreate,
    brandId,
    brandName,
    id,
  );
  const featureAttributeUpdatePath = replaceBrandAttributeBrandId(
    PATH.attributeFeatureUpdate,
    brandId,
    brandName,
    id,
  );

  const specificationAttributePath = replaceBrandAttributeBrandId(
    PATH.attributeSpecification,
    brandId,
    brandName,
    id,
  );
  const specificationAttributeCreatePath = replaceBrandAttributeBrandId(
    PATH.attributeSpecificationCreate,
    brandId,
    brandName,
    id,
  );
  const specificationAttributeUpdatePath = replaceBrandAttributeBrandId(
    PATH.attributeSpecificationUpdate,
    brandId,
    brandName,
    id,
  );

  return {
    componentPath,
    componentCreatePath,
    componentUpdatePath,
    linkagePath,
    ///
    generalAttributePath,
    generalAttributeCreatePath,
    generalAttributeUpdatePath,
    ///
    featureAttributePath,
    featureAttributeCreatePath,
    featureAttributeUpdatePath,
    ///
    specificationAttributePath,
    specificationAttributeCreatePath,
    specificationAttributeUpdatePath,
  };
};

export const useCheckBranchAttributeTab = () => {
  const location = useLocation();
  const param = useParams<BrandAttributeParamProps>();
  const pathName = replaceBrandAttributeBrandId(
    location.pathname,
    param.brandId,
    param.brandName,
    param?.id,
  );
  const {
    componentPath,
    componentCreatePath,
    componentUpdatePath,

    generalAttributePath,
    generalAttributeCreatePath,
    generalAttributeUpdatePath,

    featureAttributePath,
    featureAttributeCreatePath,
    featureAttributeUpdatePath,

    specificationAttributePath,
    specificationAttributeCreatePath,
    specificationAttributeUpdatePath,
  } = useCheckBrandAttributePath();

  /// using to check tab active
  const activeTab =
    pathName === componentPath ||
    pathName === generalAttributePath ||
    pathName === featureAttributePath ||
    pathName === specificationAttributePath;

  /// using to navigate after created attribute
  const activePath =
    pathName === componentCreatePath || pathName === componentUpdatePath
      ? componentPath
      : pathName === generalAttributeCreatePath || pathName === generalAttributeUpdatePath
      ? generalAttributePath
      : pathName === featureAttributeCreatePath || pathName === featureAttributeUpdatePath
      ? featureAttributePath
      : pathName === specificationAttributeCreatePath ||
        pathName === specificationAttributeUpdatePath
      ? specificationAttributePath
      : '';

  /// using to check current tab selected
  const currentTab =
    pathName === componentPath ||
    pathName === componentCreatePath ||
    pathName === componentUpdatePath
      ? BranchTabKey.component
      : pathName === generalAttributePath ||
        pathName === generalAttributeCreatePath ||
        pathName === generalAttributeUpdatePath
      ? BranchTabKey.general
      : pathName === featureAttributePath ||
        pathName === featureAttributeCreatePath ||
        pathName === featureAttributeUpdatePath
      ? BranchTabKey.feature
      : BranchTabKey.specification;

  return { activeTab, activePath, currentTab };
};
