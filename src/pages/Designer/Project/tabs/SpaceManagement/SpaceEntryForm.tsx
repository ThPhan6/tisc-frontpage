import React from 'react';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { ProjectSpaceZone } from '@/types';
import { DefaultProjectArea } from '../../constants/form';
import styles from '../../styles/space-management.less';

interface SpaceEntryFormProps {
  data: ProjectSpaceZone;
  setData: (data: ProjectSpaceZone) => void;
  handleSubmit?: () => void;
  handleCancel?: () => void;
  submitButtonStatus?: boolean;
}
const SpaceEntryForm: React.FC<SpaceEntryFormProps> = (props) => {
  const { data, setData, handleSubmit, handleCancel, submitButtonStatus = false } = props;

  const addMoreArea = () => {
    const newArea = [...data.area, DefaultProjectArea];
    setData({
      ...data,
      area: newArea,
    });
  };

  const onChangeZoneName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      name: e.target.value,
    });
  };

  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      submitButtonStatus={submitButtonStatus}
      customClass={styles.spaceEntryForm}
      contentClass="space-form-content-wrapper"
    >
      <FormNameInput
        placeholder="type zone name"
        title="Zone"
        onChangeInput={onChangeZoneName}
        HandleOnClickAddIcon={addMoreArea}
        inputValue={data.name}
      />
    </EntryFormWrapper>
  );
};

export default SpaceEntryForm;
