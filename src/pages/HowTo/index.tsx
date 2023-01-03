import { useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import { getCurrentFAQ } from '@/features/how-to/services';
import { useScreen } from '@/helper/common';

import { Faq } from '@/features/how-to/types';

import { Title } from '@/components/Typography';
import { FaqComponent } from '@/features/how-to/components/HowTo/FaqComponent';
import styles from '@/features/how-to/components/HowTo/index.less';

const HowTo = () => {
  const { isMobile } = useScreen();
  const [activeKey, setActiveKey] = useState<string>('');
  const [howTo, setHowTo] = useState<Faq[]>([]);
  const handleActiveCollapse = (index: number) => {
    setActiveKey(activeKey === String(index) ? '' : String(index));
  };
  const getFAQList = () => {
    getCurrentFAQ().then((res) => {
      const data = res.map((item) => {
        return {
          id: item.id,
          icon: item.logo,
          title: item.title,
          document: item.document.document,
          question_and_answer: item.document.question_and_answer,
        };
      });
      setHowTo(data);
    });
  };
  useEffect(() => {
    getFAQList();
  }, []);
  return (
    <div className={styles.content}>
      <Row>
        <Col span={isMobile ? 24 : 12}>
          <div className={styles.form} style={{ height: isMobile ? screen.height - 72 : '' }}>
            <div className={styles.title}>
              <Title level={8}>HOW-TO</Title>
            </div>
            <div className={styles.list}>
              {howTo.map((item, index) => (
                <FaqComponent
                  key={item.id}
                  index={index}
                  value={item}
                  activeKey={activeKey}
                  handleActiveCollapse={handleActiveCollapse}
                  customClass={
                    item.question_and_answer?.length === 0 && !item.document
                      ? styles.customCursor
                      : ''
                  }
                />
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HowTo;
