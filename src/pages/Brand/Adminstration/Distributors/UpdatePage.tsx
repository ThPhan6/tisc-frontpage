import LoadingPageCustomize from '@/components/LoadingPage';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableHeader } from '@/components/Table/TableHeader';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { getOneDistributor, updateDistributor } from '@/services';
import { DistributorDetail, DistributorForm } from '@/types/distributor.type';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { DistributorsEntryForm } from './components/DistributorsEntryForm';

const DEFAULT_DISTRIBUTOR: DistributorDetail = {
  brand_id: '',
  name: '',
  country_id: '',
  state_id: '',
  city_id: '',
  address: '',
  phone_code: '',
  postal_code: '',
  first_name: '',
  last_name: '',
  gender: true,
  email: '',
  phone: '',
  mobile: '',
  authorized_country_ids: [],
  authorized_countries: [],
  coverage_beyond: true,
};

const UpdatePage = () => {
  const [data, setData] = useState<DistributorDetail>(DEFAULT_DISTRIBUTOR);
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
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};
export default UpdatePage;
