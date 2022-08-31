import type { FC } from 'react';
import { useEffect, useState } from 'react';

import { getProductAttributeContentType } from '@/services';

import type { AttributeContentType, AttributeForm, AttributeSubForm } from '@/types';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';

import { AttributeItem } from './AttributeItem';
import ContentTypeModal from './ContentTypeModal';

interface AttributeEntryFormProps {
  type: number;
  submitButtonStatus: any;
  onSubmit: (data: AttributeForm) => void;
  onCancel: () => void;
  data: AttributeForm;
  setData: (data: AttributeForm) => void;
}
export interface SelectedItem {
  subAttribute: AttributeSubForm;
  index: number;
}

const DEFAULT_SUB_ATTRIBUTE: AttributeSubForm = {
  name: '',
  basis_id: '',
};
const DEFAULT_SELECTED_ATTRIBUTE: SelectedItem = {
  index: 0,
  subAttribute: DEFAULT_SUB_ATTRIBUTE,
};
// conversionValue,
// setConversionValue,
// onCancel,
// onSubmit,
// submitButtonStatus,

const AttributeEntryForm: FC<AttributeEntryFormProps> = (props) => {
  const { type, submitButtonStatus, onSubmit, onCancel, data, setData } = props;
  // for content type modal
  const [visible, setVisible] = useState(false);
  // for content type data
  const [contentType, setContentType] = useState<AttributeContentType>();
  // selected content types
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(DEFAULT_SELECTED_ATTRIBUTE);
  // load data content type
  useEffect(() => {
    getProductAttributeContentType().then((contentTypeData) => {
      if (contentTypeData) {
        setContentType(contentTypeData);
      }
    });
  }, []);

  const handleOnChangeGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      name: e.target.value,
    });
  };

  const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newSubs = [...data.subs];
    /// overwrite new subs
    newSubs[index] = {
      ...newSubs[index],
      name: e.target.value,
    };
    /// overwrite data
    setData({
      ...data,
      subs: newSubs,
    });
  };

  const handleOnClickDelete = (index: number) => {
    const newSub = [...data.subs];
    newSub.splice(index, 1);
    setData({
      ...data,
      subs: newSub,
    });
  };

  const addSubAttribute = () => {
    setData({
      ...data,
      subs: [...data.subs, DEFAULT_SUB_ATTRIBUTE],
    });
  };

  const handleSelectContentType = (subAttribute: AttributeSubForm, index: number) => {
    setSelectedItem({
      subAttribute,
      index,
    });
    setVisible(true);
  };

  const onContentTypeSubmit = (changedSub: Omit<AttributeSubForm, 'id' | 'name'>) => {
    if (selectedItem) {
      const newSubs = [...data.subs];
      /// overwrite new subs
      newSubs[selectedItem.index] = {
        ...newSubs[selectedItem.index],
        ...changedSub,
      };
      /// overwrite data
      setData({
        ...data,
        subs: newSubs,
      });
    }
    // reset selected item
    setSelectedItem(DEFAULT_SELECTED_ATTRIBUTE);
    // close modal
    setVisible(false);
  };

  const handleSubmit = () => {
    const newSubs: AttributeSubForm[] = data.subs.map((sub) => {
      if (sub.id) {
        return {
          id: sub.id,
          name: sub.name.trim(),
          basis_id: sub.basis_id,
        };
      }
      return {
        name: sub.name.trim(),
        basis_id: sub.basis_id,
      };
    });
    onSubmit({
      ...data,
      type: type,
      subs: newSubs,
    });
  };

  return (
    <EntryFormWrapper
      handleSubmit={handleSubmit}
      handleCancel={onCancel}
      submitButtonStatus={submitButtonStatus}>
      <FormNameInput
        placeholder="type group name"
        title="Attribute Group"
        onChangeInput={handleOnChangeGroupName}
        HandleOnClickAddIcon={addSubAttribute}
        inputValue={data.name}
      />
      <div>
        {data.subs.map((subAttribute, index) => (
          <AttributeItem
            key={index}
            item={subAttribute}
            onChangeItemName={(e) => handleOnChangeName(e, index)}
            handleSelectContentType={() => handleSelectContentType(subAttribute, index)}
            handleOnClickDelete={() => handleOnClickDelete(index)}
          />
        ))}
      </div>
      {visible ? (
        <ContentTypeModal
          setVisible={setVisible}
          selectedItem={selectedItem}
          contentType={contentType}
          onSubmit={onContentTypeSubmit}
          type={type}
        />
      ) : null}
    </EntryFormWrapper>
  );
};

export default AttributeEntryForm;
