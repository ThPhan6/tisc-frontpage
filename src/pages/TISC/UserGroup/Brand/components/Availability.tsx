import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { BodyText } from '@/components/Typography';
import { BrandDetailData } from '@/constants/util';
import { Col, Collapse, Row } from 'antd';
import { capitalize, isEmpty, upperCase } from 'lodash';
import { useEffect, useState } from 'react';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/details.less';

const BrandAvailabilityDetail = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

  const [availability, setAvailability] = useState<any>([]);

  useEffect(() => {
    setAvailability(BrandDetailData);
  });

  const renderLocationHeader = (collection: any) => {
    return <span className={indexStyles.dropdownCount}>{capitalize(collection.firstname)}</span>;
  };

  const renderCollectionHeader = (country: any) => {
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
            {availability.map((collection, index) => (
              <Collapse.Panel
                header={renderCollectionHeader(collection)}
                key={index}
                collapsible={isEmpty(collection.country_name) ? 'disabled' : undefined}
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
                  {collection.users.map((user, userIndex) => (
                    <Collapse.Panel
                      header={renderLocationHeader(user)}
                      key={`${index}-${userIndex}`}
                      collapsible={isEmpty(user.firstname) ? 'disabled' : undefined}
                      // className="site-collapse-custom-panel"
                    >
                      <div className={styles.teamInfo}>
                        <BodyText level={5} fontFamily="Roboto">
                          {user.firstname}
                        </BodyText>
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

export default BrandAvailabilityDetail;
