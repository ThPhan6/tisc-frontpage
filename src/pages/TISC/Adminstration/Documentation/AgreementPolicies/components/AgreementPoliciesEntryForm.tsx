import { contentId, EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';
import styles from '../styles/AgreementPoliciesEntryForm.less';
import { AgreementPoliciesProps } from '../../../../../../types/agreement-policy.type';
import React, { FC } from 'react';
import { CustomEditorInput } from '@/components/Form/CustomEditorInput';
import { REGEX_GET_CONTENT_ONLY } from '@/helper/utils';

interface AgreementPolicies {
  value: AgreementPoliciesProps;
  onChange: (value: AgreementPoliciesProps) => void;
}

export const EmailAutoRespondEntryForm: FC<AgreementPolicies> = ({ value, onChange }) => {
  const handleOnChangeTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, title: e.target.value });
  };
  const handleRemoveTitleInput = () => {
    onChange({ ...value, title: '' });
  };

  /// only get content entered
  const handleOnChangeMessageInput = (html: string) => {
    onChange({ ...value, message: html.replace(REGEX_GET_CONTENT_ONLY, '') });
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

        <FormGroup label="Document" required={true} layout="vertical" formClass={styles.editor} />

        {/* do not wrap CustomEditorInout component inside FormGroup */}
        <CustomEditorInput
          onChangeText={(input) => handleOnChangeMessageInput(input)}
          placeholder="type text..."
          containerSelector={`#${contentId}`}
        />
      </EntryFormWrapper>
    </div>
  );
};
