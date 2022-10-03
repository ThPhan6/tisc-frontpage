import { useState } from 'react';

import {
  DEFAULT_MATERIAL_PRODUCT,
  DEFAULT_SUB_MATERIAL_PRODUCT,
  MaterialProductForm,
} from '../type';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const MaterialProductEntryForm = () => {
  const [data, setData] = useState<MaterialProductForm>(DEFAULT_MATERIAL_PRODUCT);
  const handleOnChangeGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      name: e.target.value,
    });
  };

  const handleOnClickAddItem = () => {
    setData({
      ...data,
      subs: [...data.subs, DEFAULT_SUB_MATERIAL_PRODUCT],
    });
  };

  return (
    <div>
      <TableHeader title="MATERIAL/PRODUCT CODE" rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper>
        <FormNameInput
          placeholder="type main list name"
          title="Main List"
          onChangeInput={handleOnChangeGroupName}
          HandleOnClickAddIcon={handleOnClickAddItem}
          inputValue={data.name}
        />
      </EntryFormWrapper>
    </div>
  );
};

export default MaterialProductEntryForm;
