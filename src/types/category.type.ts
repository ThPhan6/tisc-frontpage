export interface CategoryListResponse {
  id: string;
  name?: string;
  count?: number;
  subs: CategoryListResponse[];
}

export type SubcategoryValueProp = {
  id?: string;
  name: string;
  subs: {
    name: string;
    id?: string;
  }[];
};

export const subcategoryValueDefault = {
  name: '',
  subs: [],
};

export interface SubcategoryItemProps {
  onClickDeleteSubcategory?: () => void;
  value: SubcategoryValueProp;
  onChange: (value: SubcategoryValueProp) => void;
}

export interface CategoryBodyProp {
  id?: string;
  name: string;
  subs: SubcategoryValueProp[];
}

export interface CategoryEntryFormProps {
  onCancel?: () => void;
  onSubmit?: (data: CategoryBodyProp) => void;
  categoryValue: CategoryBodyProp;
  setCategoryValue: (value: CategoryBodyProp) => void;
  submitButtonStatus?: boolean;
}
