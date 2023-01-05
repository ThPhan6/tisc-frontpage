import { FC } from 'react';

import { RadioValue } from '@/components/CustomRadio/types';
import { useAppSelector } from '@/reducers';

import { CustomRadio } from '@/components/CustomRadio';
import { TableHeader } from '@/components/Table/TableHeader';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { MainTitle } from '@/components/Typography';

import { optionValue } from '../CustomResource';
import styles from '../CustomResource.less';

export const CustomResourceTableHeader: FC<{
  onChange?: (value: RadioValue) => void;
  onClick?: () => void;
  disable?: boolean;
  isMobile?: boolean;
}> = ({ onChange, onClick, disable, isMobile }) => {
  const customResourceType = useAppSelector((state) => state.customResource.customResourceType);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        textTransform: 'capitalize',
        justifyContent: 'space-between',
        flex: 1,
      }}
    >
      {!isMobile && <MainTitle level={4}>View By:</MainTitle>}
      <CustomRadio
        options={optionValue}
        containerClass={`${styles.customRadio} ${disable ? styles.disabledRadio : ''}`}
        value={customResourceType}
        onChange={onChange}
      />
      <CustomPlusButton customClass={styles.button} disabled={disable} onClick={onClick} />
    </div>
  );
};

export const CustomResourceHeader: FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  return (
    <TableHeader
      title={isMobile ? ' ' : 'VENDOR INFORMATION MANAGEMENT'}
      rightAction={<CustomResourceTableHeader disable isMobile={isMobile} />}
      customClass={isMobile ? styles.customHeader : ''}
    />
  );
};
