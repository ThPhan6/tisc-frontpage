import { FC } from 'react';

import { RadioValue } from './types';
import { FormGroupProps } from '@/components/Form/types/index';

import { FormGroup } from '../Form';
import CollapseRadioList from './CollapseRadioList';
import styles from './styles/collapseRadioFormGroup.less';

interface CollapseRadioFormGroupProps extends FormGroupProps {
  label: string;
  optionData: RadioValue[];
  checked?: string | number;
  placeholder?: string;
  otherInput?: boolean;
  onChange?: (checked: RadioValue) => void;
  radioListClass?: string;
  defaultPlaceHolder?: string | number;
  inputPlaceholder?: string;
}

const CollapseRadioFormGroup: FC<CollapseRadioFormGroupProps> = ({
  label,
  placeholder,
  checked,
  optionData,
  otherInput,
  onChange,
  radioListClass = '',
  formClass = '',
  defaultPlaceHolder = 'select from list',
  inputPlaceholder = 'please specify',
  ...props
}) => {
  return (
    <FormGroup
      label={label}
      required={true}
      layout="vertical"
      formClass={`${styles.group} ${placeholder ? styles.activeLabel : ''} ${formClass}`}
      {...props}>
      <CollapseRadioList
        containerClass={`${styles.radioGroup} ${radioListClass}`}
        options={optionData}
        checked={checked}
        onChange={onChange}
        placeholder={placeholder || defaultPlaceHolder}
        otherInput={otherInput}
        inputPlaceholder={inputPlaceholder}
      />
    </FormGroup>
  );
};

export default CollapseRadioFormGroup;
