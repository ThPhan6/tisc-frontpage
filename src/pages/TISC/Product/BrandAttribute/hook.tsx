import { PATH } from '@/constants/path';
import { useLocation, useParams } from 'umi';

import { BrandAttributeParamProps } from './types';

import { replaceBrandAttributeBrandId } from './util';

export const useCheckBrandAttributePath = () => {
  const paramId = useParams<BrandAttributeParamProps>();
  const brandId = paramId.brandId;
  const brandName = paramId.brandName;

  const componentPath = replaceBrandAttributeBrandId(PATH.options, brandId, brandName);
  const componentCreatePath = replaceBrandAttributeBrandId(PATH.createOptions, brandId, brandName);
  const componentUpdatePath = replaceBrandAttributeBrandId(PATH.updateOptions, brandId, brandName);
  const linkagePath = replaceBrandAttributeBrandId(PATH.LinkageDataSet, brandId, brandName);

  const generalAttributePath = replaceBrandAttributeBrandId(
    PATH.attributeGeneral,
    brandId,
    brandName,
  );
  const generalAttributeCreatePath = replaceBrandAttributeBrandId(
    PATH.attributeGeneralCreate,
    brandId,
    brandName,
  );
  const generalAttributeUpdatePath = replaceBrandAttributeBrandId(
    PATH.attributeGeneralUpdate,
    brandId,
    brandName,
  );

  const featureAttributePath = replaceBrandAttributeBrandId(
    PATH.attributeFeature,
    brandId,
    brandName,
  );
  const featureAttributeCreatePath = replaceBrandAttributeBrandId(
    PATH.attributeFeatureCreate,
    brandId,
    brandName,
  );
  const featureAttributeUpdatePath = replaceBrandAttributeBrandId(
    PATH.attributeFeatureUpdate,
    brandId,
    brandName,
  );

  const specificationAttributePath = replaceBrandAttributeBrandId(
    PATH.attributeSpecification,
    brandId,
    brandName,
  );
  const specificationAttributeCreatePath = replaceBrandAttributeBrandId(
    PATH.attributeSpecificationCreate,
    brandId,
    brandName,
  );
  const specificationAttributeUpdatePath = replaceBrandAttributeBrandId(
    PATH.attributeSpecificationUpdate,
    brandId,
    brandName,
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
  const pathName = replaceBrandAttributeBrandId(location.pathname, param.brandId, param.brandName);
  const { componentPath, generalAttributePath, featureAttributePath, specificationAttributePath } =
    useCheckBrandAttributePath();

  return (
    pathName === componentPath ||
    pathName === generalAttributePath ||
    pathName === featureAttributePath ||
    pathName === specificationAttributePath
  );
};
