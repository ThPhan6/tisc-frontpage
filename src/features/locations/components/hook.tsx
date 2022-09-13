import { useState } from 'react';

import { pushTo } from '@/helper/history';

import { LocationForm } from '../type';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import LocationEntryForm from './LocationEntryForm';

const useLocationInfo = (
  tableLink: string,
  submitButtonStatus: boolean,
  isLoading: boolean,
  onSubmit: (submitData: LocationForm) => void,
) => {
  const [data, setData] = useState<LocationForm>({
    business_name: '',
    business_number: '',
    functional_type_ids: [],
    country_id: '',
    state_id: '',
    city_id: '',
    address: '',
    postal_code: '',
    general_phone: '',
    general_email: '',
  });

  const goBackToLocationList = () => {
    pushTo(tableLink);
  };

  const renderLocationTable = () => (
    <div>
      <TableHeader title="LOCATIONS" rightAction={<CustomPlusButton disabled />} />
      <LocationEntryForm
        submitButtonStatus={submitButtonStatus}
        onSubmit={onSubmit}
        onCancel={goBackToLocationList}
        data={data}
        setData={setData}
      />
      {isLoading && <LoadingPageCustomize />}
    </div>
  );

  return { renderLocationTable, setData };
};

export default useLocationInfo;
