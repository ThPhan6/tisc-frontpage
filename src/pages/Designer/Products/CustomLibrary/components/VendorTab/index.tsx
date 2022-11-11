import { useState } from 'react';

import { ContactAddressProps, ContactAddressRequestBody } from '../../types';

import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import '../index.less';
import { ContactAndAddressTab } from './ContactAndAddressTab';
import styles from './index.less';

const LIST_TAB = [
  { tab: 'Brand Contact & Address', key: 'brand' },
  { tab: 'Distributor Contact & Address', key: 'distributor' },
];

const DEFAULT_INFO: ContactAddressProps = {
  id: '',
  company_id: '',
  country_id: '',
  state_id: '',
  city_id: '',
  website: '',
  address: '',
  postal_code: '',
  contacts: [],
};

const DEFAULT_STATE: ContactAddressRequestBody = {
  brand: DEFAULT_INFO,
  distributor: DEFAULT_INFO,
};

export const VendorTab = () => {
  const [activeKey, setActiveKey] = useState('brand');
  const [data, setData] = useState<ContactAddressRequestBody>(DEFAULT_STATE);

  const onChangeData =
    (fieldName: keyof ContactAddressRequestBody) => (newData: ContactAddressProps) => {
      setData((prevState) => ({
        ...prevState,
        [fieldName]: newData,
      }));
    };

  return (
    <>
      <div className={styles.contactAddressContainer}>
        <CustomTabs
          listTab={LIST_TAB}
          activeKey={activeKey}
          centered={true}
          tabPosition="top"
          tabDisplay="space"
          onChange={(key) => setActiveKey(key)}
        />

        <CustomTabPane active={activeKey === 'brand'}>
          <ContactAndAddressTab
            activeKey="brand"
            data={data.brand}
            setData={onChangeData('brand')}
          />
        </CustomTabPane>

        <CustomTabPane active={activeKey === 'distributor'}>
          <ContactAndAddressTab
            activeKey="distributor"
            data={data.distributor}
            setData={onChangeData('distributor')}
          />
        </CustomTabPane>
      </div>
    </>
  );
};
