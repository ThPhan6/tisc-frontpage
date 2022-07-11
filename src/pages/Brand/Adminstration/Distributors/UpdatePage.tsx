import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { TableHeader } from '@/components/Table/TableHeader';

const UpdatePage = () => {
  return (
    <div>
      <TableHeader title="DISTRIBUTORS" rightAction={<CustomPlusButton disabled />} />
    </div>
  );
};
export default UpdatePage;
