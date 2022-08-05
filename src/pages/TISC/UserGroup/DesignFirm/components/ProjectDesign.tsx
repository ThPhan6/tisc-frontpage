import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
import { MEASUREMENT_UNIT } from '@/constants/util';
import { ProjectDetail, ProjectsDesignFirm } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { FC, useState } from 'react';
import { RenderLabelHeader } from '../../components/renderHeader';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/ComponentViewDesign.less';

interface ProjectDesignProp {
  projectData: ProjectsDesignFirm[];
}
const ProjectDesign: FC<ProjectDesignProp> = ({ projectData }) => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

  const renderProjectHeader = (project: ProjectDetail) => {
    return (
      <div className={styles.userName}>
        <span className={indexStyles.dropdownCount}>
          Code {project.code}
          <span
            style={{
              marginLeft: 8,
            }}
          >
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
          <Collapse
            accordion
            bordered={false}
            expandIconPosition="right"
            expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
            className={indexStyles.dropdownList}
            activeKey={activeKey}
            onChange={(key) => {
              setActiveKey(key);
            }}
          >
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
                collapsible={listProject.count === 0 ? 'disabled' : undefined}
              >
                <Collapse
                  accordion
                  bordered={false}
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? <DropupV2Icon /> : <DropdownV2Icon />)}
                  className={indexStyles.secondDropdownList}
                >
                  {listProject.projects.map((project, projectIndex) => (
                    <Collapse.Panel
                      header={renderProjectHeader(project)}
                      key={`${index}-${projectIndex}`}
                      collapsible={isEmpty(project.code) ? 'disabled' : undefined}
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                        <InputGroup
                          label="Project Location"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={project.location}
                        />
                        <InputGroup
                          label="Building Type"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={project.building_type}
                        />
                        <InputGroup
                          label="Project Type"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={project.type}
                        />
                        <InputGroup
                          label="Measurement Unit"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={
                            project.measurement_unit === MEASUREMENT_UNIT.IMPERIAL
                              ? 'Imperial'
                              : project.measurement_unit === MEASUREMENT_UNIT.METRIC
                              ? 'Metric'
                              : ''
                          }
                        />
                        <InputGroup
                          label="Design Due"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={project.design_due}
                        />
                        <InputGroup
                          label="Construction Start"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={project.construction_start}
                        />
                      </div>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              </Collapse.Panel>
            ))}
          </Collapse>
        </div>
      </Col>
    </Row>
  );
};

export default ProjectDesign;
