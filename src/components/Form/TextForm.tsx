import { FC } from 'react';
import { BodyText } from '../Typography';
import { FormGroup } from './index';
import { TextFormProps } from './types';
import styles from './styles/textForm.less';

const TextForm: FC<TextFormProps> = ({
  label,
  labelColor = 'mono-color-medium',
  children,
  fontLevel = 5,
  fontFamily = 'Roboto',
  layout = 'vertical',
  bodyTextClass = '',
  formClass = '',
  boxShadow = false,
  ...props
}) => {
  return (
    <FormGroup
      label={label}
      labelColor={labelColor}
      layout={layout}
      formClass={formClass}
      {...props}
    >
      <BodyText
        level={fontLevel}
        fontFamily={fontFamily}
        customClass={`${styles.content} ${bodyTextClass} ${boxShadow ? styles.boxShadow : ''}`}
      >
        {children}
      </BodyText>
    </FormGroup>
  );
};

export default TextForm;
