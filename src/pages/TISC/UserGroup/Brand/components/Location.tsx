import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { FormGroup } from '@/components/Form';
import { useGetParam } from '@/helper/hook';
import { getLocationByBrandId } from '@/services';
import { LocationGroupedByCountry } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { RenderLabelHeader } from '../../components/renderHeader';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/details.less';

const BrandLocationDetail = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);
  const [locations, setLocations] = useState<LocationGroupedByCountry[]>([]);

  const brandId = useGetParam();

  useEffect(() => {
    if (brandId) {
      getLocationByBrandId(brandId).then(setLocations);
    }
  }, []);

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
                header={
                  <RenderLabelHeader
                    header={country.country_name}
                    quantity={country.count}
                    isSubHeader={false}
                    isUpperCase={true}
                  />
                }
                key={index}
                collapsible={
                  isEmpty(country.country_name) || country.count == 0 ? 'disabled' : undefined
                }
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
                  {country.locations?.map((location, userIndex) => (
                    <Collapse.Panel
                      header={
                        <RenderLabelHeader header={location.business_name} isSubHeader={true} />
                      }
                      key={`${index}-${userIndex}`}
                      collapsible={isEmpty(location.business_name) ? 'disabled' : undefined}
                      // className="site-collapse-custom-panel"
                    >
                      <div className={`${indexStyles.info} ${styles.locationInfo}`}>
                        <FormGroup
                          label="Registered Number"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: location.business_number ?? '',
                          }}
                        />

                        <FormGroup
                          label="Location Function"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text:
                              location.functional_types.map((type) => type.name).join(', ') ?? '',
                          }}
                        />

                        <FormGroup
                          label="Address"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: location.address ?? '',
                          }}
                        />

                        <FormGroup
                          label="General Phone"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: location.general_phone ?? '',
                          }}
                        />

                        <FormGroup
                          label="General Email"
                          labelColor="mono-color-medium"
                          layout="vertical"
                          bodyText={{
                            text: location.general_email ?? '',
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

export default BrandLocationDetail;
