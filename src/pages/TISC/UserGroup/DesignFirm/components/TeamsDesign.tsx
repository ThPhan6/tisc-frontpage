import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
import { Col, Collapse, Row } from 'antd';
import { capitalize, isEmpty, upperCase } from 'lodash';
import { useState } from 'react';
import styles from '../styles/Teamsdesign.less';

type ActiveKeyType = string | number | (string | number)[];

const data = [
  {
    id: '1',
    name: 'Singapore',
    location: [
      {
        business_name: 'singapo1',
        info: {
          location: 'main office',
          address: 'aa',
          phone: '11',
          gmail: 'a@gmail.com',
        },
      },
    ],
  },
  {
    id: '2',
    name: 'Thailand',
    location: [
      {
        business_name: 'singapo1',
        info: {
          location: 'main office',
          address: 'aa',
          phone: '11',
          gmail: 'a@gmail.com',
        },
      },
    ],
  },
];

const TeamsDesign = () => {
  // const params = useParams<{ id: string }>();
  // const productId = params?.id || '';

  // const [teamProfile, setTeamProfile] = useState<TeamProfileDetailProps>();

  // console.log('data', teamProfile);
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  const [secondActiveKey, setSecondActiveKey] = useState<ActiveKeyType>([]);

  const renderHeader = (item: any) => {
    return (
      <span>
        {upperCase(item.name)}
        <span
          className={styles.dropdownCount}
          style={{
            marginLeft: 8,
          }}
        >
          ({item.subs.length})
        </span>
      </span>
    );
  };
  const renderSubHeader = (item: any) => {
    return (
      <span>
        {capitalize(item.name)}
        <span
          className={styles.dropdownCount}
          style={{
            marginLeft: 8,
          }}
        >
          ({item.subs.length})
        </span>
      </span>
    );
  };

  return (
    <Row className={styles.container}>
      <Col span={12}>
        <div className={styles.team_form}>
          <Collapse
            bordered={false}
            expandIconPosition="right"
            expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
            className={styles.dropdownList}
            onChange={(key) => {
              setSecondActiveKey([]);
              setActiveKey(key);
            }}
            activeKey={activeKey}
          >
            {data.map((item, index) => (
              <Collapse.Panel
                header={renderHeader(item)}
                key={index}
                collapsible={isEmpty(item.name) ? 'disabled' : undefined}
                className="site-collapse-custom-panel"
              >
                <Collapse
                  bordered={false}
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? <DropupV2Icon /> : <DropdownV2Icon />)}
                  className={styles.secondDropdownList}
                  onChange={setSecondActiveKey}
                  activeKey={secondActiveKey}
                >
                  {item.location.map((sub, subIndex) => (
                    <Collapse.Panel
                      header={renderSubHeader(sub)}
                      key={`${index}-${subIndex}`}
                      collapsible={isEmpty(sub.business_name) ? 'disabled' : undefined}
                      className="site-collapse-custom-panel"
                    >
                      <div>
                        <div className={styles.formLocation}>
                          <InputGroup
                            label="Gender"
                            hasHeight
                            fontLevel={3}
                            className={styles.label}
                            readOnly
                          />
                          <InputGroup
                            label="Work Location"
                            hasHeight
                            fontLevel={3}
                            className={styles.label}
                            readOnly
                          />
                          <InputGroup
                            label="Department"
                            hasHeight
                            fontLevel={3}
                            className={styles.label}
                          />
                          <InputGroup
                            label="Position/Title"
                            hasHeight
                            fontLevel={3}
                            className={styles.label}
                            readOnly
                          />
                          <InputGroup
                            label="Work Email"
                            hasHeight
                            fontLevel={3}
                            className={styles.label}
                            readOnly
                          />
                          <InputGroup
                            label="Work Phone"
                            hasHeight
                            fontLevel={3}
                            className={styles.label}
                            readOnly
                          />
                          <InputGroup
                            label="Work Mobile"
                            hasHeight
                            fontLevel={3}
                            className={styles.label}
                            readOnly
                          />
                          <InputGroup
                            label="Access Level"
                            hasHeight
                            fontLevel={3}
                            className={styles.label}
                            readOnly
                          />
                          <InputGroup
                            label="Status"
                            hasHeight
                            fontLevel={3}
                            className={styles.label}
                            readOnly
                          />
                        </div>
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
