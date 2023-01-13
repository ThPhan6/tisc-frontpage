import { FC } from 'react';

import { Row } from 'antd';

import { useScreen } from '@/helper/common';
import { getValueByCondition, showImageUrl } from '@/helper/utils';

import { UserGroupProps } from '../types/common.types';

import TextForm from '@/components/Form/TextForm';
import { ResponsiveCol } from '@/components/Layout';
import { BodyText } from '@/components/Typography';

import indexStyles from '../styles/index.less';
import styles from './Profile.less';

export const ProfileDetail: FC<UserGroupProps> = ({ type, data }) => {
  const { isTablet } = useScreen();
  if (!data) return null;

  const getProfileLabel = () =>
    getValueByCondition(
      [
        [type === 'brand', 'Mission & Vision'],
        [type === 'design', 'Profile & Philosophy'],
      ],
      '',
    );
  const getProfileData = () =>
    getValueByCondition(
      [
        [type === 'brand', data.mission_n_vision],
        [type === 'design', data.profile_n_philosophy],
      ],
      '',
    );

  const renderOfficialWebsites = () =>
    data.official_websites.length
      ? data.official_websites.map((web, index) => (
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
        ))
      : null;

  return (
    <Row className={indexStyles.container}>
      <ResponsiveCol>
        <div
          className={`${styles.profile} ${indexStyles.form}`}
          style={{
            height: isTablet ? 'calc(var(--vh) * 100 - 266px)' : 'calc(var(--vh) * 100 - 248px)',
          }}
        >
          <div className={styles.designName}>
            <TextForm
              label={type === 'brand' ? 'Brand Name' : 'Design Firm Name'}
              boxShadow
              formClass={data.logo ? styles.brandName : styles.brandNameInfo}
            >
              {data.name ?? ''}
            </TextForm>
            {data.logo ? <img src={showImageUrl(data.logo)} className={styles.logo} /> : ''}
          </div>

          <TextForm formClass={styles.profile_label} boxShadow label="Parent Company">
            {data.parent_company ?? ''}
          </TextForm>
          <TextForm formClass={styles.profile_label} boxShadow label="Slogan">
            {data.slogan ?? ''}
          </TextForm>
          <TextForm formClass={styles.profile_label} boxShadow label={getProfileLabel()}>
            {getProfileData()}
          </TextForm>

          {type !== 'brand' ? (
            <TextForm formClass={styles.profile_label} boxShadow label="Official Website">
              {data.official_website ?? ''}
            </TextForm>
          ) : (
            <div className={styles.officalWebsite}>
              <div className={styles.label}>
                <BodyText level={3} color="mono-color-dark">
                  Official Website
                </BodyText>
                <span className={styles.colon}>:</span>
              </div>
              <table className={styles.table}>
                <tbody>{renderOfficialWebsites()}</tbody>
              </table>
            </div>
          )}

          {type === 'design' ? (
            <TextForm label="Design Capabilities" boxShadow>
              {data.design_capabilities}
            </TextForm>
          ) : null}
        </div>
      </ResponsiveCol>
    </Row>
  );
};
