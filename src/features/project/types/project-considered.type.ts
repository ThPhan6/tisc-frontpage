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
  specification_attribute_groups: SpecificationAttributeGroup[];
}
