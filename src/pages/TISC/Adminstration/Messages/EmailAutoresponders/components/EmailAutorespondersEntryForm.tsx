import { EntryFormWrapper, idChildren } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';
import styles from '../styles/EmailAutorespondersEntryForm.less';
import { IEmailAutoRadioListProps, IEmailAutoRespondForm } from '@/types';
import React, { FC } from 'react';
import { CustomRadio } from '@/components/CustomRadio';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { useDrag } from '../utils/useDrag';
import { CustomEditorInput } from '@/components/Form/CustomEditorInput';

interface EmailAutoRespondProps {
  value: IEmailAutoRespondForm;
  onChange: (value: IEmailAutoRespondForm) => void;
  onCancel: () => void;
  onSubmit: (data: IEmailAutoRespondForm) => void;
  submitButtonStatus: boolean;
  topicList: IEmailAutoRadioListProps[];
  targetedForList: IEmailAutoRadioListProps[];
}

export const EmailAutoRespondEntryForm: FC<EmailAutoRespondProps> = ({
  value,
  onChange,
  onCancel,
  onSubmit,
  submitButtonStatus,
  topicList,
  targetedForList,
}) => {
  /// for dragging radio item
  const { dragStart, dragStop, onWheel, handleDrag } = useDrag();

  const handleOnChangeTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, title: e.target.value });
  };
  const handleRemoveTitleInput = () => {
    onChange({ ...value, title: '' });
  };

  /// only get content entered
  const handleOnChangeMessageInput = (html: string) => {
    // onChange({ ...value, message: html });
    onChange({ ...value, message: html });
  };

  const handleOnChangeRadio = (
    typeRadio: 'topic' | 'targeted_for',
    valueRadio: string | number,
  ) => {
    onChange({
      ...value,
      [typeRadio]: valueRadio,
    });
  };

  const handleSubmitData = () => {
    onSubmit(value);
  };

  return (
    <div className={styles.container}>
      <EntryFormWrapper
        handleCancel={onCancel}
        handleSubmit={handleSubmitData}
        submitButtonStatus={submitButtonStatus}
      >
        {/* Topic */}
        <FormGroup label="Topic" required={true} layout="vertical" formClass={styles.radio_form}>
          <div onMouseLeave={() => dragStop}>
            <ScrollMenu
              onWheel={onWheel}
              onMouseDown={() => dragStart}
              onMouseMove={handleDrag}
              onMouseUp={() => dragStop}
            >
              {topicList.map((item) => (
                <CustomRadio
                  direction="horizontal"
                  value={value.topic}
                  onChange={(radioValue) => handleOnChangeRadio('topic', radioValue.value)}
                  options={[{ value: item.value, label: item.key }]}
                  containerClass={styles.radio_container}
                  key={item.value}
                />
              ))}
            </ScrollMenu>
          </div>
        </FormGroup>

        {/* Targeted For */}
        <FormGroup
          label="Targeted For"
          required={true}
          layout="vertical"
          formClass={styles.radio_form}
        >
          <div onMouseLeave={() => dragStop}>
            <ScrollMenu
              onWheel={onWheel}
              onMouseDown={() => dragStart}
              onMouseMove={handleDrag}
              onMouseUp={() => dragStop}
            >
              {targetedForList.map((item) => (
                <CustomRadio
                  key={item.value}
                  direction="horizontal"
                  value={value.targeted_for}
                  onChange={(radioValue) => handleOnChangeRadio('targeted_for', radioValue.value)}
                  options={[{ value: item.value, label: item.key }]}
                  containerClass={styles.radio_container}
                />
              ))}
            </ScrollMenu>
          </div>
        </FormGroup>

        {/* Title */}
        <FormGroup label="Title" required={true} layout="vertical" formClass={styles.title}>
          <div className={styles.title_field}>
            <CustomInput
              borderBottomColor="mono-medium"
              placeholder="message title"
              onChange={handleOnChangeTitleInput}
              value={value.title}
              className={value.title && styles.title_input}
            />
            {value.title && (
              <ActionRemoveIcon className={styles.remove_icon} onClick={handleRemoveTitleInput} />
            )}
          </div>
        </FormGroup>

        {/* Message */}
        {value.message && (
          <CustomEditorInput
            onChangeText={handleOnChangeMessageInput}
            initData={value.message}
            containerSelector={`#${idChildren}`}
          />
        )}
      </EntryFormWrapper>
    </div>
  );
};
