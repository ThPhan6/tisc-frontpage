import { FormGroup } from '@/components/Form';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';
import { BodyText } from '@/components/Typography';
import { useGetParam } from '@/helper/hook';
import { getLocationByBrandId } from '@/services';
import { LocationGroupedByCountry } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { CollapseLevel1Props, CollapseLevel2Props } from '../../icons';
import styles from '../../styles/index.less';

const BrandLocationDetail = () => {
  const [locations, setLocations] = useState<LocationGroupedByCountry[]>([]);

  const brandId = useGetParam();

  useEffect(() => {
    if (brandId) {
      getLocationByBrandId(brandId).then(setLocations);
    }
  }, []);

  return (
    <Row className={styles.container}>
      <Col span={12}>
        <div className={styles.form}>
          <Collapse {...CollapseLevel1Props}>
            {locations.length &&
              locations.map((country, index) => (
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
                >
                  <Collapse {...CollapseLevel2Props}>
                    {country.locations?.map((location, locationIndex) => (
                      <Collapse.Panel
                        header={
                          <RenderLabelHeader header={location.business_name} isSubHeader={true} />
                        }
                        key={`${index}-${locationIndex}`}
                        collapsible={isEmpty(location.business_name) ? 'disabled' : undefined}
                      >
                        <div className={styles.info}>
                          {/* <FormGroup
                            label="Registered Number"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: location.business_number ?? '',
                            }}
                          /> */}
                          <FormGroup
                            label="Registered Number"
                            labelColor="mono-color-medium"
                            layout="vertical"
                          >
                            <BodyText level={5} fontFamily="Roboto">
                              {location.business_number ?? ''}
                            </BodyText>
                          </FormGroup>
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
