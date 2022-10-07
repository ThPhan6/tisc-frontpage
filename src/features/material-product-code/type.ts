export interface MaterialProductCodeMainList {
  id: string;
  name: string;
  count: 0;
  subs: MaterialProductCodeSubList[];
}

export interface MaterialProductCodeSubList {
  id: string;
  name: string;
  count: 0;
  codes: MaterialProductCodeItem[];
}

export interface MaterialProductCodeItem {
  code: string;
  description: string;
}
export interface MaterialProductSubForm {
  name: string;
  codes: MaterialProductCodeItem[];
  is_collapse?: string;
}

export interface MaterialProductForm {
  name: string;
  subs: MaterialProductSubForm[];
}

export interface MaterialProductItemProps {
  value: MaterialProductSubForm;
  onChangeValue: (value: MaterialProductSubForm) => void;
  handleClickDelete: () => void;
}

export const DEFAULT_MATERIAL_PRODUCT: MaterialProductForm = {
  name: '',
  subs: [],
};

export const DEFAULT_SUB_MATERIAL_PRODUCT: MaterialProductSubForm = {
  name: '',
  codes: [],
  is_collapse: '',
};

export const DEFAULT_ITEM_MATERIAL_PRODUCT: MaterialProductCodeItem = {
  code: '',
  description: '',
};
