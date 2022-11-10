import { TableHeader } from '@/components/Table/TableHeader';
import { Detail } from '@/pages/TISC/Adminstration/Revenue/Services/components/Detail';

const BilledServicesDetail = () => {
  return (
    <div>
      <TableHeader title="BILLED SERVICES" />
      <Detail type="brand" />
    </div>
  );
};

export default BilledServicesDetail;
