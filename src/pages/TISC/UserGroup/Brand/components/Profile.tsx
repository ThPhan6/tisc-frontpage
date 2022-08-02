import InputGroup from '@/components/EntryForm/InputGroup';
import { Col, Row } from 'antd';
import styles from '../styles/index.less';
import LogoDesignFirm from '@/assets/images/logo-design-firm.png';

const BrandProfileDetail = () => {
  return (
    <Row>
      <Col span={12}>
        <div className={styles.contentTab}>
          <div className={styles.designName}>
            <InputGroup label="Brand Name" hasBoxShadow hasHeight fontLevel={3} />
            <img src={LogoDesignFirm} className={styles.logo} />
          </div>
          <InputGroup
            label="Parent Company"
            hasBoxShadow
            hasHeight
            fontLevel={3}
            className={styles.label}
            readOnly
          />
          <InputGroup label="Slogan" hasBoxShadow hasHeight fontLevel={3} readOnly />
          <InputGroup label="Mission & Vision" hasBoxShadow hasHeight fontLevel={3} readOnly />
          <InputGroup label="Offical Website" hasBoxShadow hasHeight fontLevel={3} readOnly />
          <InputGroup label="Design Capabilities" hasBoxShadow hasHeight fontLevel={3} readOnly />
        </div>
      </Col>
    </Row>
  );
};
export default BrandProfileDetail;
