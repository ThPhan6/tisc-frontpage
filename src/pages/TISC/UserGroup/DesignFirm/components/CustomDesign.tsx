import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import indexStyles from '../../index.less';
import styles from '../styles/TeamsDesign.less';

type ActiveKeyType = string | number | (string | number)[];

interface DesignLocation {
  name: string;
  location: DetailLocation[];
}

interface DetailLocation {
  business_name: string;
  info: {
    location: string;
    address: string;
    phone: string;
    gmail: string;
  };
}
const data = [
  {
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
const DEFAULT_LOCATIONDESIGN = [
  {
    name: '',
    location: [
      {
        business_name: '',
        info: {
          location: '',
          address: '',
          phone: '',
          gmail: '',
        },
      },
    ],
  },
];

const CustomDesign = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  const [teamData, setTeamData] = useState<DesignLocation[]>(DEFAULT_LOCATIONDESIGN);

  useEffect(() => {
    setTeamData(data);
  }, []);

  const renderCustomHeader = (user: DetailLocation) => {
    return (
      <div className={styles.userName}>
        <span className={`${styles.name} ${indexStyles.dropdownCount}`}>{user.business_name}</span>
      </div>
    );
  };

  const renderHeader = (team: DesignLocation) => {
    return (
      <span>
        {team.name}
        <span
          className={indexStyles.dropdownCount}
          style={{
            marginLeft: 8,
          }}
        >
          ({team.location.length})
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
                collapsible={isEmpty(team.name) ? 'disabled' : undefined}
              >
                <Collapse
                  accordion
                  bordered={false}
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? <DropupV2Icon /> : <DropdownV2Icon />)}
                  className={indexStyles.secondDropdownList}
                >
                  {team.location.map((user, userIndex) => (
                    <Collapse.Panel
                      header={renderCustomHeader(user)}
                      key={`${index}-${userIndex}`}
                      collapsible={isEmpty(user.business_name) ? 'disabled' : undefined}
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                        <InputGroup
                          label="Website"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          hasPadding
                          value={user.info.location}
                          readOnly
                        />
                        <InputGroup
                          label="Country Location"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          value={user.info.address}
                          hasPadding
                          readOnly
                        />
                        <InputGroup
                          label="State / Province"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          value={user.info.phone}
                          hasPadding
                          readOnly
                        />
                        <InputGroup
                          label="City / Town"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          value={user.info.gmail}
                          hasPadding
                          readOnly
                        />
                        <InputGroup
                          label="Address"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          value={user.info.gmail}
                          hasPadding
                          readOnly
                        />
                        <InputGroup
                          label="Postal / Zip Code"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          value={user.info.gmail}
                          hasPadding
                          readOnly
                        />
                        <InputGroup
                          label="Contact Person Name"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          value={user.info.gmail}
                          hasPadding
                          readOnly
                        />
                        <FormGroup label="Telephone" layout="vertical" formClass={styles.formGroup}>
                          <PhoneInput
                            codeReadOnly
                            containerClass={styles.phoneInputCustom}
                            // value={{
                            //   zoneCode: countryData.phoneCode,
                            //   phoneNumber: data.phone,
                            // }}
                          />
                        </FormGroup>
                        <FormGroup label="Mobile" layout="vertical" formClass={styles.formGroup}>
                          <PhoneInput
                            codeReadOnly
                            containerClass={styles.phoneInputCustom}
                            // value={{
                            //   zoneCode: countryData.phoneCode,
                            //   phoneNumber: data.mobile,
                            // }}
                          />
                        </FormGroup>
                        <InputGroup
                          label="Email"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          value={user.info.gmail}
                          hasPadding
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

export default CustomDesign;
