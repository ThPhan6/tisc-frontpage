import { FC } from 'react';

import { MEASUREMENT_UNIT } from '@/constants/util';

import { Project } from '@/types/project-tracking.type';

import TextForm from '@/components/Form/TextForm';

import styles from './DesignFirm.less';
import moment from 'moment';

interface BrandProjectProps {
  project: Project;
}
export const BrandProject: FC<BrandProjectProps> = ({ project }) => {
  return (
    <div className={styles.content}>
      <TextForm label="Created Date" boxShadow>
        {moment(project.created_at).format('YYYY-MM-DD')}
      </TextForm>

      <TextForm boxShadow label="Project Name">
        {project.name}
      </TextForm>
      <TextForm boxShadow label="Project Location">
        {project.location}
      </TextForm>
      <TextForm boxShadow label="Project Type">
        {project.project_type}
      </TextForm>
      <TextForm boxShadow label="Building Type">
        {project.building_type}
      </TextForm>
      <TextForm boxShadow label="Measurement Unit">
        {project.measurement_unit === MEASUREMENT_UNIT.IMPERIAL ? 'Imperial' : 'Metric'}
      </TextForm>
      <TextForm boxShadow label="Design Due">
        {project.design_due}
      </TextForm>
      <TextForm boxShadow label="Construction Start">
        {project.construction_start}
      </TextForm>
    </div>
  );
};
