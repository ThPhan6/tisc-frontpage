import { FC } from 'react';

import { CheckboxValue } from './types';
import { FormGroupProps } from '@/components/Form/types/index';

import { FormGroup } from '../Form';
import CollapseCheckboxList from './CollapseCheckboxList';
import styles from './styles/collapseCheckBoxListFormGroup.less';

interface CollapseCheckBoxListFormGroupProps extends FormGroupProps {
  label: string;
  optionData: CheckboxValue[];
  checked?: CheckboxValue[];
  placeholder?: string;
  otherInput?: boolean;
  onChange?: (checked: CheckboxValue[]) => void;
  checkBoxClass?: string;
  defaultPlaceHolder?: string;
  inputPlaceholder?: string;
}

const CollapseCheckBoxListFormGroup: FC<CollapseCheckBoxListFormGroupProps> = ({
  label,
  placeholder,
  checked,
  optionData,
  otherInput,
  onChange,
  checkBoxClass = '',
  formClass = '',
  defaultPlaceHolder = 'select from the list',
  inputPlaceholder = 'type here',
  ...props
}) => {
  return (
    <FormGroup
      label={label}
      required={true}
      layout="vertical"
      formClass={`${styles.group} ${placeholder !== '' ? styles.activeLabel : ''} ${formClass}`}
      {...props}>
      <CollapseCheckboxList
        containerClass={`${styles.CheckboxGroup} ${checkBoxClass}`}
        options={optionData}
        checked={checked}
        onChange={onChange}
        placeholder={placeholder === '' ? defaultPlaceHolder : placeholder}
        otherInput={otherInput}
        inputPlaceholder={inputPlaceholder}
      />
    </FormGroup>
  );
};

export default CollapseCheckBoxListFormGroup;
