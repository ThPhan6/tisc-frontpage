import { createContext, useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { message } from 'antd';
import { useHistory } from 'umi';

import {
  DynamicObjectProps,
  FormGroupContext,
  FormOptionGroupHeaderContext,
  ProductBasisFormType,
  useProductBasicEntryForm,
} from '../../Basis/hook';
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
import { isNull, isUndefined, uniqueId } from 'lodash';

import type { AttributeContentType, AttributeForm, AttributeSubForm } from '@/types';

import { FormOptionNameInput } from '../../Basis/Option/components/FormOptionNameInput';
import { MainOptionItem } from '../../Basis/Option/components/OptionItem';
import { DragEndResultProps } from '@/components/Drag';
import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { getNewDataAfterDragging } from '../../Basis/util';
import styles from './AttributeEntryForm.less';
import { AttributeItem } from './AttributeItem';
import ContentTypeModal from './ContentTypeModal';

export const AttributeEntryFormContext = createContext<{
  openContentTypeModal: boolean;
  setOpenContentTypeModal: (openContentTypeModal: boolean) => void;
  contentTypeSelected: AttributeSubForm;
  setContentTypeSelected: (contentType: AttributeSubForm) => void;
}>({
  openContentTypeModal: false,
  setOpenContentTypeModal: () => null,
  contentTypeSelected: {
    basis_id: '',
    name: '',
  },
  setContentTypeSelected: () => null,
});
const DEFAULT_ATTRIBUTE: AttributeForm = {
  name: '',
  subs: [],
  count: 0,
};

const AttributeEntryForm = () => {
  const { renderProductBasicEntryForm } = useProductBasicEntryForm(ProductBasisFormType.attributes);

  // for content type modal
  // for content type data
  const [contentType, setContentType] = useState<AttributeContentType>({
    conversions: [],
    options: [],
    presets: [],
    texts: [],
    feature_presets: [],
  });
  // selected content types
  // const [selectedItem, setSelectedItem] = useState<SelectedItem>(DEFAULT_SELECTED_ATTRIBUTE);

  const [contentTypeSelected, setContentTypeSelected] = useState<AttributeSubForm>({
    basis_id: '',
    name: '',
  });

  const [openContentTypeModal, setOpenContentTypeModal] = useState<boolean>(false);

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
    // if (idAttribute) {
    //   getAttributeData();
    // }
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

  const onContentTypeSubmit = (changedSub: Omit<AttributeSubForm, 'id' | 'name'>) => {
    // if (selectedItem) {
    //   const newSubs = [...data.subs];
    //   /// overwrite new subs
    //   newSubs[selectedItem.index] = {
    //     ...newSubs[selectedItem.index],
    //     ...changedSub,
    //   };
    //   /// overwrite data
    //   setData({
    //     ...data,
    //     subs: newSubs,
    //   });
    // }
    // // reset selected item
    // setSelectedItem(DEFAULT_SELECTED_ATTRIBUTE);
    // // close modal
    // setVisible(false);
  };

  // const handleSelectContentType = (subAttribute: AttributeSubForm, index: number) => {
  //   setSelectedItem({
  //     subAttribute,
  //     index,
  //   });
  //   setVisible(true);
  // };

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
    updateAttribute(idAttribute, submitData).then((res) => {
      isLoading.setValue(false);
      submitButtonStatus.setValue(true);
      setTimeout(() => {
        submitButtonStatus.setValue(false);
      }, 1000);

      setData(res);
      // return getAttributeData();
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
    <AttributeEntryFormContext.Provider
      value={{
        contentTypeSelected,
        openContentTypeModal,
        setOpenContentTypeModal,
        setContentTypeSelected,
      }}
    >
      {renderProductBasicEntryForm()}

      <ContentTypeModal
        visible={openContentTypeModal}
        setVisible={setOpenContentTypeModal}
        contentType={contentType}
        onSubmit={onContentTypeSubmit}
        type={attributeLocation.TYPE}
      />
    </AttributeEntryFormContext.Provider>
  );
};

export default AttributeEntryForm;
