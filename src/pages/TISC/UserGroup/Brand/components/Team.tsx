import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { FormGroup } from '@/components/Form';
import { USER_STATUS_TEXTS } from '@/constants/util';
import { useGetParam } from '@/helper/hook';
import { getListTeamProfileGroupCountryByBrandId } from '@/services';
import { TeamProfileGroupCountry } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { RenderMainHeader, RenderMemberHeader } from '../../components/renderHeader';

import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/details.less';

const DEFAULT_BRANDTEAM = [
  {
    country_name: '',
    count: 0,
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
        status: 0,
      },
    ],
  },
];

const BrandTeamDetail = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  // const [secondActiveKey, setSecondActiveKey] = useState<ActiveKeyType>([]);
  const [teamData, setTeamData] = useState<TeamProfileGroupCountry[]>(DEFAULT_BRANDTEAM);

  const brandId = useGetParam();

  useEffect(() => {
    if (brandId) {
      getListTeamProfileGroupCountryByBrandId(brandId).then(setTeamData);
    }
  }, []);

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
                header={
                  team.country_name && (
                    <RenderMainHeader header={team.country_name} quantity={team.users.length} />
                  )
                }
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
                      header={
                        <RenderMemberHeader
                          firstName={user.firstname}
                          lastName={user.lastname}
                          avatar={user.logo}
                        />
                      }
                      key={`${index}-${userIndex}`}
                      collapsible={isEmpty(user.firstname) ? 'disabled' : undefined}
                      // className="site-collapse-custom-panel"
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                        <FormGroup
                          label="Gender"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: user.gender === true ? 'Male' : 'Female',
                          }}
                        />

                        <FormGroup
                          label="Work Location"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: user.work_location ?? '',
                          }}
                        />

                        <FormGroup
                          label="Department"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: user.department ?? '',
                          }}
                        />

                        <FormGroup
                          label="Position/Title"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: user.position ?? '',
                          }}
                        />

                        <FormGroup
                          label="Work Email"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: user.email ?? '',
                          }}
                        />

                        <FormGroup
                          label="Work Phone"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: user.phone ?? '',
                          }}
                        />

                        <FormGroup
                          label="Work Mobile"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: user.mobile ?? '',
                          }}
                        />

                        <FormGroup
                          label="Access Level"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: user.access_level ?? '',
                          }}
                        />

                        <FormGroup
                          label="Status"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: USER_STATUS_TEXTS[user.status] ?? 'N/A',
                          }}
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
