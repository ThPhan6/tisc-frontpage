import { Detail } from '@/features/services/components/Detail';
import { ServiceHeader } from '@/features/services/components/ServiceHeader';
import { useScreen } from '@/helper/common';

import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

const ServiceViewPage = () => {
  const { isTablet } = useScreen();
  return (
    <ServiceHeader>
      <TableHeader title="SERVICES" rightAction={isTablet ? null : <CustomPlusButton disabled />} />
      <Detail type="tisc" />
    </ServiceHeader>
  );
};

export default ServiceViewPage;
