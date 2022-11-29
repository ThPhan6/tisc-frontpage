import { useEffect, useState } from 'react';

import { getDimensionWeightList } from './services';

import { ProductDimensionWeight } from './types';

export const useGetDimensionWeight = (isGetDWList?: boolean) => {
  const [data, setData] = useState<ProductDimensionWeight>({
    id: '',
    name: '',
    with_diameter: false,
    attributes: [],
  });

  useEffect(() => {
    if (!isGetDWList) {
      return undefined;
    }

    getDimensionWeightList().then((res) => {
      if (res) {
        setData(res);
      }
    });
  }, []);

  return { data };
};
