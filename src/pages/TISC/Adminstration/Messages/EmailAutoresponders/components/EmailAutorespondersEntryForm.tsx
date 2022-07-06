import { EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomInputEditor } from '@/components/Form/InputEditor';
import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';
import styles from '../styles/EmailAutorespondersEntryForm.less';
import { EmailAutoRespondProps } from '../types';
import React, { FC } from 'react';
import { CustomRadio } from '@/components/CustomRadio';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { useDrag } from '../utils/useDrag';

interface EmailAutoRespond {
  value: EmailAutoRespondProps;
  onChange: (value: EmailAutoRespondProps) => void;
}

const optionsRadio = {
  topic: [
    { label: 'Marketing', value: '1' },
    { label: 'Messages', value: '2' },
  ],
  targetedFor: [
    { label: 'TISC Team', value: '1' },
    { label: 'Brand', value: '2' },
    { label: 'Design Firm', value: '3' },
    { label: 'Distributor', value: '4' },
  ],
};

export const EmailAutoRespondEntryForm: FC<EmailAutoRespond> = ({ value, onChange }) => {
  /// for dragging radio item
  const { dragStart, dragStop, onWheel, handleDrag } = useDrag();

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

  const handleOnChangeRadio = (typeRadio: 'topic' | 'targetedFor', valueRadio: string | number) => {
    onChange({
      ...value,
      [typeRadio]: valueRadio,
    });
  };

  return (
    <div className={styles.container}>
      <EntryFormWrapper>
        <FormGroup label="Topic" required={true} layout="vertical" formClass={styles.radio_form}>
          <div onMouseLeave={() => dragStop}>
            <ScrollMenu
              onWheel={onWheel}
              onMouseDown={() => dragStart}
              onMouseMove={handleDrag}
              onMouseUp={() => dragStop}
            >
              {optionsRadio.topic.map((item) => (
                <CustomRadio
                  direction="horizontal"
                  value={value.topic}
                  onChange={(radioValue) => handleOnChangeRadio('topic', radioValue.value)}
                  options={[item]}
                  containerClass={styles.radio_container}
                />
              ))}
            </ScrollMenu>
          </div>
        </FormGroup>
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
              {optionsRadio.targetedFor.map((item) => (
                <CustomRadio
                  direction="horizontal"
                  value={value.targetedFor}
                  onChange={(radioValue) => handleOnChangeRadio('targetedFor', radioValue.value)}
                  options={[item]}
                  containerClass={styles.radio_container}
                />
              ))}
            </ScrollMenu>
          </div>
        </FormGroup>
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
        <CustomInputEditor
          label="Message"
          required={true}
          placeholder="type text here"
          layout="vertical"
          formClass={styles.label_editor}
          inputClass={styles.input_editor}
          handleOnChange={(input) => handleOnChangeMessageInput(input)}
        />
      </EntryFormWrapper>
    </div>
  );
};
