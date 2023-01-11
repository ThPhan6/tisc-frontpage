import { FC } from 'react';

import { MEASUREMENT_UNIT } from '@/constants/util';
import { ProjectStatus } from '@/pages/Brand/ProjectTracking/constant';
import { Row } from 'antd';

import { showImageUrl } from '@/helper/utils';

import { ProjectInformation } from '../type';

import { FormGroup } from '@/components/Form';
import TextForm from '@/components/Form/TextForm';
import { ResponsiveCol } from '@/components/Layout';
import { BodyText, Title } from '@/components/Typography';

import styles from './Component.less';
import moment from 'moment';

interface BasicInformationProps {
  basicInformation?: ProjectInformation;
}

export const BasicInformation: FC<BasicInformationProps> = ({ basicInformation }) => {
  return (
    <Row>
      <ResponsiveCol className={styles.container}>
        <div className={styles.content}>
          <div className={styles.designInfo}>
            <TextForm
              label={'Designed By'}
              boxShadow
              formClass={
                basicInformation?.designFirm.logo ? styles.designName : styles.designNameInfo
              }
            >
              {basicInformation?.designFirm.name}
            </TextForm>
            {basicInformation?.designFirm.logo ? (
              <img src={showImageUrl(basicInformation?.designFirm.logo)} className={styles.logo} />
            ) : (
              ''
            )}
          </div>
          <FormGroup label="Project Code/Name" layout="vertical" labelColor="mono-color-dark">
            <div className={styles.project}>
              <BodyText level={5} fontFamily="Roboto" style={{ marginRight: '8px' }}>
                {basicInformation?.code}
              </BodyText>
              <BodyText level={5} fontFamily="Roboto">
                {basicInformation?.name}
              </BodyText>
            </div>
          </FormGroup>
          <TextForm label="Project Status" boxShadow>
            {ProjectStatus[basicInformation?.status as number]}
          </TextForm>
          <TextForm label="Address" boxShadow>
            {basicInformation?.address}
          </TextForm>
          <TextForm label="Project Type" boxShadow>
            {basicInformation?.project_type}
          </TextForm>
          <TextForm label="Building Type" boxShadow>
            {basicInformation?.building_type}
          </TextForm>
          <TextForm label="Measurement Unit" boxShadow>
            {basicInformation?.measurement_unit === MEASUREMENT_UNIT.IMPERIAL
              ? 'Imperial'
              : 'Metric'}
          </TextForm>
          <TextForm label="Design Due" boxShadow>
            {basicInformation?.design_due}
          </TextForm>
          <TextForm label="Construction Start" boxShadow>
            {basicInformation?.construction_start}
          </TextForm>
        </div>
        <div className={styles.bottom}>
          <BodyText level={6} fontFamily="Roboto" style={{ marginRight: '8px' }}>
            Last Updated:
          </BodyText>
          <Title level={9}>{moment(basicInformation?.updated_at).format('YYYY-MM-DD')}</Title>
        </div>
      </ResponsiveCol>
    </Row>
  );
};
