import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
import { USER_STATUS_TEXTS } from '@/constants/util';
import { BrandTeam, TISCUserGroupBrandTeam } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { capitalize, isEmpty, upperCase } from 'lodash';
import { useEffect, useState } from 'react';
import styles from '../styles/brandViewDetail.less';
import indexStyles from '../../index.less';
import TeamIcon from '@/components/TeamProfile/components/TeamIcon';

type ActiveKeyType = string | number | (string | number)[];

const data = [
  {
    // id: '1',
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
    // id: '2',
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

const BrandTeamDetail = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  // const [secondActiveKey, setSecondActiveKey] = useState<ActiveKeyType>([]);
  const [teamData, setTeamData] = useState<TISCUserGroupBrandTeam[]>(DEFAULT_BRANDTEAM);

  useEffect(() => {
    setTeamData(data);
  }, []);

  const renderUserHeader = (user: BrandTeam) => {
    return (
      <div className={styles.userName}>
        <TeamIcon avatar={user.logo} name={user.firstname} />
        <span className={`${styles.name} ${indexStyles.dropdownCount}`}>{`${capitalize(
          user.firstname,
        )} ${capitalize(user.lastname)}`}</span>
      </div>
    );
  };

  const renderHeader = (team: TISCUserGroupBrandTeam) => {
    return (
      <span>
        {upperCase(team.country_name)}
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
            bordered={false}
            expandIconPosition="right"
            expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
            className={indexStyles.dropdownList}
            activeKey={activeKey}
            onChange={(key) => {
              // setSecondActiveKey([]);
              setActiveKey(key);
            }}
          >
            {teamData.map((team, index) => (
              <Collapse.Panel
                header={renderHeader(team)}
                key={index}
                collapsible={isEmpty(team.country_name) ? 'disabled' : undefined}
                // className="site-collapse-custom-panel"
              >
                <Collapse
                  bordered={false}
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? <DropupV2Icon /> : <DropdownV2Icon />)}
                  className={indexStyles.secondDropdownList}
                  // onChange={setSecondActiveKey}
                  // activeKey={secondActiveKey}
                >
                  {team.users.map((user, userIndex) => (
                    <Collapse.Panel
                      header={renderUserHeader(user)}
                      key={`${index}-${userIndex}`}
                      collapsible={isEmpty(user.firstname) ? 'disabled' : undefined}
                      // className="site-collapse-custom-panel"
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                        <InputGroup
                          label="Gender :"
                          fontLevel={3}
                          value={user.gender === true ? 'Male' : 'Female'}
                        />
                        <InputGroup
                          label="Work Location :"
                          fontLevel={3}
                          value={user.work_location ?? ''}
                        />
                        <InputGroup
                          label="Department :"
                          fontLevel={3}
                          value={user.department ?? ''}
                        />
                        <InputGroup
                          label="Position/Title :"
                          fontLevel={3}
                          value={user.position ?? ''}
                        />
                        <InputGroup label="Phone :" fontLevel={3} value={user.phone ?? ''} />
                        <InputGroup label="Work Mobile :" fontLevel={3} value={user.mobile ?? ''} />
                        <InputGroup
                          label="Access Level :"
                          fontLevel={3}
                          value={user.access_level ?? ''}
                        />
                        <InputGroup
                          label="Status :"
                          fontLevel={3}
                          value={USER_STATUS_TEXTS[user.status] ?? 'N/A'}
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

export default BrandTeamDetail;
