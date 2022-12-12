import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';

import { pushTo } from '@/helper/history';
import { useBoolean, useGetParamId } from '@/helper/hook';

import {
  MarketAvailabilityDetails,
  PayloadUpdateAvailibity,
} from '@/features/market-availability/type';

import { TableHeader } from '@/components/Table/TableHeader';
import { MarketAvailabilityEntryForm } from '@/features/market-availability/components/MarketAvailabilityEntryForm';

import { hidePageLoading, showPageLoading } from '@/features/loading/loading';
import {
  getMarketAvailabilityByCollectionId,
  updateMarketAvailabilityByCollectionId,
} from '@/features/market-availability/api';

const UpdateMarketAvailabilityPage = () => {
  const submitButtonStatus = useBoolean(false);
  const collectionId = useGetParamId();
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

  const onSubmit = (submitData: PayloadUpdateAvailibity[]) => {
    showPageLoading();
    updateMarketAvailabilityByCollectionId(collectionId, submitData).then((isSuccess) => {
      hidePageLoading();
      if (isSuccess) {
        submitButtonStatus.setValue(true);
        setTimeout(() => {
          submitButtonStatus.setValue(false);
        }, 1000);
      }
    });
  };

  useEffect(() => {
    showPageLoading();
    getMarketAvailabilityByCollectionId(collectionId).then((res) => {
      if (res) {
        setData(res);
        hidePageLoading();
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
    </div>
  );
};

export default UpdateMarketAvailabilityPage;
