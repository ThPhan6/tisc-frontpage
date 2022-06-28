import { ReactComponent as WorkspaceIcon } from '@/assets/icons/workspace-icon.svg';
import { ReactComponent as ProductIcon } from '@/assets/icons/product-icon.svg';
import { ReactComponent as UserGroup } from '@/assets/icons/user-group-icon.svg';
import { ReactComponent as ProjectIcon } from '@/assets/icons/project-icon.svg';
import { ReactComponent as AdminstrationIcon } from '@/assets/icons/adminstration-icon.svg';
import styles from './index.less';
import { Col, Row } from 'antd';
import { Title } from '@/components/Typography';
import { ItemHowTo } from './components/ItemHowTo';

const HowTo = () => {
  const data = [
    {
      title: 'Onboarding Guide',
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat',
      question_and_answer: [
        {
          question: 'How to view product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae  dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
        {
          question: 'How to share product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
      ],
    },
    {
      icon: <WorkspaceIcon />,
      title: 'My Workspace',
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat',
      question_and_answer: [
        {
          question: 'How to view product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae  dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
        {
          question: 'How to share product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
      ],
    },
    {
      icon: <UserGroup />,
      title: 'User Group',
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat',
      question_and_answer: [
        {
          question: 'How to view product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae  dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
        {
          question: 'How to share product specification?',
          answer:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat. Ac vitae aliquam dolor odio tristique ut tellus.',
        },
      ],
    },
    {
      icon: <ProjectIcon />,
      title: 'Project Tracking',
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat',
    },
    {
      icon: <ProductIcon />,
      title: 'Products',
      document:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ac vitae aliquam dolor odio tristique ut tellus. Tellus arcu in lectus massa massa. Varius sed et sed vel cursus ut dolor. Amet ullamcorper ultrices proin feugiat vestibulum volutpat',
    },
    { icon: <AdminstrationIcon />, title: 'Adminstration' },
  ];

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
                <ItemHowTo value={item} key={index} />
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default HowTo;
