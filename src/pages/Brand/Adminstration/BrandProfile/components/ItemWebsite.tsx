import { CustomInput } from '@/components/Form/CustomInput';
import { FC } from 'react';
import { ItemWebsiteProp } from '../types';
import { ReactComponent as LeftIcon } from '@/assets/icons/pagination-right-18px.svg';
import styles from '@/pages/Brand/Adminstration/BrandProfile/styles/index.less';
export const ItemWebsite: FC<ItemWebsiteProp> = ({ value, onChange }) => {
  const handOnChangeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, url: e.target.value });
  };

  return (
    <div className={styles.bottomWebsite}>
      <CustomInput placeholder="target country" containerClass={styles.customInput} disabled />
      <div className={styles.icon}>
        <LeftIcon />
      </div>
      <CustomInput placeholder="paste site URL link here" onChange={handOnChangeItem} />
    </div>
  );
};
