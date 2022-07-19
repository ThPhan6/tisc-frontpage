import { ReactComponent as WorkspaceIcon } from '@/assets/icons/workspace-icon.svg';
import { ReactComponent as ProductIcon } from '@/assets/icons/product-icon.svg';
import { ReactComponent as UserGroup } from '@/assets/icons/user-group-icon.svg';
import { ReactComponent as ProjectIcon } from '@/assets/icons/project-icon.svg';
import { ReactComponent as AdminstrationIcon } from '@/assets/icons/adminstration-icon.svg';
import styles from './index.less';
import { Col, Row } from 'antd';
import { Title } from '@/components/Typography';
import { FaqComponent } from './components/FaqComponent';
import { useState } from 'react';

const HowTo = () => {
  const data = [
    {
      id: '1',
      title: 'Onboarding Guide',
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat',
      question_and_answer: [
        {
          id: '2',
          question: 'How to view product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae  dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
        {
          id: '3',
          question: 'How to share product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
      ],
    },
    {
      id: '4',
      icon: <WorkspaceIcon />,
      title: 'My Workspace',
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat',
      question_and_answer: [
        {
          id: '5',
          question: 'How to view product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae  dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
        {
          id: '6',
          question: 'How to share product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
      ],
    },
    {
      id: '7',
      icon: <UserGroup />,
      title: 'User Group',
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat',
      question_and_answer: [
        {
          id: '8',
          question: 'How to view product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae  dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
        {
          id: '9',
          question: 'How to share product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
      ],
    },
    {
      id: '10',
      icon: <ProjectIcon />,
      title: 'Project Tracking',
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat',
    },
    {
      id: '11',
      icon: <ProductIcon />,
      title: 'Products',
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat',
    },
    { id: '12', icon: <AdminstrationIcon />, title: 'Adminstration' },
  ];

  const [activeKey, setActiveKey] = useState<string>('');

  const handleActiveCollapse = (id: string) => () => {
    setActiveKey(activeKey === id ? '' : id);
  };

  return (
    <div className={styles.content}>
      <Row>
        <Col span={12}>
          <div className={styles.form}>
            <div className={styles.title}>
              <Title level={8}>HOW-TO</Title>
            </div>
            <div className={styles.list}>
              {data.map((item, index) => (
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
