import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';

import {
  DEFAULT_MATERIAL_PRODUCT,
  DEFAULT_SUB_MATERIAL_PRODUCT,
  MaterialProductForm,
  MaterialProductSubForm,
} from '../type';

import { EntryFormWrapper } from '@/components/EntryForm';
import { FormNameInput } from '@/components/EntryForm/FormNameInput';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import {
  createMaterialProductCode,
  deleteMaterialProductCode,
  getOneMaterialProductCode,
  updateMaterialProductCode,
} from '../api';
import { MaterialProductItem } from './MaterialProductItem';

const MaterialProductEntryForm = () => {
  const [data, setData] = useState<MaterialProductForm>(DEFAULT_MATERIAL_PRODUCT);

  const idMaterialProductCode = useGetParamId();

  const submitButtonStatus = useBoolean();

  useEffect(() => {
    if (idMaterialProductCode) {
      getOneMaterialProductCode(idMaterialProductCode).then((res) => {
        if (res) {
          setData(res);
        }
      });
    }
  }, []);

  const handleChangeGroupName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      name: e.target.value,
    });
  };

  const handleClickAddItem = () => {
    setData({
      ...data,
      subs: [...data.subs, DEFAULT_SUB_MATERIAL_PRODUCT],
    });
  };

  const handleChangeValue = (value: MaterialProductSubForm, index: number) => {
    const newSubs = [...data['subs']];
    newSubs[index] = value;
    setData({ ...data, subs: newSubs });
  };

  const handleClickDelete = (index: number) => {
    const newSubs = [...data['subs']];
    newSubs.splice(index, 1);
    setData({ ...data, subs: newSubs });
  };

  const handleCreate = (dataSubmit: MaterialProductForm) => {
    createMaterialProductCode(dataSubmit).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.designerMaterialProductCode);
        }, 1000);
      }
    });
  };

  const handleUpdate = (dataSubmit: MaterialProductForm) => {
    updateMaterialProductCode(idMaterialProductCode, dataSubmit).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 2000);
      }
    });
  };

  const onHandleSubmit = () => {
    const newSubs = data.subs.map((sub) => {
      return {
        ...sub,
        name: sub.name.trim(),
        codes: sub.codes.map((subItem) => {
          return {
            ...subItem,
            code: subItem.code.trim(),
            description: subItem.description.trim(),
          };
        }),
      };
    });

    const handleSubmit = idMaterialProductCode ? handleUpdate : handleCreate;

    handleSubmit({ name: data.name.trim(), subs: newSubs });
  };

  const handleDeleteMaterialProductCode = () => {
    if (idMaterialProductCode) {
      deleteMaterialProductCode(idMaterialProductCode).then((isSuccess) => {
        if (isSuccess) {
          pushTo(PATH.designerMaterialProductCode);
        }
      });
    }
  };

  return (
    <div>
      <TableHeader title="MATERIAL/PRODUCT CODE" rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        handleCancel={() => pushTo(PATH.designerMaterialProductCode)}
        handleSubmit={onHandleSubmit}
        handleDelete={handleDeleteMaterialProductCode}
        submitButtonStatus={submitButtonStatus.value}
        entryFormTypeOnMobile={idMaterialProductCode ? 'edit' : 'create'}
      >
        <FormNameInput
          placeholder="type main list name"
          title="Main List"
          onChangeInput={handleChangeGroupName}
          handleOnClickAddIcon={handleClickAddItem}
          inputValue={data.name}
        />
        {data.subs.map((sub, index) => (
          <MaterialProductItem
            key={index}
            value={sub}
            onChangeValue={(value) => {
              handleChangeValue(value, index);
            }}
            handleClickDelete={() => handleClickDelete(index)}
          />
        ))}
      </EntryFormWrapper>
    </div>
  );
};

export default MaterialProductEntryForm;
