import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
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
            {projectData.map((project, index) => (
              <Collapse.Panel
                header={
                  <RenderLabelHeader
                    header={project.status_name}
                    quantity={project.count}
                    isSubHeader={false}
                    isUpperCase={false}
                  />
                }
                key={index}
                collapsible={project.count === 0 ? 'disabled' : undefined}
              >
                <Collapse
                  accordion
                  bordered={false}
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? <DropupV2Icon /> : <DropdownV2Icon />)}
                  className={indexStyles.secondDropdownList}
                >
                  {project.projects.map((pro, proIndex) => (
                    <Collapse.Panel
                      header={renderProjectHeader(pro)}
                      key={`${index}-${proIndex}`}
                      collapsible={isEmpty(pro.code) ? 'disabled' : undefined}
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                        <InputGroup
                          label="Project Location"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={pro.location}
                        />
                        <InputGroup
                          label="Building Type"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={pro.building_type}
                        />
                        <InputGroup
                          label="Project Type"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={pro.type}
                        />
                        <InputGroup
                          label="Measurement Unit"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={
                            pro.measurement_unit === 1
                              ? 'Imperial'
                              : pro.measurement_unit === 2
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
                          value={pro.design_due}
                        />
                        <InputGroup
                          label="Construction Start"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          value={pro.construction_start}
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
