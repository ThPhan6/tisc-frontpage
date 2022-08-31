import { FC, useEffect, useState } from 'react';

import { Col, Collapse, Row } from 'antd';

import { getLocationsByDesignFirm } from '../services';
import { isEmpty } from 'lodash';

import { UserGroupProps } from '../types/common.types';
import { LocationGroupedByCountry } from '@/features/locations/type';

import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';

import styles from '../styles/index.less';
import { CollapseLevel1Props, CollapseLevel2Props } from './ExpandIcon';
import GeneralData from './GeneralData';
import { getLocationByBrandId } from '@/features/locations/api';

const LocationDetail: FC<UserGroupProps> = ({ type, id }) => {
  const [locations, setLocations] = useState<LocationGroupedByCountry[]>([]);

  useEffect(() => {
    if (!id) return;

    if (type === 'brand') {
      getLocationByBrandId(id).then(setLocations);
    }

    if (type === 'design') {
      getLocationsByDesignFirm(id).then(setLocations);
    }
  }, []);

  return (
    <Row className={styles.container}>
      <Col span={12}>
        <div className={styles.form}>
          <GeneralData>
            {locations.length && (
              <Collapse {...CollapseLevel1Props}>
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
                    }>
                    <Collapse {...CollapseLevel2Props}>
                      {country.locations?.map((location, locationIndex) => (
                        <Collapse.Panel
                          header={
                            <RenderLabelHeader header={location.business_name} isSubHeader={true} />
                          }
                          key={`${index}-${locationIndex}`}
                          collapsible={isEmpty(location.business_name) ? 'disabled' : undefined}>
                          <div className={styles.info}>
                            {type === 'brand' ? (
                              <TextForm label="Registered Number">
                                {location.business_number ?? ''}
                              </TextForm>
                            ) : (
                              ''
                            )}
                            <TextForm label="Location Function">
                              {location.functional_types
                                .map((fncType) => fncType.name)
                                .join(', ') ?? ''}
                            </TextForm>
                            <TextForm label="Address">{location.address ?? ''}</TextForm>
                            <FormGroup
                              label="General Phone"
                              layout="vertical"
                              formClass={styles.formGroup}>
                              <PhoneInput
                                codeReadOnly
                                containerClass={styles.phoneInputCustom}
                                value={{
                                  zoneCode: location.phone_code,
                                  phoneNumber: location.general_phone,
                                }}
                              />
                            </FormGroup>
                            <TextForm label="General Email">
                              {location.general_email ?? ''}
                            </TextForm>
                          </div>
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </GeneralData>
        </div>
      </Col>
    </Row>
  );
};

export default LocationDetail;
