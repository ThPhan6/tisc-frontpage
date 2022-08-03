import InputGroup from '@/components/EntryForm/InputGroup';
import { BodyText } from '@/components/Typography';
import { showImageUrl } from '@/helper/utils';
import { getBrandById } from '@/services';
import { BrandDetail } from '@/types';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import indexStyles from '../../styles/index.less';
import styles from '../styles/details.less';

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
  status: 1,
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
            <InputGroup
              label="Brand Name"
              hasBoxShadow
              hasHeight
              fontLevel={3}
              colon
              readOnly
              value={profile.name ?? ''}
            />
            {profile.logo && <img src={showImageUrl(profile.logo)} className={styles.logo} />}
          </div>
          <InputGroup
            label="Parent Company"
            value={profile.parent_company ?? ''}
            hasBoxShadow
            hasHeight
            fontLevel={3}
            className={styles.label}
            colon
            readOnly
          />
          <InputGroup
            label="Slogan"
            value={profile.slogan ?? ''}
            hasBoxShadow
            hasHeight
            fontLevel={3}
            colon
            readOnly
          />
          <InputGroup
            label="Mission & Vision"
            value={profile.mission_n_vision ?? ''}
            hasBoxShadow
            hasHeight
            fontLevel={3}
            colon
            readOnly
          />
          <div className={styles.official_websites}>
            <BodyText level={3}>Offical Website</BodyText>
            <div className={styles.content}>
              {profile.official_websites?.map((web, index) => (
                <table className={styles.table} key={index}>
                  <tr>
                    <td className={styles.text}>
                      <BodyText level={3}>{web.country_name ?? 'N/A'}</BodyText>
                    </td>
                    <td className={styles.url}>
                      <BodyText level={5} fontFamily="Roboto">
                        {web.url ?? ''}
                      </BodyText>
                    </td>
                  </tr>
                </table>
              ))}
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default BrandProfileDetail;
