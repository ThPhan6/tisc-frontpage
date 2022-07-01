import { EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';
import { FC } from 'react';
import styles from '../styles/InspirationalQuotationEntryForm.less';
import { inputProps } from '../types';
import classNames from 'classnames';

interface InspirationalQuotationEntryFormProps {
  value: inputProps;
  onChange: (value: inputProps) => void;
}

export const InspirationalQuotationEntryForm: FC<InspirationalQuotationEntryFormProps> = ({
  value,
  onChange,
}) => {
  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const handleRemoveInput = (key: 'author' | 'identity') => {
    onChange({
      ...value,
      [key]: '',
    });
  };

  return (
    <div className={styles.IQ_container}>
      <EntryFormWrapper>
        <FormGroup label="Author" required={true} layout="vertical" formClass={styles.input_form}>
          <div className={styles.input_field} id="author-input">
            <CustomInput
              placeholder="author name"
              className={classNames(styles.author, value.author && styles.input_item)}
              name="author"
              value={value.author}
              onChange={handleOnChangeInput}
            />
            {value.author && (
              <ActionRemoveIcon
                className={styles.remove_icon}
                onClick={() => handleRemoveInput('author')}
              />
            )}
          </div>
        </FormGroup>
        <FormGroup label="Identity" required={true} layout="vertical" formClass={styles.input_form}>
          <div className={styles.input_field} id="identity-input">
            <CustomInput
              placeholder="author position / role"
              className={classNames(styles.identity, value.identity && styles.input_item)}
              name="identity"
              value={value.identity}
              onChange={handleOnChangeInput}
            />
            {value.identity && (
              <ActionRemoveIcon
                className={styles.remove_icon}
                onClick={() => handleRemoveInput('identity')}
              />
            )}
          </div>
        </FormGroup>
        <FormGroup label="Quotation" required={true} layout="vertical">
          <CustomTextArea
            showCount
            maxLength={120}
            placeholder="type text here"
            className={styles.quotation}
            name="quotation"
            value={value.quotation}
            onChange={handleOnChangeInput}
          />
        </FormGroup>
      </EntryFormWrapper>
    </div>
  );
};
