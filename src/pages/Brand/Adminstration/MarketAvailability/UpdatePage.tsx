import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { useParams } from 'umi';

import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';

import { MarketAvailabilityDetails } from '@/features/market-availability/type';

import LoadingPageCustomize from '@/components/LoadingPage';
import { TableHeader } from '@/components/Table/TableHeader';
import { MarketAvailabilityEntryForm } from '@/features/market-availability/components/MarketAvailabilityEntryForm';

import {
  getMarketAvailabilityByCollectionId,
  updateMarketAvailabilityByCollectionId,
} from '@/features/market-availability/api';

const UpdateMarketAvailabilityPage = () => {
  const submitButtonStatus = useBoolean(false);
  const isLoading = useBoolean(false);
  const params = useParams<{
    id: string;
  }>();
  const collectionId = params?.id || '';
  // using as temprorary variable, waitting data to set state
  const [data, setData] = useState<MarketAvailabilityDetails>({
    collection_id: collectionId,
    collection_name: '',
    total_available: 0,
    total: 0,
    regions: [],
  });

  const goBackToMarketAvailabilityList = () => {
    pushTo(PATH.marketAvailability);
  };

  const onSubmit = (submitData: string[]) => {
    isLoading.setValue(true);
    updateMarketAvailabilityByCollectionId(collectionId, submitData).then((isSuccess) => {
      isLoading.setValue(false);
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 1000);
        return;
      }
    });
  };

  useEffect(() => {
    isLoading.setValue(true);
    getMarketAvailabilityByCollectionId(collectionId).then((res) => {
      if (res) {
        setData(res);
        isLoading.setValue(false);
      }
    });
  }, []);

  return (
    <div>
      <TableHeader title="MARKET AVAILABILITY" />
      <MarketAvailabilityEntryForm
        data={data}
        setData={setData}
        onCancel={goBackToMarketAvailabilityList}
        onSubmit={onSubmit}
        submitButtonStatus={submitButtonStatus.value}
      />
      {isLoading.value && <LoadingPageCustomize />}
    </div>
  );
};

export default UpdateMarketAvailabilityPage;
