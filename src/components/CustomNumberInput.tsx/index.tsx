import { FC } from 'react';
import MaskedInput from 'react-text-mask';

import { InputProps } from 'antd';

import styles from './index.less';
import { createNumberMask } from 'text-mask-addons';

interface MaskedInputProps extends InputProps {
  containerClass?: string;
  prefix?: string;
  suffix?: string;
  includeThousandsSeparator?: boolean;
  thousandsSeparatorSymbol?: string;
  allowDecimal?: boolean;
  decimalSymbol?: string; // how many digits allowed after the decimal
  decimalLimit?: number; // limit length of integer numbers
  integerLimit?: number | null;
  requireDecimal?: boolean;
  allowNegative?: boolean;
  allowLeadingZeroes?: boolean;
}
export const MaskedNumberInput: FC<MaskedInputProps> = ({
  containerClass,
  prefix = '',
  suffix = '',
  includeThousandsSeparator = true,
  thousandsSeparatorSymbol = ',',
  allowDecimal = true,
  decimalSymbol = '.',
  decimalLimit = 2,
  integerLimit = null,
  requireDecimal = false,
  allowNegative = false,
  allowLeadingZeroes = false,
  ...props
}) => {
  return (
    <MaskedInput
      {...props}
      mask={createNumberMask({
        prefix: prefix,
        suffix: suffix,
        includeThousandsSeparator: includeThousandsSeparator,
        thousandsSeparatorSymbol: thousandsSeparatorSymbol,
        allowDecimal: allowDecimal,
        decimalLimit: decimalLimit,
        decimalSymbol: decimalSymbol,
        integerLimit: integerLimit,
        requireDecimal: requireDecimal,
        allowNegative: allowNegative,
        allowLeadingZeroes: allowLeadingZeroes,
      })}
      className={`${styles.numberInput} ${containerClass}`}
    />
  );
};
