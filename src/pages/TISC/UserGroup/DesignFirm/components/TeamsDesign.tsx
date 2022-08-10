import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';
import { RenderLabelHeader, RenderMemberHeader } from '@/components/RenderHeaderLabel';
import { USER_STATUSES } from '@/constants/util';
import { TeamsDesignFirm } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { FC } from 'react';
import { CollapseLevel1Props, CollapseLevel2Props } from '../../icons';
import indexStyles from '../../styles/index.less';
import styles from '../styles/ComponentViewDesign.less';

interface TeamsDesignProp {
  teamData: TeamsDesignFirm[];
}

const TeamsDesign: FC<TeamsDesignProp> = ({ teamData }) => {
  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={`${indexStyles.form} ${styles.team_form}`}>
          <Collapse {...CollapseLevel1Props}>
            {teamData.map((team, index) => (
              <Collapse.Panel
                header={
                  <RenderLabelHeader
                    header={team.country_name}
                    quantity={team.count}
                    isSubHeader={false}
                    isUpperCase={false}
                  />
                }
                key={index}
                collapsible={team.count === 0 ? 'disabled' : undefined}
              >
                <Collapse {...CollapseLevel2Props}>
                  {team.users.map((user, userIndex) => (
                    <Collapse.Panel
                      header={
                        <RenderMemberHeader
                          firstName={user.firstname}
                          lastName={user.lastname}
                          avatar={user.logo}
                        />
                      }
                      key={`${index}-${userIndex}`}
                      collapsible={isEmpty(user.firstname) ? 'disabled' : undefined}
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                        <TextForm label="Gender">
                          {user.gender === true ? 'Male' : 'Female'}
                        </TextForm>
                        <TextForm label="Work Location">{user.work_location}</TextForm>
                        <TextForm label="Department">{user.department}</TextForm>
                        <TextForm label="Position/Title">{user.position}</TextForm>
                        <TextForm label="Work Email">{user.email}</TextForm>
                        <FormGroup
                          label="Work Phone"
                          layout="vertical"
                          formClass={styles.formGroup}
                        >
                          <PhoneInput
                            codeReadOnly
                            containerClass={styles.phoneInputCustom}
                            value={{
                              zoneCode: user.phone_code,
                              phoneNumber: user.phone,
                            }}
                          />
                        </FormGroup>
                        <FormGroup
                          label="Work Mobile"
                          layout="vertical"
                          formClass={styles.formGroup}
                        >
                          <PhoneInput
                            codeReadOnly
                            containerClass={styles.phoneInputCustom}
                            value={{
                              zoneCode: user.phone_code,
                              phoneNumber: user.mobile,
                            }}
                          />
                        </FormGroup>
                        <TextForm label="Access Level">{user.access_level}</TextForm>
                        <TextForm label="Status">
                          {user.status === USER_STATUSES.ACTIVE
                            ? 'Activated'
                            : user.status === USER_STATUSES.BLOCKED
                            ? 'Blocked'
                            : 'Pending'}
                        </TextForm>
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

export default TeamsDesign;
