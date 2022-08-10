import { Col, Row } from 'antd';
import styles from '../styles/ProfileDesign.less';
import { DesignFirmDetail } from '@/types';
import { FC } from 'react';
import { showImageUrl } from '@/helper/utils';
import indexStyles from '../../styles/index.less';
import TextForm from '@/components/Form/TextForm';

interface ProfileDesignProp {
  data: DesignFirmDetail;
}
const ProfileDesign: FC<ProfileDesignProp> = ({ data }) => {
  return (
    <div>
      <Row className={indexStyles.container}>
        <Col span={12}>
          <div className={`${styles.contentTab} ${indexStyles.form}`}>
            <div className={styles.designName}>
              <TextForm label="Design Firm Name" formClass={styles.brandName}>
                {data.name}
              </TextForm>
              {data.logo ? <img src={showImageUrl(data.logo)} className={styles.logo} /> : ''}
            </div>
            <TextForm label="Parent Company" boxShadow>
              {data.parent_company}
            </TextForm>
            <TextForm label="Slogan" boxShadow>
              {data.slogan}
            </TextForm>
            <TextForm label="Profile & Philosophy" boxShadow>
              {data.profile_n_philosophy}
            </TextForm>
            <TextForm label="Offical Website" boxShadow>
              {data.official_website}
            </TextForm>
            <TextForm label="Design Capabilities" boxShadow>
              {data.design_capabilities}
            </TextForm>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default ProfileDesign;
