import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
import TeamIcon from '@/components/TeamProfile/components/TeamIcon';
import { BrandTeam, TISCUserGroupBrandTeam } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { capitalize, isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import indexStyles from '../../index.less';
import styles from '../styles/TeamsDesign.less';

type ActiveKeyType = string | number | (string | number)[];

const data = [
  {
    country_name: 'Singapore',
    users: [
      {
        logo: '',
        firstname: 'thinh',
        lastname: 'phan',
        gender: true,
        work_location: 'location',
        department: 'department',
        position: 'sales',
        email: 'emial@gmail.com',
        phone: '08754',
        mobile: '3434',
        access_level: 'brand lead',
        status: 2,
      },
      {
        logo: '',
        firstname: 'thinh',
        lastname: 'phan',
        gender: true,
        work_location: 'location',
        department: 'department',
        position: 'sales',
        email: 'emial@gmail.com',
        phone: '08754',
        mobile: '3434',
        access_level: 'brand lead',
        status: 3,
      },
    ],
  },
  {
    country_name: 'Thailand',
    users: [
      {
        logo: '',
        firstname: 'thinh',
        lastname: 'phan',
        gender: true,
        work_location: 'location',
        department: 'department',
        position: 'sales',
        email: 'emial@gmail.com',
        phone: '08754',
        mobile: '3434',
        access_level: 'brand lead',
        status: 2,
      },
    ],
  },
];

const DEFAULT_BRANDTEAM = [
  {
    country_name: '',
    users: [
      {
        logo: '',
        firstname: '',
        lastname: '',
        gender: true,
        work_location: '',
        department: '',
        position: '',
        email: '',
        phone: '',
        mobile: '',
        access_level: '',
        status: 1,
      },
    ],
  },
];

const TeamsDesign = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  const [teamData, setTeamData] = useState<TISCUserGroupBrandTeam[]>(DEFAULT_BRANDTEAM);

  useEffect(() => {
    setTeamData(data);
  }, []);

  const renderUserHeader = (user: BrandTeam) => {
    return (
      <div className={styles.userName}>
        <span className={styles.icon}>
          <TeamIcon avatar={user.logo} name={user.firstname} />
        </span>
        <span className={indexStyles.dropdownCount}>{`${capitalize(user.firstname)} ${capitalize(
          user.lastname,
        )}`}</span>
      </div>
    );
  };

  const renderHeader = (team: TISCUserGroupBrandTeam) => {
    return (
      <span>
        {team.country_name}
        <span
          className={indexStyles.dropdownCount}
          style={{
            marginLeft: 8,
          }}
        >
          ({team.users.length})
        </span>
      </span>
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
            {teamData.map((team, index) => (
              <Collapse.Panel
                header={renderHeader(team)}
                key={index}
                collapsible={isEmpty(team.country_name) ? 'disabled' : undefined}
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
                      header={renderUserHeader(user)}
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
                        />
                        <InputGroup
                          label="Work Location"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                        />
                        <InputGroup
                          label="Department"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                        />
                        <InputGroup
                          label="Position/Title"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                        />
                        <InputGroup
                          label="Work Email"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                        />
                        <InputGroup
                          label="Work Phone"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                        />
                        <InputGroup
                          label="Work Mobile"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                        />
                        <InputGroup
                          label="Access Level"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
                        />
                        <InputGroup
                          label="Status"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          readOnly
                          hasPadding
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
