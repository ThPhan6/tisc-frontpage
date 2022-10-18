export interface SelectedSpecAttributte {
  id: string;
  basis_option_id: string;
}
export interface SpecificationAttributeGroup {
  id: string;
  attributes: SelectedSpecAttributte[];
  isChecked?: boolean;
}
export interface SpecificationBodyRequest {
  is_refer_document: boolean;
  attribute_groups: SpecificationAttributeGroup[];
}
export interface SelectSpecificationBodyRequest {
  specification: SpecificationBodyRequest;
  brand_location_id: string;
  distributor_location_id: string;
}
