import { Detail } from '@/features/services/components/Detail';
import { ServiceHeader } from '@/features/services/components/ServiceHeader';

import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const ServiceViewPage = () => {
  return (
    <ServiceHeader>
      <TableHeader title="SERVICES" rightAction={<CustomPlusButton disabled />} />
      <Detail type="tisc" />
    </ServiceHeader>
  );
};

export default ServiceViewPage;
