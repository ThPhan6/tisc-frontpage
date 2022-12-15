import { Detail } from '@/features/services/components/Detail';
import { ServiceHeader } from '@/features/services/components/ServiceHeader';
import { useGetParamId } from '@/helper/hook';

import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const ServiceViewPage = () => {
  const itemId = useGetParamId();

  return (
    <ServiceHeader>
      <TableHeader title="SERVICES" rightAction={<CustomPlusButton disabled />} />
      <Detail type="tisc" id={itemId} />
    </ServiceHeader>
  );
};

export default ServiceViewPage;
