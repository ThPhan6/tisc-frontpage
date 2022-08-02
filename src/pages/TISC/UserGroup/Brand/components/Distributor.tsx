import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
import { BrandDetailData } from '@/constants/util';
import { Col, Collapse, Row } from 'antd';
import { capitalize, isEmpty, upperCase } from 'lodash';
import { useEffect, useState } from 'react';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/details.less';

const BrandDistributorDetail = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

  const [distributor, setDistributor] = useState<any>([]);

  useEffect(() => {
    setDistributor(BrandDetailData);
  });

  const renderBusinessHeader = (business: any) => {
    return <span className={indexStyles.dropdownCount}>{capitalize(business.firstname)}</span>;
  };

  const renderLocationHeader = (country: any) => {
    return (
      <span>
        {upperCase(country.country_name)}
        <span
          className={indexStyles.dropdownCount}
          style={{
            marginLeft: 8,
          }}
        >
          ({country.users.length})
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
            {distributor.map((location, index) => (
              <Collapse.Panel
                header={renderLocationHeader(location)}
                key={index}
                collapsible={isEmpty(location.country_name) ? 'disabled' : undefined}
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
                  {location.users.map((user, userIndex) => (
                    <Collapse.Panel
                      header={renderBusinessHeader(user)}
                      key={`${index}-${userIndex}`}
                      collapsible={isEmpty(user.firstname) ? 'disabled' : undefined}
                      // className="site-collapse-custom-panel"
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                        <InputGroup
                          label="Address"
                          colon
                          fontLevel={3}
                          value={user.address ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Person in charge"
                          colon
                          fontLevel={3}
                          value={user.gender === true ? 'Male' : 'Female'}
                          readOnly
                        />
                        <InputGroup
                          label="Gender"
                          colon
                          fontLevel={3}
                          value={user.work_location ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Location Function"
                          colon
                          fontLevel={3}
                          value={user.department ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Work Email"
                          colon
                          fontLevel={3}
                          value={user.email ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Work Phone"
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
                          label="Authorized Countries"
                          colon
                          fontLevel={3}
                          value={user.mobile ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Coverage Beyond"
                          colon
                          fontLevel={3}
                          value={user.mobile ?? ''}
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

export default BrandDistributorDetail;
