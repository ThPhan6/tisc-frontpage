import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { COVERAGE_BEYOND, GENDER } from '@/constants/util';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId, useLoadingAction } from '@/helper/hook';

import { DistributorForm } from '@/features/distributors/type';

import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { DistributorsEntryForm } from '@/features/distributors/components/DistributorsEntryForm';

import {
  createDistributor,
  getOneDistributor,
  updateDistributor,
} from '@/features/distributors/api';

const DEFAULT_DISTRIBUTOR: DistributorForm = {
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
  gender: GENDER.male,
  email: '',
  phone: '',
  mobile: '',
  authorized_country_ids: [],
  authorized_countries: [],
  coverage_beyond: COVERAGE_BEYOND.notAllow,
};

const UpdatePage = () => {
  const { loadingAction, setSpinningActive, setSpinningInActive } = useLoadingAction();
  const [data, setData] = useState<DistributorForm>(DEFAULT_DISTRIBUTOR);
  const [loadedData, setLoadedData] = useState(false);

  const submitButtonStatus = useBoolean(false);

  const idDistributor = useGetParamId();
  const isUpdate = idDistributor ? true : false;

  useEffect(() => {
    if (idDistributor) {
      getOneDistributor(idDistributor).then((res) => {
        if (res) {
          setData(res);
          setLoadedData(true);
        }
      });
    }
  }, []);

  const goBackToDistributorList = () => {
    pushTo(PATH.distributors);
  };

  const onSubmit = (submitData: DistributorForm) => {
    setSpinningActive();

    if (isUpdate) {
      updateDistributor(idDistributor, submitData).then((isSuccess) => {
        setSpinningInActive();
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(() => {
            submitButtonStatus.setValue(false);
          }, 1000);
        }
      });
    } else {
      createDistributor(submitData).then((isSuccess) => {
        setSpinningInActive();
        if (isSuccess) {
          submitButtonStatus.setValue(true);
          setTimeout(goBackToDistributorList, 1000);
        }
      });
    }
  };

  if (isUpdate && !loadedData) {
    return null;
  }

  return (
    <div>
      <TableHeader title="DISTRIBUTORS" rightAction={<CustomPlusButton disabled />} />
      <div>
        <DistributorsEntryForm
          data={data}
          setData={setData}
          onSubmit={onSubmit}
          onCancel={goBackToDistributorList}
          submitButtonStatus={submitButtonStatus.value}
        />
      </div>
      {loadingAction}
    </div>
  );
};
export default UpdatePage;
