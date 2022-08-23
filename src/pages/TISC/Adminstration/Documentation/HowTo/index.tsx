import { FC, useEffect, useState } from 'react';

import { getAllFAQ, updateFAQ } from '@/services/faq.api';

import { FaqState } from './types';
import type { TabItem } from '@/components/Tabs/types';
import { AllFaqState } from '@/types/faq.type';

import { HowToEntryForm } from './components/HowToEntryForm';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabs } from '@/components/Tabs';

import styles from './styles/index.less';

interface HowToPageProps {
  containerClass?: string;
}

const intialState = {
  brand: { expandedIndex: -1, value: [] },
  design: { expandedIndex: -1, value: [] },
  tisc: { expandedIndex: -1, value: [] },
};

const HowToPage: FC<HowToPageProps> = ({ containerClass }) => {
  const listTab: TabItem[] = [
    { tab: 'TISC', key: 'tisc' },
    { tab: 'BRANDS', key: 'brand' },
    { tab: 'DESIGNERS', key: 'design' },
  ];
  const selectedTab = listTab[0].key;
  const [howTo, setHowTo] = useState<AllFaqState>(intialState);
  const [activeTab, setActiveTab] = useState<string>(selectedTab);

  const getFAQList = () => {
    getAllFAQ().then((res) => {
      setHowTo({
        brand: {
          expandedIndex: -1,
          value: res.brand,
        },
        design: {
          expandedIndex: -1,
          value: res.design,
        },
        tisc: {
          expandedIndex: -1,
          value: res.tisc,
        },
      });
    });
  };

  useEffect(() => {
    getFAQList();
  }, []);

  const onSubmit = () => {
    updateFAQ(
      (howTo[activeTab] as FaqState).value.map((faq) => {
        return {
          ...faq,
          document: {
            ...faq.document,
            document: faq.document.document ? faq.document.document.trim() : '',
            question_and_answer:
              faq.document.question_and_answer?.map((sub) => {
                return {
                  ...sub,
                  question: sub.question.trim(),
                  answer: sub.answer.trim(),
                };
              }) ?? [],
          },
        };
      }),
    );
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
          setHowTo((prevState) => {
            return {
              ...prevState,
              [activeTab]: value,
            };
          });
        }}
        onSubmit={onSubmit}
        submitButtonStatus={true}
      />
    </div>
  );
};

export default HowToPage;
