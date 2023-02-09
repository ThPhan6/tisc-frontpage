import { Detail } from '@/features/services/components/Detail';

import { TableHeader } from '@/components/Table/TableHeader';

const BilledServicesDetail = () => {
  return (
    <div>
      <TableHeader title="BILLED SERVICES" />
      <Detail type="brand" />
    </div>
  );
};

export default BilledServicesDetail;
