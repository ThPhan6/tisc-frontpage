import { CustomInput } from '@/components/Form/CustomInput';
import { FC, useState } from 'react';
import { ItemWebsiteProp } from '../types';
import { ReactComponent as LeftIcon } from '@/assets/icons/pagination-right-18px.svg';
import styles from '@/pages/Brand/Adminstration/BrandProfile/styles/index.less';
import CountryModal from '../../Distributors/components/CountryModal';
export const ItemWebsite: FC<ItemWebsiteProp> = ({ websiteValue, onChange }) => {
  const [countryVisible, setCountryVisible] = useState(false);
  const [countryValue, setCountryValue] = useState<string>('');

  const handOnChangeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...websiteValue, url: e.target.value });
  };

  const onChangeCountryValue = (chosenValue: any, country_id: string) => {
    onChange({ ...websiteValue, [country_id]: chosenValue.value });
    setCountryValue(chosenValue.label);
  };

  return (
    <>
      <div className={styles.bottomWebsite}>
        <CustomInput
          placeholder="target country"
          containerClass={styles.customInput}
          disabled
          value={countryValue.split(' ')[0]}
        />
        <div className={styles.icon}>
          <LeftIcon onClick={() => setCountryVisible(true)} />
        </div>
        <CustomInput
          placeholder="paste site URL link here"
          onChange={handOnChangeItem}
          value={websiteValue.url}
        />
      </div>
      <CountryModal
        visible={countryVisible}
        setVisible={setCountryVisible}
        chosenValue={{ label: countryValue, value: websiteValue.country_id }}
        setChosenValue={(chosenValue) => onChangeCountryValue(chosenValue, 'country_id')}
        phone_code
      />
    </>
  );
};
