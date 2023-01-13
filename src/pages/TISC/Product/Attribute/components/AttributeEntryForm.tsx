import { useEffect, useState } from 'react';

import { useHistory } from 'umi';

import { useAttributeLocation } from '../hooks/location';
import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';
import {
  createAttribute,
  deleteAttribute,
  getOneAttribute,
  getProductAttributeContentType,
  updateAttribute,
} from '@/services';

import store from '@/reducers';
import { closeModal, openModal } from '@/reducers/modal';
import type { AttributeContentType, AttributeForm, AttributeSubForm } from '@/types';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { AttributeItem } from './AttributeItem';

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

const DEFAULT_ATTRIBUTE: AttributeForm = {
  name: '',
  subs: [],
};

const AttributeEntryForm = () => {
  // for content type data
  const [contentType, setContentType] = useState<AttributeContentType>({
    conversions: [],
    options: [],
    presets: [],
    texts: [],
  });
  // selected content types
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(DEFAULT_SELECTED_ATTRIBUTE);

  const history = useHistory();
  const [data, setData] = useState<AttributeForm>(DEFAULT_ATTRIBUTE);
  const { activePath, attributeLocation } = useAttributeLocation();
  const isLoading = useBoolean();

  const idAttribute = useGetParamId();
  const isUpdate = idAttribute ? true : false;
  const submitButtonStatus = useBoolean(false);

  const getAttributeData = () => {
    getOneAttribute(idAttribute).then((res) => {
      if (res) {
        setData(res);
      }
    });
  };

  // load data content type
  useEffect(() => {
    getProductAttributeContentType().then((contentTypeData) => {
      if (contentTypeData) {
        setContentType(contentTypeData);
      }
    });
    if (idAttribute) {
      getAttributeData();
    }
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
    closeModal();
  };

  const handleSelectContentType = (subAttribute: AttributeSubForm, index: number) => {
    const curSelectedItem = {
      subAttribute,
      index,
    };
    setSelectedItem(curSelectedItem);

    store.dispatch(
      openModal({
        type: 'Product Attribute Type',
        title: 'Select content type',
        props: {
          productAttributeType: {
            selectedItem: curSelectedItem,
            contentType,
            onSubmit: onContentTypeSubmit,
            type: attributeLocation.TYPE,
          },
        },
      }),
    );
  };

  const handleCreateData = (submitData: AttributeForm) => {
    isLoading.setValue(true);
    createAttribute(submitData).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(activePath);
        }, 1000);
      }
    });
  };

  const handleUpdateData = (submitData: AttributeForm) => {
    isLoading.setValue(true);
    updateAttribute(idAttribute, submitData).then((isSuccess) => {
      isLoading.setValue(false);
      submitButtonStatus.setValue(true);
      setTimeout(() => {
        submitButtonStatus.setValue(false);
      }, 2000);
      if (isSuccess) {
        return getAttributeData();
      }
    });
  };

  const handleSubmit = isUpdate ? handleUpdateData : handleCreateData;

  const onHandleSubmit = () => {
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
    handleSubmit({ ...data, type: attributeLocation.TYPE, subs: newSubs });
  };

  const handleDeleteAttribute = () => {
    deleteAttribute(idAttribute).then((isSuccess) => {
      if (isSuccess) {
        pushTo(activePath);
      }
    });
  };

  return (
    <div>
      <TableHeader title={attributeLocation.NAME} rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        handleSubmit={onHandleSubmit}
        handleCancel={history.goBack}
        submitButtonStatus={submitButtonStatus.value}
        handleDelete={handleDeleteAttribute}
        entryFormTypeOnMobile={isUpdate ? 'edit' : 'create'}
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
      </EntryFormWrapper>
    </div>
  );
};

export default AttributeEntryForm;
