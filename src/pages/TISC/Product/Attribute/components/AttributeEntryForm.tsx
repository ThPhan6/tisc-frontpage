import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { AttributeItem } from './AttributeItem';
import ContentTypeModal from './ContentTypeModal';
import { getProductAttributeContentType } from '../services/api';
import type { IAttributeForm, IAttributeSubForm, IAttributeContentType } from '../types';

interface IAttributeEntryForm {
  type: number;
  submitButtonStatus: any;
  onSubmit: (data: IAttributeForm) => void;
  onCancel: () => void;
  data: IAttributeForm;
  setData: (data: IAttributeForm) => void;
}
export interface ISelectedItem {
  subAttribute: IAttributeSubForm;
  index: number;
}

const DEFAULT_SUB_ATTRIBUTE: IAttributeSubForm = {
  name: '',
  basis_id: '',
};
const DEFAULT_SELECTED_ATTRIBUTE: ISelectedItem = {
  index: 0,
  subAttribute: DEFAULT_SUB_ATTRIBUTE,
};
// conversionValue,
// setConversionValue,
// onCancel,
// onSubmit,
// submitButtonStatus,

const AttributeEntryForm: FC<IAttributeEntryForm> = (props) => {
  const { type, submitButtonStatus, onSubmit, onCancel, data, setData } = props;
  // for content type modal
  const [visible, setVisible] = useState(false);
  // for content type data
  const [contentType, setContentType] = useState<IAttributeContentType>();
  // selected content types
  const [selectedItem, setSelectedItem] = useState<ISelectedItem>(DEFAULT_SELECTED_ATTRIBUTE);
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

  const handleSelectContentType = (subAttribute: IAttributeSubForm, index: number) => {
    setSelectedItem({
      subAttribute,
      index,
    });
    setVisible(true);
  };

  const onContentTypeSubmit = (changedSub: Omit<IAttributeSubForm, 'id' | 'name'>) => {
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
    const newSubs: IAttributeSubForm[] = data.subs.map((sub) => {
      if (sub.id) {
        return {
          id: sub.id,
          name: sub.name,
          basis_id: sub.basis_id,
        };
      }
      return {
        name: sub.name,
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
      submitButtonStatus={submitButtonStatus}
    >
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
