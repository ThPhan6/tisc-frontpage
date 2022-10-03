export interface MaterialProductCodeMain {
  id: string;
  name: string;
  count: 0;
  subs: MaterialProductCodeSub[];
}

export interface MaterialProductCodeSub {
  id: string;
  name: string;
  count: 0;
  codes: MaterialProductCodeItem[];
}

export interface MaterialProductCodeItem {
  id: string;
  code: string;
  description: string;
}

export interface MaterialProductForm {
  name: string;
  subs: MaterialProductSubForm[];
}

export interface MaterialProductSubForm {
  name: string;
  codes: MaterialProductDetail[];
  is_collapse?: string;
}

export interface MaterialProductDetail {
  code: string;
  description: string;
}

export interface MaterialProductItemProps {
  value: MaterialProductSubForm;
  onChangeValue: (value: MaterialProductSubForm) => void;
  handleOnClickDeleteItem: () => void;
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
