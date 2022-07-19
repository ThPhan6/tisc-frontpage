import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabs } from '@/components/Tabs';
import styles from './styles/index.less';
import { TabItem } from '@/components/Tabs/types';
import { FC, useState } from 'react';
import { HowToEntryForm } from './components/HowToEntryForm';
import { FaqForm } from './types';
import { howToPagePanel } from '@/constants/util';

interface HowToPageProps {
  containerClass?: string;
}

const HowToPage: FC<HowToPageProps> = ({ containerClass }) => {
  const listTab: TabItem[] = [
    { tab: 'TISC', key: 'tisc' },
    { tab: 'BRANDS', key: 'brands' },
    { tab: 'DESIGNERS', key: 'designers' },
  ];
  const selectedTab = listTab[0].key;
  const [activeTab, setActiveTab] = useState<string>(selectedTab);

  const [howTo, setHowTo] = useState<FaqForm>(howToPagePanel);

  return (
    <div className={`${styles.howto_container} ${containerClass}`}>
      <TableHeader title={'HOW TO'} />
      <div className={styles.tabs}>
        <CustomTabs
          listTab={listTab}
          tabPosition="top"
          tabDisplay="start"
          onChange={setActiveTab}
          activeKey={activeTab}
          widthItem={'125px'}
        />
      </div>
      <HowToEntryForm
        value={howTo[activeTab]}
        onChange={(value) => {
          setHowTo({
            ...howTo,
            [activeTab]: value,
          });
        }}
      />
    </div>
  );
};

export default HowToPage;
