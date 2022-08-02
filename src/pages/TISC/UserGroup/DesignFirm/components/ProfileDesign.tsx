import InputGroup from '@/components/EntryForm/InputGroup';
import { Col, Row } from 'antd';
import styles from '../styles/ProfileDesign.less';
import LogoDesignFirm from '@/assets/images/logo-design-firm.png';

const ProfileDesign = () => {
  return (
    <div>
      <Row>
        <Col span={12}>
          <div className={styles.contentTab}>
            <div className={styles.designName}>
              <InputGroup label="Design Firm Name" hasBoxShadow hasHeight fontLevel={3} />
              <img src={LogoDesignFirm} className={styles.logo} />
            </div>
            <InputGroup
              label="Parent Company"
              hasBoxShadow
              hasHeight
              fontLevel={3}
              className={styles.label}
            />
            <InputGroup label="Slogan" hasBoxShadow hasHeight fontLevel={3} />
            <InputGroup label="Profile & Philosophy" hasBoxShadow hasHeight fontLevel={3} />
            <InputGroup label="Offical Website" hasBoxShadow hasHeight fontLevel={3} />
            <InputGroup label="Design Capabilities" hasBoxShadow hasHeight fontLevel={3} />
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default ProfileDesign;
