import { CustomInput } from '@/components/Form/CustomInput';
import { FC, useEffect, useState } from 'react';
import { WebsiteUrl } from '../types';
import { ReactComponent as LeftIcon } from '@/assets/icons/pagination-right-18px.svg';
import styles from '@/pages/Brand/Adminstration/BrandProfile/styles/index.less';
import CountryModal from '@/components/Location/CountryModal';
import { ReactComponent as DeleteIcon } from '@/assets/icons/action-remove-icon.svg';

export const ItemWebsite: FC<WebsiteUrl> = ({ websiteValue, onChange }) => {
  const [countryVisible, setCountryVisible] = useState(false);
  const [countryValue, setCountryValue] = useState({ label: '', value: websiteValue.country_id });

  const handOnChangeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...websiteValue, url: e.target.value });
  };

  useEffect(() => {
    if (countryValue.value !== '') {
      onChange({ ...websiteValue, country_id: countryValue.value });
    }
  }, [countryValue]);

  return (
    <>
      <div className={styles.bottomWebsite}>
        <CustomInput
          placeholder="target country"
          containerClass={styles.customInput}
          disabled
          value={countryValue.label}
        />
        <div className={styles.icon}>
          <LeftIcon onClick={() => setCountryVisible(true)} />
        </div>
        <CustomInput
          placeholder="paste site URL link here"
          containerClass={styles.customInputURL}
          onChange={handOnChangeItem}
          value={websiteValue.url}
        />
        <div>
          <DeleteIcon
            onClick={() => onChange({ ...websiteValue, url: '' })}
            className={styles.iconDelete}
          />
        </div>
      </div>

      <CountryModal
        visible={countryVisible}
        setVisible={setCountryVisible}
        chosenValue={countryValue}
        setChosenValue={setCountryValue}
        withPhoneCode
      />
    </>
  );
};
