import { FC } from 'react';

import { Col, Collapse, Row } from 'antd';

import { isEmpty } from 'lodash';

import { LocationGroupedByCountry } from '@/features/locations/type';

import GeneralData from '../../components/GeneralData';
import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';

import { CollapseLevel1Props, CollapseLevel2Props } from '../../icons';
import indexStyles from '../../styles/index.less';
import styles from '../styles/ComponentViewDesign.less';

interface LocationDesignProp {
  locationData: LocationGroupedByCountry[];
}

const LocationDesign: FC<LocationDesignProp> = ({ locationData }) => {
  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={`${indexStyles.form} ${styles.team_form}`}>
          <GeneralData>
            {locationData.length && (
              <Collapse {...CollapseLevel1Props}>
                {locationData.map((country, index) => (
                  <Collapse.Panel
                    header={
                      <RenderLabelHeader
                        header={country.country_name}
                        quantity={country.count}
                        isSubHeader={false}
                        isUpperCase={false}
                      />
                    }
                    key={index}
                    collapsible={country.count === 0 ? 'disabled' : undefined}>
                    <Collapse {...CollapseLevel2Props}>
                      {country.locations.map((location, locationIndex) => (
                        <Collapse.Panel
                          header={
                            <RenderLabelHeader header={location.business_name} isSubHeader={true} />
                          }
                          key={`${index}-${locationIndex}`}
                          collapsible={isEmpty(location.business_name) ? 'disabled' : undefined}>
                          <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                            <TextForm label="Location Function">
                              {location.functional_types.map((type) => type.name).join(',')}
                            </TextForm>
                            <TextForm label="Address">{location.address}</TextForm>
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
                            <TextForm label="General Email">{location.general_email}</TextForm>
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

export default LocationDesign;
