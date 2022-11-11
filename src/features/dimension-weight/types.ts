import { ConversionSubValueProps } from '@/types';

export interface DimensionWeightItem {
  id: string;
  name: string;
  basis_id: string;
  basis_value_id: string;
  conversion_value_1: string;
  conversion_value_2: string;
  type: string;
  text: string;
  with_diameter: boolean | null;
  conversion: ConversionSubValueProps;
}

export interface ProductDimensionWeight {
  id: string;
  name: string;
  with_diameter: boolean;
  attributes: DimensionWeightItem[];
}
