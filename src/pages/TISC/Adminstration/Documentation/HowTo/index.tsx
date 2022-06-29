import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabs } from '@/components/Tabs';
import styles from './styles/index.less';
import { TabProp } from '@/components/Tabs/types';
import { useState } from 'react';
import { HowToEntryForm } from './components/HowToEntryForm';
import classNames from 'classnames';
import { IHowToForm } from './types';
import { renderIconByName } from '@/components/Menu/Icon';

const dataPanelHowTo: IHowToForm = {
  tisc: {
    data: [
      {
        title: 'Onboarding Guide',
        description: '',
        FAQ: [],
      },
      {
        title: 'My Workspace',
        icon: renderIconByName('workspace-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'User Group',
        icon: renderIconByName('user-group-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Projects',
        icon: renderIconByName('project-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Products',
        icon: renderIconByName('product-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Adminstration',
        icon: renderIconByName('adminstration-icon.svg'),
        description: '',
        FAQ: [],
      },
    ],
  },
  brands: {
    data: [
      {
        title: 'Onboarding Guide',
        description: '',
        FAQ: [],
      },
      {
        title: 'My Workspace',
        icon: renderIconByName('workspace-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Products',
        icon: renderIconByName('product-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'General Inquires',
        icon: renderIconByName('general-inquire-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Project Tracking',
        icon: renderIconByName('project-tracking-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Adminstration',
        icon: renderIconByName('adminstration-icon.svg'),
        description: '',
        FAQ: [],
      },
    ],
  },
  designers: {
    data: [
      {
        title: 'Onboarding Guide',
        description: '',
        FAQ: [],
      },
      {
        title: 'My Workspace',
        icon: renderIconByName('workspace-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'My Favourites',
        icon: renderIconByName('my-favourite-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Products',
        icon: renderIconByName('product-icon.svg'),
        description: '',
        FAQ: [],
      },
      {
        title: 'Projects',
        icon: renderIconByName('project-icon.svg'),
        description: '',
        FAQ: [],
      },

      {
        title: 'Adminstration',
        icon: renderIconByName('adminstration-icon.svg'),
        description: '',
        FAQ: [],
      },
    ],
  },
};

const HowToPage = () => {
  const listTab: TabProp[] = [
    { tab: 'TISC', key: 'tisc' },
    { tab: 'BRANDS', key: 'brands' },
    { tab: 'DESIGNERS', key: 'designers' },
  ];
  const selectedTab = listTab[0];
  const [activeTab, setActiveTab] = useState<TabProp>(selectedTab);

  const [howTo, setHowTo] = useState<IHowToForm>(dataPanelHowTo);

  return (
    <div className={classNames(styles.howto_container)}>
      <TableHeader title={'HOW TO'} />
      <div className={styles.tabs}>
        <CustomTabs
          listTab={listTab}
          tabPosition="top"
          tabDisplay="space"
          onChange={setActiveTab}
          activeTab={activeTab}
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
