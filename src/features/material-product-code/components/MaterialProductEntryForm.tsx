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
  getOneMaterialProductCode,
  updateMaterialProductCode,
} from '../api';
import { MaterialProductItem } from './MaterialProductItem';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

const MaterialProductEntryForm = () => {
  const [data, setData] = useState<MaterialProductForm>(DEFAULT_MATERIAL_PRODUCT);

  const idMaterialProductCode = useGetParamId();

  const submitButtonStatus = useBoolean();

  useEffect(() => {
    if (idMaterialProductCode) {
      showPageLoading();
      getOneMaterialProductCode(idMaterialProductCode).then((res) => {
        if (res) {
          setData(res);
        }
        hidePageLoading();
      });
    }
  }, []);

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

  const handleOnChangeValue = (value: MaterialProductSubForm, index: number) => {
    const newSubs = [...data['subs']];
    newSubs[index] = value;
    setData({ ...data, subs: newSubs });
  };

  const handleOnClickDelete = (index: number) => {
    const newSubs = [...data['subs']];
    newSubs.splice(index, 1);
    setData({ ...data, subs: newSubs });
  };

  const handleCreate = (dataSubmit: MaterialProductForm) => {
    showPageLoading();
    createMaterialProductCode(dataSubmit).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.designerMaterialProductCode);
        }, 1000);
      }
      hidePageLoading();
    });
  };

  const handleUpdate = (dataSubmit: MaterialProductForm) => {
    showPageLoading();
    updateMaterialProductCode(idMaterialProductCode, dataSubmit).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 2000);
      }
      hidePageLoading();
    });
  };

  const onHandleSubmit = () => {
    // const newSubs = data.subs.map((sub) => {
    //   return {
    //     ...sub,
    //     name: sub.name.trim(),
    //     codes: sub.codes.map((subItem) => {
    //       return {
    //         ...subItem,
    //         code: subItem.code.trim(),
    //         description: subItem.description.trim(),
    //       };
    //     }),
    //   };
    // });

    const handleSubmit = idMaterialProductCode ? handleUpdate : handleCreate;

    // handleSubmit({ name: data.name.trim(), subs: newSubs });
    handleSubmit(data);
  };

  return (
    <div>
      <TableHeader title="MATERIAL/PRODUCT CODE" rightAction={<CustomPlusButton disabled />} />
      <EntryFormWrapper
        handleCancel={() => pushTo(PATH.designerMaterialProductCode)}
        handleSubmit={onHandleSubmit}
        submitButtonStatus={submitButtonStatus.value}>
        <FormNameInput
          placeholder="type main list name"
          title="Main List"
          onChangeInput={handleOnChangeGroupName}
          HandleOnClickAddIcon={handleOnClickAddItem}
          inputValue={data.name}
        />
        {data.subs.map((sub, index) => (
          <MaterialProductItem
            key={index}
            value={sub}
            onChangeValue={(value) => {
              handleOnChangeValue(value, index);
            }}
            handleOnClickDelete={() => handleOnClickDelete(index)}
          />
        ))}
      </EntryFormWrapper>
    </div>
  );
};

export default MaterialProductEntryForm;
