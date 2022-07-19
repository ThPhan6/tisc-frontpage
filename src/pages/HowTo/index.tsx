import { Title } from '@/components/Typography';
import { getAllFAQ } from '@/services/faq.api';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { FaqComponent } from './components/FaqComponent';
import styles from './index.less';
import type { FaqItem } from './types';
import { getUserInfoMiddleware } from '@/pages/LandingPage/services/api';

const HowTo = () => {
  const [activeKey, setActiveKey] = useState<string>('');
  const [howTo, setHowTo] = useState<FaqItem[]>([]);

  const handleActiveCollapse = (id: string) => () => {
    setActiveKey(activeKey === id ? '' : id);
  };

  const getFAQList = (type: number) => {
    getAllFAQ(type).then((res) => {
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
    const getTypeFAQ = async () => {
      const user = await getUserInfoMiddleware();
      return user.type + 1;
    };
    getTypeFAQ().then((typeFAQ) => {
      getFAQList(typeFAQ);
    });
  }, []);
  return (
    <div className={styles.content}>
      <Row>
        <Col span={12}>
          <div className={styles.form}>
            <div className={styles.title}>
              <Title level={8}>HOW-TO</Title>
            </div>
            <div className={styles.list}>
              {howTo.map((item, index) => (
                <FaqComponent
                  value={item}
                  key={index}
                  activeKey={activeKey}
                  handleActiveCollapse={handleActiveCollapse(item.id)}
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
