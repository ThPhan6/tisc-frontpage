import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import { LocationsDesignFirm, LocationDetail } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { FC, useState } from 'react';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/ComponentViewDesign.less';

interface LocationDesignProps {
  locationData: LocationsDesignFirm[];
}

const LocationDesign: FC<LocationDesignProps> = ({ locationData }) => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

  const renderLocationHeader = (businessName: LocationDetail) => {
    return (
      <div className={styles.userName}>
        <span className={`${styles.name} ${indexStyles.dropdownCount}`}>
          {businessName.business_name}
        </span>
      </div>
    );
  };

  const renderHeader = (countryName: LocationsDesignFirm) => {
    return (
      <span>
        {countryName.country_name}
        <span
          className={indexStyles.dropdownCount}
          style={{
            marginLeft: 8,
          }}
        >
          ({countryName.count})
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
            {locationData.map((location, index) => (
              <Collapse.Panel
                header={renderHeader(location)}
                key={index}
                collapsible={isEmpty(location.country_name) ? 'disabled' : undefined}
              >
                <Collapse
                  accordion
                  bordered={false}
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? <DropupV2Icon /> : <DropdownV2Icon />)}
                  className={indexStyles.secondDropdownList}
                >
                  {location.locations.map((loca, locationIndex) => (
                    <Collapse.Panel
                      header={renderLocationHeader(loca)}
                      key={`${index}-${locationIndex}`}
                      collapsible={isEmpty(loca.business_name) ? 'disabled' : undefined}
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                        <InputGroup
                          label="Location Function"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          hasPadding
                          value={loca.functional_types.map((type) => ` ${type.name}`) ?? ''}
                          readOnly
                          colon
                        />
                        <InputGroup
                          label="Address"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          value={loca.address}
                          hasPadding
                          readOnly
                          colon
                        />
                        {/* <InputGroup
                          label="General Phone"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          value={loca.general_phone}
                          hasPadding
                          readOnly
                          colon
                        /> */}
                        <FormGroup
                          label="General Phone"
                          layout="vertical"
                          formClass={styles.formGroup}
                        >
                          <PhoneInput
                            codeReadOnly
                            containerClass={styles.phoneInputCustom}
                            value={{
                              zoneCode: loca.phone_code,
                              phoneNumber: loca.general_phone,
                            }}
                          />
                        </FormGroup>
                        <InputGroup
                          label="General Email"
                          hasHeight
                          fontLevel={3}
                          className={styles.label}
                          value={loca.general_email}
                          hasPadding
                          readOnly
                          colon
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

export default LocationDesign;
