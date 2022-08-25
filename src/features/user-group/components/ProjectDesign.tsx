import { FC, useEffect, useState } from 'react';

import { MEASUREMENT_UNIT } from '@/constants/util';
import { Col, Collapse, Row } from 'antd';

import { getProjectsByDesignFirm } from '../services';
import { isEmpty } from 'lodash';

import { UserGroupProps } from '../types';
import { ProjectDetail, ProjectsDesignFirm } from '@/features/project/types';

import TextForm from '@/components/Form/TextForm';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';

import styles from '../styles/design.less';
import indexStyles from '../styles/index.less';
import { CollapseLevel1Props, CollapseLevel2Props } from './ExpandIcon';
import GeneralData from './GeneralData';

const ProjectDesign: FC<UserGroupProps> = ({ id }) => {
  const [projectData, setProjectData] = useState<ProjectsDesignFirm[]>([]);

  useEffect(() => {
    if (!id) return;

    getProjectsByDesignFirm(id).then((res) => {
      if (res) {
        setProjectData(res);
      }
    });
  }, []);

  const renderProjectHeader = (project: ProjectDetail) => {
    return (
      <div className={styles.userName}>
        <span className={styles.dropdownCount}>
          Code {project.code}
          <span
            style={{
              marginLeft: 8,
            }}>
            {project.name}
          </span>
        </span>
      </div>
    );
  };

  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={`${indexStyles.form} ${styles.team_form}`}>
          <GeneralData>
            {projectData.length && (
              <Collapse {...CollapseLevel1Props}>
                {projectData.map((listProject, index) => (
                  <Collapse.Panel
                    header={
                      <RenderLabelHeader
                        header={listProject.status_name}
                        quantity={listProject.count}
                        isSubHeader={false}
                        isUpperCase={false}
                      />
                    }
                    key={index}
                    collapsible={listProject.count === 0 ? 'disabled' : undefined}>
                    <Collapse {...CollapseLevel2Props}>
                      {listProject.projects.map((project, projectIndex) => (
                        <Collapse.Panel
                          header={renderProjectHeader(project)}
                          key={`${index}-${projectIndex}`}
                          collapsible={isEmpty(project.code) ? 'disabled' : undefined}>
                          <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                            <TextForm label="Project Location">{project.location}</TextForm>
                            <TextForm label="Building Type">{project.building_type}</TextForm>
                            <TextForm label="Project Type">{project.type}</TextForm>
                            <TextForm label="Measurement Unit">
                              {project.measurement_unit === MEASUREMENT_UNIT.IMPERIAL
                                ? 'Imperial'
                                : project.measurement_unit === MEASUREMENT_UNIT.METRIC
                                ? 'Metric'
                                : ''}
                            </TextForm>
                            <TextForm label="Design Due">{project.design_due}</TextForm>
                            <TextForm label="Construction Start">
                              {project.construction_start}
                            </TextForm>
                          </div>
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </GeneralData>
        </div>
      </Col>
    </Row>
  );
};

export default ProjectDesign;
