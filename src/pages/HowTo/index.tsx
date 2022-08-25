import { useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import { FaqItem } from '@/features/how-to/type';

import { Title } from '@/components/Typography';
import { FaqComponent } from '@/features/how-to/components/FaqComponent';
import styles from '@/features/how-to/components/index.less';

import { getFAQCurrent } from '@/features/how-to/api';

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
                  customClass={item.question_and_answer?.length === 0 ? styles.customCursor : ''}
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
