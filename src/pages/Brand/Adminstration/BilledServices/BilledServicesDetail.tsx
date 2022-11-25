import { Detail } from '@/features/services/components/Detail';
import { useGetParamId } from '@/helper/hook';

import { TableHeader } from '@/components/Table/TableHeader';

const BilledServicesDetail = () => {
  const itemId = useGetParamId();

  return (
    <div>
      <TableHeader title="BILLED SERVICES" />
      <Detail type="brand" id={itemId} />
    </div>
  );
};

export default BilledServicesDetail;
