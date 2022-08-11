import TextForm from '@/components/Form/TextForm';
import { BodyText } from '@/components/Typography';
import { useGetParam } from '@/helper/hook';
import { showImageUrl } from '@/helper/utils';
import { getBrandById } from '@/services';
import { BrandDetail } from '@/types';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import indexStyles from '../../styles/index.less';
import styles from '../styles/profile.less';

const DEFAULT_BRANDPROFILE: BrandDetail = {
  id: '',
  name: '',
  parent_company: null,
  logo: '',
  slogan: '',
  mission_n_vision: '',
  official_websites: [],
  team_profile_ids: [],
  location_ids: [],
  status: 0,
  created_at: '',
  updated_at: null,
  is_deleted: false,
};

const BrandProfileDetail = () => {
  const brandId = useGetParam();
  const [profile, setProfile] = useState<BrandDetail>(DEFAULT_BRANDPROFILE);

  useEffect(() => {
    getBrandById(brandId).then((data) => {
      if (data) {
        setProfile(data);
      }
    });
  }, []);

  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={`${styles.profile} ${indexStyles.form}`}>
          <div className={styles.designName}>
            <TextForm label="Brand Name" formClass={styles.brandName}>
              {profile.name ?? ''}
            </TextForm>
            {profile.logo ? <img src={showImageUrl(profile.logo)} className={styles.logo} /> : ''}
          </div>

          <TextForm formClass={styles.profile_label} label="Parent Company">
            {profile.parent_company ?? ''}
          </TextForm>
          <TextForm formClass={styles.profile_label} label="Slogan">
            {profile.slogan ?? ''}
          </TextForm>
          <TextForm formClass={styles.profile_label} label="Mission & Vision">
            {profile.mission_n_vision ?? ''}
          </TextForm>

          <TextForm formClass={styles.profile_label} label="Offical Website">
            {(
              <table className={styles.table}>
                {profile.official_websites?.map((web, index) => (
                  <tr key={index}>
                    <td className={styles.text}>
                      <BodyText level={3}>{web.country_name ?? 'N/A'}</BodyText>
                    </td>
                    <td className={styles.url}>
                      <BodyText level={5} fontFamily="Roboto">
                        {web.url ?? ''}
                      </BodyText>
                    </td>
                  </tr>
                ))}
              </table>
            ) ?? ''}
          </TextForm>
        </div>
      </Col>
    </Row>
  );
};
export default BrandProfileDetail;
