import { EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { FC } from 'react';
import styles from '../styles/InspirationalQuotationEntryForm.less';
import { Quotation } from '@/types';
import InputGroup from '@/components/EntryForm/InputGroup';

interface QuotationEntryFormProps {
  value: Quotation;
  onChange: (value: Quotation) => void;
  onCancel: () => void;
  onSubmit: (value: Quotation) => void;
  submitButtonStatus: boolean;
}

export const InspirationalQuotationEntryForm: FC<QuotationEntryFormProps> = ({
  value,
  onChange,
  onCancel,
  onSubmit,
  submitButtonStatus,
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

  const handleSubmitData = () => {
    return onSubmit({
      author: value.author.trim(),
      identity: value.identity.trim(),
      quotation: value.quotation.trim(),
    });
  };

  return (
    <div className={styles.IQ_container}>
      <EntryFormWrapper
        handleCancel={onCancel}
        handleSubmit={handleSubmitData}
        submitButtonStatus={submitButtonStatus}
      >
        {/* author */}
        <InputGroup
          label="Author"
          required
          colorPrimaryDark
          colorRequired="tertiary"
          placeholder="author name"
          name="author"
          value={value.author}
          onChange={handleOnChangeInput}
          deleteIcon
          onDelete={() => handleRemoveInput('author')}
          hasPadding
          hasHeight
          fontLevel={3}
        />

        {/* identity */}
        <InputGroup
          label="Identity"
          required
          colorPrimaryDark
          colorRequired="tertiary"
          placeholder="author position / role"
          name="identity"
          value={value.identity}
          onChange={handleOnChangeInput}
          deleteIcon
          onDelete={() => handleRemoveInput('identity')}
          hasPadding
          hasHeight
          fontLevel={3}
        />

        {/* quotation */}
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
