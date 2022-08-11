import TextForm from '@/components/Form/TextForm';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';
import { useGetParamId } from '@/helper/hook';
import { getLocationByBrandId } from '@/services';
import { LocationGroupedByCountry } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { CollapseLevel1Props, CollapseLevel2Props } from '../../icons';
import styles from '../../styles/index.less';

const BrandLocationDetail = () => {
  const [locations, setLocations] = useState<LocationGroupedByCountry[]>([]);

  const brandId = useGetParamId();

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
                          <TextForm label="Registered Number">
                            {location.business_number ?? ''}
                          </TextForm>
                          <TextForm label="Location Function">
                            {location.functional_types.map((type) => type.name).join(', ') ?? ''}
                          </TextForm>
                          <TextForm label="Address">{location.address ?? ''}</TextForm>
                          <TextForm label="General Phone">{location.general_phone ?? ''}</TextForm>
                          <TextForm label="General Email">{location.general_email ?? ''}</TextForm>
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
