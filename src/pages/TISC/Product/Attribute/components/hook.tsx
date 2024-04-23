import { PATH } from '@/constants/path';
import { useLocation, useParams } from 'umi';

import { BrandAttributeParamProps } from '../../BrandAttribute/types';

import { replaceBrandAttributeBrandId } from '../../BrandAttribute/util';

export const useCheckAttributeForm = () => {
  const location = useLocation();
  const param = useParams<BrandAttributeParamProps>();

  const isAttributeGeneral =
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(PATH.attributeGeneral, param.brandId, param.brandName, param.id),
    ) !== -1 ||
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(
        PATH.attributeGeneralCreate,
        param.brandId,
        param.brandName,
        param.id,
      ),
    ) !== -1 ||
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(
        PATH.attributeGeneralUpdate,
        param.brandId,
        param.brandName,
        param.id,
      ),
    ) !== -1;

  const isAttributeFeature =
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(PATH.attributeFeature, param.brandId, param.brandName, param.id),
    ) !== -1 ||
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(
        PATH.attributeFeatureCreate,
        param.brandId,
        param.brandName,
        param.id,
      ),
    ) !== -1 ||
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(
        PATH.attributeFeatureUpdate,
        param.brandId,
        param.brandName,
        param.id,
      ),
    ) !== -1;

  const isAttributeSpecification =
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(
        PATH.attributeSpecification,
        param.brandId,
        param.brandName,
        param.id,
      ),
    ) !== -1 ||
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(
        PATH.attributeSpecificationCreate,
        param.brandId,
        param.brandName,
        param.id,
      ),
    ) !== -1 ||
    location.pathname.indexOf(
      replaceBrandAttributeBrandId(
        PATH.attributeSpecificationUpdate,
        param.brandId,
        param.brandName,
        param.id,
      ),
    ) !== -1;

  const isAttribute = isAttributeGeneral || isAttributeFeature || isAttributeSpecification;

  return { isAttributeGeneral, isAttributeFeature, isAttributeSpecification, isAttribute };
};
