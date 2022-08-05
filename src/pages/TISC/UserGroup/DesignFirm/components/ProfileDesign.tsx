import InputGroup from '@/components/EntryForm/InputGroup';
import { Col, Row } from 'antd';
import styles from '../styles/ProfileDesign.less';
import { DesignFirmDetail } from '@/types';
import { FC } from 'react';

interface ProfileDesignProp {
  data: DesignFirmDetail;
}
const ProfileDesign: FC<ProfileDesignProp> = ({ data }) => {
  return (
    <div>
      <Row>
        <Col span={12}>
          <div className={styles.contentTab}>
            <div className={styles.designName}>
              <InputGroup
                label="Design Firm Name"
                hasBoxShadow
                hasHeight
                fontLevel={3}
                value={data.name}
                readOnly
                hasPadding
                colon
              />
              <img src={data.logo} className={styles.logo} />
            </div>
            <InputGroup
              label="Parent Company"
              hasBoxShadow
              hasHeight
              fontLevel={3}
              className={styles.label}
              value={data.parent_company}
              readOnly
              hasPadding
              colon
            />
            <InputGroup
              label="Slogan"
              hasBoxShadow
              hasHeight
              fontLevel={3}
              value={data.slogan}
              readOnly
              hasPadding
              colon
            />
            <InputGroup
              label="Profile & Philosophy"
              hasBoxShadow
              hasHeight
              fontLevel={3}
              value={data.profile_n_philosophy}
              readOnly
              hasPadding
              colon
            />
            <InputGroup
              label="Offical Website"
              hasBoxShadow
              hasHeight
              fontLevel={3}
              value={data.official_website}
              readOnly
              hasPadding
              colon
            />
            <InputGroup
              label="Design Capabilities"
              hasBoxShadow
              hasHeight
              fontLevel={3}
              value={data.design_capabilities}
              readOnly
              hasPadding
              colon
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default ProfileDesign;
