import { FC } from 'react';

import { FormGroup } from '../Form';
import CollapseRadioList, { CollapseRadioListProps } from './CollapseRadioList';
import styles from './styles/collapseRadioFormGroup.less';

interface CollapseRadioFormGroupProps extends CollapseRadioListProps {
  label: string;
  formClass?: string;
  radioListClass?: string;
  defaultPlaceHolder?: string | number;
}

const CollapseRadioFormGroup: FC<CollapseRadioFormGroupProps> = ({
  label,
  formClass,
  placeholder,
  radioListClass = '',
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
    >
      <CollapseRadioList
        containerClass={`${styles.radioGroup} ${radioListClass}`}
        placeholder={placeholder || defaultPlaceHolder}
        inputPlaceholder={inputPlaceholder}
        {...props}
      />
    </FormGroup>
  );
};

export default CollapseRadioFormGroup;
