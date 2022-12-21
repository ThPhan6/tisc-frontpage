import { FC } from 'react';

import { DimensionWeightItem, ProductDimensionWeight } from './types';

import { ConversionText } from '../product/components/ProductAttributes/AttributeComponent';
import { BodyText } from '@/components/Typography';

export const AttributeConversionText: FC<{
  data: ProductDimensionWeight;
  conversionItem: DimensionWeightItem;
}> = ({ data, conversionItem }) => {
  const notIncluded =
    conversionItem.with_diameter !== null && conversionItem.with_diameter !== data.with_diameter;
  if (notIncluded || !conversionItem.conversion_value_1) {
    return null;
  }

  return (
    <tr>
      <td
        style={{
          height: 36,
          width: '30%',
          textTransform: 'capitalize',
          paddingBottom: 0,
        }}>
        <BodyText level={4}>{conversionItem.name}</BodyText>
      </td>
      <td style={{ paddingBottom: 0 }}>
        <ConversionText
          conversion={conversionItem.conversion}
          firstValue={conversionItem.conversion_value_1}
          secondValue={conversionItem.conversion_value_2}
        />
      </td>
    </tr>
  );
};
