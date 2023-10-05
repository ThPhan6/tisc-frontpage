import { SpecificationType } from '@/features/product/types';
import { OptionQuantityResponse } from '@/features/product/types/autoStep';

export interface SelectedSpecAttributte {
  id: string;
  basis_option_id: string;
}

export interface SpecificationPreSelectStep {
  step_id: string;
  options: OptionQuantityResponse[];
}

export interface SpecificationAttributeGroup {
  id: string;
  attributes?: SelectedSpecAttributte[];
  configuration_steps?: SpecificationPreSelectStep[];
  isChecked?: boolean;
  type?: SpecificationType;
}
export interface SpecificationBodyRequest {
  is_refer_document: boolean;
  attribute_groups: SpecificationAttributeGroup[];
}
export interface SelectSpecificationBodyRequest {
  specification: SpecificationBodyRequest;
  brand_location_id: string;
  distributor_location_id: string;
  custom_product?: boolean;
}
