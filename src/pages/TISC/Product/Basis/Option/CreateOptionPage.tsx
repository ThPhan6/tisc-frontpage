import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import OptionEntryForm from './components/OptionsEntryForm';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { IBasisOptionForm } from '@/types';
import { useBoolean } from '@/helper/hook';
import { createOptionMiddleWare } from '@/services';
import { useState } from 'react';

const CreateOptionPage = () => {
  const isLoading = useBoolean();
  const submitButtonStatus = useBoolean(false);
  const [option, setOption] = useState<IBasisOptionForm>({
    name: '',
    subs: [],
  });

  const handleCancel = () => {
    pushTo(PATH.options);
  };

  const handleCreateOption = (data: IBasisOptionForm) => {
    isLoading.setValue(true);

    createOptionMiddleWare(data).then((isSuccess) => {
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          pushTo(PATH.options);
        }, 1000);
      }
      isLoading.setValue(false);
    });
  };

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
