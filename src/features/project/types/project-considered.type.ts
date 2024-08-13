import { SpecificationType } from '@/features/product/types';
import { OptionQuantityResponse } from '@/features/product/types/autoStep';
import { ProductIDType } from '@/types';

export interface SelectedSpecAttributte {
  id: string;
  basis_option_id: string;
}

export interface SpecificationPreSelectStep {
  step_id: string;
  options: OptionQuantityResponse[];
}

export interface StepSelectionProps {
  id: string;
  combined_quantities: {
    id: string;
    quantiy: number;
  }[];
  product_id: string;
  project_id: string;
  specification_id: string;
  quantities: Record<string, number>[];
}

export interface ViewStepProps {
  id: string;
  name: string;
  order: number;
  project_id: string;
  specification_id: string;
  options: any[];
}

export interface SpecificationAttributeGroup {
  id: string;
  attributes?: SelectedSpecAttributte[];
  configuration_steps?: SpecificationPreSelectStep[];
  step_selections?: StepSelectionProps;
  viewSteps?: ViewStepProps[];
  isChecked?: boolean;
  type?: SpecificationType;
  id_format_type?: ProductIDType;
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
