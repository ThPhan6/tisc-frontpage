import { FormGroup } from '@/components/Form';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';
import { useGetParam } from '@/helper/hook';
import { getListDistributorGroupCountryByBrandId } from '@/services';
import { DistributorResponseForm } from '@/types/distributor.type';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { CollapseLevel1Props, CollapseLevel2Props } from '../../icons';
import styles from '../../styles/index.less';

const BrandDistributorDetail = () => {
  const [distributors, setDistributors] = useState<DistributorResponseForm[]>([]);

  const brandId = useGetParam();

  useEffect(() => {
    if (brandId) {
      getListDistributorGroupCountryByBrandId(brandId).then(setDistributors);
    }
  }, []);

  return (
    <Row className={styles.container}>
      <Col span={12}>
        <div className={styles.form}>
          <Collapse {...CollapseLevel1Props}>
            {distributors.length &&
              distributors.map((location, index) => (
                <Collapse.Panel
                  header={
                    <RenderLabelHeader
                      header={location.country_name}
                      quantity={location.count}
                      isSubHeader={false}
                      isUpperCase={true}
                    />
                  }
                  key={index}
                  collapsible={
                    isEmpty(location.country_name) || location.count == 0 ? 'disabled' : undefined
                  }
                >
                  <Collapse {...CollapseLevel2Props}>
                    {location.distributors?.map((distributor, idx) => (
                      <Collapse.Panel
                        header={<RenderLabelHeader header={distributor.name} isSubHeader={true} />}
                        key={`${index}-${idx}`}
                        collapsible={isEmpty(distributor.name) ? 'disabled' : undefined}
                      >
                        <div className={styles.info}>
                          <FormGroup
                            label="Address"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: distributor.address ?? '',
                            }}
                          />
                          <FormGroup
                            label="Person in charge"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: distributor.person ?? '',
                            }}
                          />
                          <FormGroup
                            label="Gender"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: distributor.gender ? 'Male' : 'Female' ?? '',
                            }}
                          />
                          <FormGroup
                            label="Work Email"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: distributor.email ?? '',
                            }}
                          />
                          <FormGroup
                            label="Work Phone"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: distributor.phone ?? '',
                            }}
                          />
                          <FormGroup
                            label="Work Mobile"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: distributor.mobile ?? '',
                            }}
                          />
                          <FormGroup
                            label="Authorized Countries"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: distributor.authorized_country_name ?? '',
                            }}
                          />
                          <FormGroup
                            label="Coverage Beyond"
                            labelColor="mono-color-medium"
                            layout="vertical"
                            bodyText={{
                              text: String(distributor.coverage_beyond) ?? '',
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

export default BrandDistributorDetail;
