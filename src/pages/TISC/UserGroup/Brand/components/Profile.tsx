import { FormGroup } from '@/components/Form';
import { BodyText } from '@/components/Typography';
import { showImageUrl } from '@/helper/utils';
import { getBrandById } from '@/services';
import { BrandDetail } from '@/types';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
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
  const params = useParams<{ id: string }>();
  const brandId = params?.id || '';
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
            <FormGroup
              label="Brand Name"
              labelColor="mono-color-medium"
              layout="vertical"
              bodyText={{
                text: profile.parent_company ?? '',
              }}
              formClass={styles.brandName}
            />
            {profile.logo && <img src={showImageUrl(profile.logo)} className={styles.logo} />}
          </div>

          <FormGroup
            label="Parent Company"
            labelColor="mono-color-medium"
            layout="vertical"
            bodyText={{
              text: profile.parent_company ?? '',
            }}
            formClass={styles.profile_info}
          />
          <FormGroup
            label="Slogan"
            labelColor="mono-color-medium"
            layout="vertical"
            bodyText={{
              text: profile.slogan ?? '',
            }}
            formClass={styles.profile_info}
          />
          <FormGroup
            label="Mission & Vision"
            labelColor="mono-color-medium"
            layout="vertical"
            bodyText={{
              text: profile.mission_n_vision ?? '',
            }}
            formClass={styles.profile_info}
          />
          <FormGroup
            label="Offical Website"
            labelColor="mono-color-medium"
            layout="vertical"
            formClass={styles.profile_info}
            bodyText={{
              text:
                (
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
                ) ?? '',
            }}
          />
        </div>
      </Col>
    </Row>
  );
};
export default BrandProfileDetail;
