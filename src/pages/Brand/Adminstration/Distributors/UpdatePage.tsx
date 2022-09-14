import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { useParams } from 'umi';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { DistributorForm } from '@/features/distributors/type';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { DistributorsEntryForm } from '@/features/distributors/components/DistributorsEntryForm';

import { DEFAULT_DISTRIBUTOR } from './CreatePage';
import { getOneDistributor, updateDistributor } from '@/features/distributors/api';

const UpdatePage = () => {
  const [data, setData] = useState<DistributorForm>(DEFAULT_DISTRIBUTOR);
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean();
  const params = useParams<{ id: string }>();
  const idDistributor = params?.id || '';
  const [loadedData, setLoadedData] = useState(false);

  const getDistributorData = () => {
    getOneDistributor(idDistributor).then((res) => {
      if (res) {
        setData(res);
      }
      setLoadedData(true);
    });
  };

  useEffect(() => {
    getDistributorData();
  }, []);

  const handleUpdate = (submitData: DistributorForm) => {
    isLoading.setValue(true);
    updateDistributor(idDistributor, submitData).then((isSuccess) => {
      isLoading.setValue(false);
      submitButtonStatus.setValue(true);
      setTimeout(() => {
        submitButtonStatus.setValue(false);
      }, 2000);
      if (isSuccess) {
        return getDistributorData();
      }
    });
  };

  const handleCancel = () => {
    pushTo(PATH.distributors);
  };

  if (!loadedData) {
    return null;
  }

  return (
    <div>
      <TableHeader title="DISTRIBUTORS" rightAction={<CustomPlusButton disabled />} />
      <div>
        <DistributorsEntryForm
          data={data}
          setData={setData}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          submitButtonStatus={submitButtonStatus.value}
        />
      </div>
      {isLoading.value ? <LoadingPageCustomize /> : null}
    </div>
  );
};
export default UpdatePage;
