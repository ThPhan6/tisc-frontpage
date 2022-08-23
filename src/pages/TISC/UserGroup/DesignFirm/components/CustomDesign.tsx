import { Col, Row } from 'antd';

import indexStyles from '../../styles/index.less';

const CustomDesign = () => {
  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={indexStyles.form}>Content of custom</div>
      </Col>
    </Row>
  );
};

export default CustomDesign;
