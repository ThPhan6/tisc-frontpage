import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import InputGroup from '@/components/EntryForm/InputGroup';
import { getLocationByBrandId } from '@/services';
import { ILocationDetail, LocationGroupedByCountry } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty, upperCase } from 'lodash';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { ActiveKeyType } from '../../types';
import styles from '../styles/details.less';
import indexStyles from '../../styles/index.less';

const BrandLocationDetail = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  const [locations, setLocations] = useState<LocationGroupedByCountry[]>([]);

  const params = useParams<{ id: string }>();
  const brandId = params?.id || '';

  useEffect(() => {
    getLocationByBrandId(brandId).then(setLocations);
  }, []);

  const renderBusinessHeader = (business: ILocationDetail) => {
    return (
      <span
        className={indexStyles.dropdownCount}
        style={{
          textTransform: 'capitalize',
        }}
      >
        {business.business_name}
      </span>
    );
  };

  const renderLocationHeader = (country: LocationGroupedByCountry) => {
    return (
      <span>
        {upperCase(country.country_name)}
        <span
          className={indexStyles.dropdownCount}
          style={{
            marginLeft: 8,
          }}
        >
          ({country.locations.length})
        </span>
      </span>
    );
  };

  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={`${indexStyles.form} ${styles.location_form}`}>
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
            {locations.map((country, index) => (
              <Collapse.Panel
                header={renderLocationHeader(country)}
                key={index}
                collapsible={isEmpty(country.country_name) ? 'disabled' : undefined}
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
                  {country.locations.map((location, userIndex) => (
                    <Collapse.Panel
                      header={renderBusinessHeader(location)}
                      key={`${index}-${userIndex}`}
                      collapsible={isEmpty(location.business_name) ? 'disabled' : undefined}
                      // className="site-collapse-custom-panel"
                    >
                      <div className={`${indexStyles.info} ${styles.locationInfo}`}>
                        <InputGroup
                          label="Registered Number"
                          colon
                          fontLevel={3}
                          value={location.business_number ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Location Type"
                          colon
                          fontLevel={3}
                          value={location.functional_types.map((type) => ` ${type.name}`) ?? ''}
                          readOnly
                          containerClass={indexStyles.stringInfo}
                        />
                        <InputGroup
                          label="Location Function"
                          colon
                          fontLevel={3}
                          value={location.functional_type ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="Address"
                          colon
                          fontLevel={3}
                          value={location.address ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="General Phone"
                          colon
                          fontLevel={3}
                          value={location.general_phone ?? ''}
                          readOnly
                        />
                        <InputGroup
                          label="General Email"
                          colon
                          fontLevel={3}
                          value={location.general_email ?? ''}
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

export default BrandLocationDetail;
