import { PATH } from '@/constants/path';
import { useLocation, useParams } from 'umi';

import { replaceBrandAttributeBrandId } from './util';

export const useCheckBrandAttributePath = () => {
  const paramId = useParams<{ brandId: string; id: string }>();
  const brandId = paramId.brandId;

  const componentPath = replaceBrandAttributeBrandId(PATH.options, brandId);
  const componentCreatePath = replaceBrandAttributeBrandId(PATH.createOptions, brandId);
  const componentUpdatePath = replaceBrandAttributeBrandId(PATH.updateOptions, brandId);
  const linkagePath = replaceBrandAttributeBrandId(PATH.LinkageDataSet, brandId);

  const generalAttributePath = replaceBrandAttributeBrandId(PATH.attributeGeneral, brandId);
  const generalAttributeCreatePath = replaceBrandAttributeBrandId(
    PATH.attributeGeneralCreate,
    brandId,
  );
  const generalAttributeUpdatePath = replaceBrandAttributeBrandId(
    PATH.attributeGeneralUpdate,
    brandId,
  );

  const featureAttributePath = replaceBrandAttributeBrandId(PATH.attributeFeature, brandId);
  const featureAttributeCreatePath = replaceBrandAttributeBrandId(
    PATH.attributeFeatureCreate,
    brandId,
  );
  const featureAttributeUpdatePath = replaceBrandAttributeBrandId(
    PATH.attributeFeatureUpdate,
    brandId,
  );

  const specificationAttributePath = replaceBrandAttributeBrandId(
    PATH.attributeSpecification,
    brandId,
  );
  const specificationAttributeCreatePath = replaceBrandAttributeBrandId(
    PATH.attributeSpecificationCreate,
    brandId,
  );
  const specificationAttributeUpdatePath = replaceBrandAttributeBrandId(
    PATH.attributeSpecificationUpdate,
    brandId,
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
  const paramId = useParams<{ brandId: string }>();
  const pathName = replaceBrandAttributeBrandId(location.pathname, paramId.brandId);
  const { componentPath, generalAttributePath, featureAttributePath, specificationAttributePath } =
    useCheckBrandAttributePath();

  return (
    pathName === componentPath ||
    pathName === generalAttributePath ||
    pathName === featureAttributePath ||
    pathName === specificationAttributePath
  );
};
