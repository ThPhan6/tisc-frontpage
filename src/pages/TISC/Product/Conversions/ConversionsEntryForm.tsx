import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { useState } from 'react';
import { ConversionItem } from './ConversionItem';
import { conversionValueDefault, ConversionValueProp } from './types';
import styles from './styles/ConversionsEntryForm.less';

export const ConversionsEntryForm = () => {
  const [conversions, setConversions] = useState<ConversionValueProp[]>([]);

  const handleOnChangeValue = (value: ConversionValueProp, index: number) => {
    const newConversions = [...conversions];
    newConversions[index] = value;
    setConversions(newConversions);
  };

  const handleOnClickDelete = (index: number) => {
    const newConversions = [...conversions];
    newConversions.splice(index, 1);
    setConversions(newConversions);
  };

  return (
    <EntryFormWrapper>
      <FormNameInput
        placeholder="type group name"
        title="Conversion Group"
        HandleOnClickAddIcon={() => {
          setConversions([...conversions, conversionValueDefault]);
        }}
      />
      <div className={styles.conversions_wrapper}>
        {conversions.map((conversion, index) => (
          <ConversionItem
            key={index}
            value={conversion}
            onChangeValue={(value) => {
              handleOnChangeValue(value, index);
            }}
            handleOnClickDelete={() => handleOnClickDelete(index)}
          />
        ))}
      </div>
    </EntryFormWrapper>
  );
};
