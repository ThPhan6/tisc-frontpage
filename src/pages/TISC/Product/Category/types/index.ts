export interface ICategoryListResponse {
  id: string;
  name?: string;
  count?: number;
  subs: ICategoryListResponse[];
}

export type SubcategoryValueProp = {
  name: string;
  subs: {
    name: string;
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
