import { EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomInputEditor } from '@/components/Form/InputEditor';
import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';

import styles from '../styles/EmailAutorespondersEntryForm.less';
import { EmailAutoRespondProps } from '../types';
import React, { FC } from 'react';

interface EmailAutoRespond {
  value: EmailAutoRespondProps;
  onChange: (value: EmailAutoRespondProps) => void;
}

export const EmailAutoRespondEntryForm: FC<EmailAutoRespond> = ({ value, onChange }) => {
  const handleOnChangeTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, title: e.target.value });
  };
  const handleRemoveTitleInput = () => {
    onChange({ ...value, title: '' });
  };

  /// only get content entered
  const handleOnChangeMessageInput = (input: { text: string; html: string }) => {
    onChange({ ...value, message: input.text.replace(/[_.\n\s\r\t__]*/g, '') });
  };

  return (
    <div className={styles.container}>
      <EntryFormWrapper>
        <FormGroup label="Title" required={true} layout="vertical" formClass={styles.title}>
          <div className={styles.title_field}>
            <CustomInput
              borderBottomColor="mono-medium"
              placeholder="document title"
              onChange={handleOnChangeTitleInput}
              value={value.title}
              className={value.title && styles.title_input}
            />
            {value.title && (
              <ActionRemoveIcon className={styles.remove_icon} onClick={handleRemoveTitleInput} />
            )}
          </div>
        </FormGroup>
        <CustomInputEditor
          label="Document"
          required={true}
          placeholder="type text..."
          layout="vertical"
          formClass={styles.label_editor}
          inputClass={styles.input_editor}
          handleOnChange={(input) => handleOnChangeMessageInput(input)}
        />
      </EntryFormWrapper>
    </div>
  );
};
