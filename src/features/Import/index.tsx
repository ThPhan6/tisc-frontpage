import { ExportCSV } from '@/features/Import/components/Export';
import { ImportCSV } from '@/features/Import/components/Import';

export const Import = () => {
  return (
    <div>
      <ImportCSV />
      <ExportCSV />
    </div>
  );
};
