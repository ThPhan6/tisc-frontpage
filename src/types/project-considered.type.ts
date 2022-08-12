export interface SelectedSpecAttributte {
  id: string;
  basis_option_id: string;
}
export interface SpecificationAttributeGroup {
  id: string;
  attribute: SelectedSpecAttributte[];
}
export interface SpecificationBodyRequest {
  is_refer_document: boolean;
  specification_attribute_groups: SpecificationAttributeGroup[];
}
