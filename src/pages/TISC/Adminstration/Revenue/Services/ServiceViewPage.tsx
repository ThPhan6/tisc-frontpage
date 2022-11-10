import { Detail } from './components/Detail';
import { ServiceHeader } from './components/ServiceHeader';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const RevenueViewPage = () => {
  return (
    <ServiceHeader>
      <TableHeader title="SERVICES" rightAction={<CustomPlusButton disabled />} />
      <Detail type="tisc" />
    </ServiceHeader>
  );
};

export default RevenueViewPage;
