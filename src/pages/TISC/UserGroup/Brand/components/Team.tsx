import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
import TeamIcon from '@/components/TeamProfile/components/TeamIcon';
import { BrandDetailData, USER_STATUS_TEXTS } from '@/constants/util';
import { showImageUrl } from '@/helper/utils';
import { BrandTeam, TISCUserGroupBrandTeam } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { capitalize, isEmpty, upperCase } from 'lodash';
import { useEffect, useState } from 'react';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/details.less';

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
    setTeamData(BrandDetailData);
  }, []);

  const renderUserHeader = (user: BrandTeam) => {
    return (
      <div className={styles.userName}>
        <TeamIcon
          avatar={showImageUrl(user.logo)}
          name={user.firstname}
          customClass={indexStyles.avatar}
        />
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
            accordion
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
                  accordion
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
                          label="Gender"
                          colon
                          fontLevel={3}
                          value={user.gender === true ? 'Male' : 'Female'}
                          readOnly
                        />
                        <InputGroup
                          label="Work Location"
                          colon
                          fontLevel={3}
                          value={user.work_location ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Department"
                          colon
                          fontLevel={3}
                          value={user.department ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Position/Title"
                          colon
                          fontLevel={3}
                          value={user.position ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Phone"
                          colon
                          fontLevel={3}
                          value={user.phone ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Work Mobile"
                          colon
                          fontLevel={3}
                          value={user.mobile ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Access Level"
                          colon
                          fontLevel={3}
                          value={user.access_level ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Status"
                          colon
                          fontLevel={3}
                          value={USER_STATUS_TEXTS[user.status] ?? 'N/A'}
                          readOnly
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
