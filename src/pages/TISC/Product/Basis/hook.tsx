import { FC } from 'react';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

interface ProductBasicProps {
  type: 'CONVERSIONS' | 'PRESETS' | 'OPTIONS';
  handleSubmit?: () => void;
  handleCancel?: () => void;
  submitButtonStatus?: boolean;
  onChangeInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleOnClickAddIcon?: () => void;
  inputValue?: string;
  isLoading?: boolean;
}

export const ProductBasicEntryForm: FC<ProductBasicProps> = ({
  type,
  handleSubmit,
  handleCancel,
  submitButtonStatus,
  onChangeInput,
  handleOnClickAddIcon,
  inputValue,
  isLoading,
  children,
}) => {
  const getEntryFormTitle = () => {
    if (type === 'CONVERSIONS') {
      return 'Conversion Group';
    }
    return type === 'PRESETS' ? 'Preset Group' : 'Option Group';
  };

  return (
    <div>
      <TableHeader title={`${type}`} rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        submitButtonStatus={submitButtonStatus}>
        <FormNameInput
          placeholder="type group name"
          title={getEntryFormTitle()}
          onChangeInput={onChangeInput}
          HandleOnClickAddIcon={handleOnClickAddIcon}
          inputValue={inputValue}
        />
        {children}
      </EntryFormWrapper>
      {isLoading ? <LoadingPageCustomize /> : null}
    </div>
  );
};
