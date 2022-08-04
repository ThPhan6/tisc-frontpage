import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { TeamsDesignFirm } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { FC, useState } from 'react';
import { RenderLabelHeader, RenderMemberHeader } from '../../components/renderHeader';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/ComponentViewDesign.less';

interface TeamsDesignProp {
  teamData: TeamsDesignFirm[];
}

const TeamsDesign: FC<TeamsDesignProp> = ({ teamData }) => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

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
                <Collapse
                  accordion
                  bordered={false}
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? <DropupV2Icon /> : <DropdownV2Icon />)}
                  className={indexStyles.secondDropdownList}
                >
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
                        <InputGroup
                          label="Gender"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          colon
                          value={user.gender === true ? 'Male' : 'Female'}
                        />
                        <InputGroup
                          label="Work Location"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          colon
                          value={user.work_location}
                        />
                        <InputGroup
                          label="Department"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          colon
                          value={user.department}
                        />
                        <InputGroup
                          label="Position/Title"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          colon
                          value={user.position}
                        />
                        <InputGroup
                          label="Work Email"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          colon
                          value={user.email}
                        />
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
                        <InputGroup
                          label="Access Level"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          colon
                          value={user.access_level}
                        />
                        <InputGroup
                          label="Status"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                          colon
                          value={
                            user.status === 1
                              ? 'Activated'
                              : user.status === 2
                              ? 'Blocked'
                              : 'Pending'
                          }
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

export default TeamsDesign;
