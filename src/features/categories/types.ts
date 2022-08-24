export interface CategoryNestedList {
  id: string;
  name?: string;
  count?: number;
  subs: CategoryNestedList[];
}

export type SubcategoryValueProps = {
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
  value: SubcategoryValueProps;
  onChange: (value: SubcategoryValueProps) => void;
}

export interface CategoryBodyProps {
  id?: string;
  name: string;
  subs: SubcategoryValueProps[];
}
