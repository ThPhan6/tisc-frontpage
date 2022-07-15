import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabs } from '@/components/Tabs';
import styles from './styles/index.less';
import { TabProp } from '@/components/Tabs/types';
import { FC, useState } from 'react';
import { HowToEntryForm } from './components/HowToEntryForm';
import classNames from 'classnames';
import { IHowToForm } from './types';
import { howToPagePanel } from '@/constants/util';

interface IHowToPage {
  containerClass?: string;
}

const HowToPage: FC<IHowToPage> = ({ containerClass }) => {
  const listTab: TabProp[] = [
    { tab: 'TISC', key: 'tisc' },
    { tab: 'BRANDS', key: 'brands' },
    { tab: 'DESIGNERS', key: 'designers' },
  ];
  const selectedTab = listTab[0];
  const [activeTab, setActiveTab] = useState<TabProp>(selectedTab);

  const [howTo, setHowTo] = useState<IHowToForm>(howToPagePanel);

  return (
    <div className={classNames(styles.howto_container, containerClass)}>
      <TableHeader title={'HOW TO'} />
      <div className={styles.tabs}>
        <CustomTabs
          listTab={listTab}
          tabPosition="top"
          tabDisplay="start"
          onChange={setActiveTab}
          activeTab={activeTab}
          widthItem={'125px'}
        />
      </div>
      <HowToEntryForm
        value={howTo[activeTab.key]}
        onChange={(value) => {
          setHowTo({
            ...howTo,
            [activeTab.key]: value,
          });
        }}
      />
    </div>
  );
};

export default HowToPage;
