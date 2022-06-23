import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import OptionEntryForm from './components/OptionsEntryForm';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { IBasisOptionForm } from './types';
import { useBoolean } from '@/helper/hook';
import { getOneBasisOption, updateBasisOption } from './services/api';
import { useState, useEffect } from 'react';
import { useParams } from 'umi';

const CreateOptionPage = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [option, setOption] = useState<IBasisOptionForm>({
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

  const handleCreateOption = (data: IBasisOptionForm) => {
    isLoading.setValue(true);
    updateBasisOption(idBasisOption, data).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 2000);
        setTimeout(() => {
          pushTo(PATH.options);
        }, 1000);
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

export default CreateOptionPage;
