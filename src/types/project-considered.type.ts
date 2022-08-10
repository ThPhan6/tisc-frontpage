export interface SpecificationBasisOption {
  id: string;
  basis_option_id: string;
}
export interface SpecificationAttributeGroup {
  id: string;
  isChecked: boolean;
  attribute: SpecificationBasisOption[];
}
export interface SpecificationBodyRequest {
  is_refer_document: boolean;
  specification_attribute_groups: SpecificationAttributeGroup[];
}
