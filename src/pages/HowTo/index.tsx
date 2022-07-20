import { Title } from '@/components/Typography';
import { getFAQCurrent } from '@/services/faq.api';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { FaqComponent } from './components/FaqComponent';
import styles from './index.less';
import type { FaqItem } from './types';

const HowTo = () => {
  const [activeKey, setActiveKey] = useState<string>('');
  const [howTo, setHowTo] = useState<FaqItem[]>([]);
  const handleActiveCollapse = (index: number) => {
    setActiveKey(activeKey === String(index) ? '' : String(index));
  };
  const getFAQList = () => {
    getFAQCurrent().then((res) => {
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
        <Col span={12}>
          <div className={styles.form}>
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
