import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabs } from '@/components/Tabs';
import type { TabItem } from '@/components/Tabs/types';
import { getFAQ, updateFAQ } from '@/services/faq.api';
import { FC, useEffect, useState } from 'react';
import { HowToEntryForm } from './components/HowToEntryForm';
import styles from './styles/index.less';
import type { FaqForm, FaqItems } from './types';

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
  // const [howTo, setHowTo] = useState<FaqForm>(howToPagePanel);
  const [howTo, setHowTo] = useState<FaqForm>({
    tisc: {
      data: [],
    },
    brands: {
      data: [],
    },
    designers: {
      data: [],
    },
  });

  const getFAQList = (type: number) => {
    getFAQ(type).then((res) => {
      const data = res.map((item) => {
        return {
          id: item.id,
          icon: item.logo,
          title: item.title,
          description: item.document.document,
          FAQ: item.document.question_and_answer,
        };
      });
      setHowTo({
        tisc: {
          data,
        },
        brands: {
          data,
        },
        designers: {
          data,
        },
      });
    });
  };

  useEffect(() => {
    switch (activeTab) {
      case 'tisc':
        return getFAQList(2);
      case 'brands':
        return getFAQList(3);
      case 'designers':
        return getFAQList(4);
      default:
        return;
    }
  }, [activeTab]);

  const handleUpdateFAQ = (dataUpdate: FaqItems) => {
    updateFAQ(dataUpdate.data).then((res: any) => {
      setHowTo(res);
    });
  };

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
        onSubmit={handleUpdateFAQ}
        submitButtonStatus={true}
      />
    </div>
  );
};

export default HowToPage;
