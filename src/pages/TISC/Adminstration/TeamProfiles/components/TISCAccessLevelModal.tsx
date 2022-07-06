import { MainTitle } from '@/components/Typography';
import { Col, Row } from 'antd';
import styles from '../styles/TISCAccessLevelModal.less';
import { ReactComponent as CloseIcon } from '@/assets/icons/entry-form-close-icon.svg';

const TISCAccessLevelModal = () => {
  const handleCloseModal = () => {};

  return (
    <div>
      <div className={styles.modal_header}>
        <MainTitle level={3} customClass={styles.header__title}>
          TISC ACCESS LEVEL
        </MainTitle>
        <CloseIcon className={styles.header__icon} onClick={handleCloseModal} />
      </div>
      <Row className={styles.modal_main}>
        <Col span={6}></Col>
        <Col span={4}></Col>
      </Row>
    </div>
  );
};

export default TISCAccessLevelModal;
