import { useAppSelector } from '@/reducers';

import { CustomRadio } from '@/components/CustomRadio';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { MainTitle } from '@/components/Typography';

import { optionValue } from '../CustomResource';
import styles from '../CustomResource.less';

export const CustomResourceHeader = () => {
  const customResourceType = useAppSelector((state) => state.customResource.customResourceType);

  return (
    <TableHeader
      title="VENDOR INFORMATION MANAGEMENT"
      rightAction={
        <div style={{ display: 'flex', alignItems: 'center', textTransform: 'capitalize' }}>
          <MainTitle level={4}>View By:</MainTitle>
          <CustomRadio
            options={optionValue}
            containerClass={`${styles.customRadio} ${styles.disabledRadio}`}
            value={customResourceType}
          />
          <CustomPlusButton customClass={styles.button} disabled />
        </div>
      }
    />
  );
};
