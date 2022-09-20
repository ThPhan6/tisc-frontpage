import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { useParams } from 'umi';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getOneBasisOption, updateBasisOption } from '@/services';

import { BasisOptionForm } from '@/types';

import OptionEntryForm from './components/OptionsEntryForm';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const UpdateOptionPage = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [option, setOption] = useState<BasisOptionForm>({
    name: '',
    subs: [],
  });
  const params = useParams<{ id: string }>();
  const idBasisOption = params?.id || '';

  const getBasisOptionData = () => {
    getOneBasisOption(idBasisOption).then((res) => {
      if (res) {
        setOption(res);
      }
    });
  };

  const handleCancel = () => {
    pushTo(PATH.options);
  };

  const handleCreateOption = (data: BasisOptionForm) => {
    isLoading.setValue(true);
    updateBasisOption(idBasisOption, data).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 2000);
        getBasisOptionData();
      }
      isLoading.setValue(false);
    });
  };

  useEffect(() => {
    getBasisOptionData();
  }, []);

  return (
    <div>
      <TableHeader title={'OPTIONS'} rightAction={<CustomPlusButton disabled />} />
      <div>
        <OptionEntryForm
          option={option}
          setOption={setOption}
          onCancel={handleCancel}
          onSubmit={handleCreateOption}
          submitButtonStatus={submitButtonStatus.value}
        />
      </div>
    </div>
  );
};

export default UpdateOptionPage;
