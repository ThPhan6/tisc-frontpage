import { TableHeader } from '@/components/Table/TableHeader';
import { PATH } from '@/constants/path';
import { pushTo } from '@/helper/history';
import { useBoolean } from '@/helper/hook';
import { useState } from 'react';
import { MarketAvailabilityEntryForm } from './components/MarketAvailabilityEntryForm';

const UpdateMarketAvailabilityPage = () => {
  const submitButtonStatus = useBoolean(false);

  // using as temprorary variable, waitting data to set state
  const [chosenCountry, setChosenCountry] = useState<any[]>([]);

  const handleCancel = () => {
    pushTo(PATH.marketAvailability);
  };

  const handleUpdateAvailability = () => {};

  return (
    <div>
      <TableHeader title="MARKET AVAILABILITY" />
      <MarketAvailabilityEntryForm
        value={chosenCountry}
        onChange={setChosenCountry}
        onCancel={handleCancel}
        onSubmit={handleUpdateAvailability}
        submitButtonStatus={submitButtonStatus.value}
      />
    </div>
  );
};

export default UpdateMarketAvailabilityPage;
