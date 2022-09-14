import { PageContainer } from '@ant-design/pro-layout';

import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import BrandEntryForm from '@/features/user-group/components/BrandEntryForm';
import MenuHeaderSummary from '@/features/user-group/components/MenuHeaderSummary';

const BrandCreatePage = () => {
  return (
    <PageContainer pageHeaderRender={() => <MenuHeaderSummary type="brand" />}>
      <TableHeader title="BRANDS" rightAction={<CustomPlusButton disabled />} />
      <BrandEntryForm />
    </PageContainer>
  );
};

export default BrandCreatePage;
