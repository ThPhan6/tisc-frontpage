import { useState } from 'react';
import { BodyText, Title } from '@/components/Typography';
import { ProjectSummaryProps } from '@/types';
import styles from '../../styles/project-summary.less';
import { startCase, upperCase, capitalize, map } from 'lodash';

interface ProjectSummaryItemProps {
  label: string;
  value?: number;
  isBold?: boolean;
}

const ProjectSummaryItem = ({ label, value, isBold }: ProjectSummaryItemProps) => {
  return (
    <div className={styles.summaryItem}>
      {isBold ? (
        <Title level={8}>{value}</Title>
      ) : (
        <BodyText level={5} fontFamily="Roboto">
          {value}
        </BodyText>
      )}
      {isBold ? (
        <Title level={9}>{label}</Title>
      ) : (
        <BodyText level={6} fontFamily="Roboto">
          {label}
        </BodyText>
      )}
    </div>
  );
};

const ProjectSummary = () => {
  const [summaryData] = useState<ProjectSummaryProps>({
    projects: 0,
    live: 0,
    onHold: 0,
    archived: 0,
  });

  const data: ProjectSummaryItemProps[] = map(summaryData, (value, label) => {
    return {
      label: label === 'projects' ? upperCase(label) : capitalize(startCase(label)),
      value: value ?? 0,
      isBold: label === 'projects',
    };
  });

  return (
    <div className={styles.projectSummaryWrapper}>
      {data.map((summaryItem, index) => (
        <ProjectSummaryItem key={index} {...summaryItem} />
      ))}
    </div>
  );
};
export default ProjectSummary;
