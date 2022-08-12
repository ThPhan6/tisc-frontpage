import TextForm from '@/components/Form/TextForm';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';
import { useGetParamId } from '@/helper/hook';
import { getListDistributorGroupCountryByBrandId } from '@/services';
import { DistributorResponseForm } from '@/types/distributor.type';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import GeneralData from '../../components/GeneralData';
import { CollapseLevel1Props, CollapseLevel2Props } from '../../icons';
import styles from '../../styles/index.less';

const BrandDistributorDetail = () => {
  const [distributors, setDistributors] = useState<DistributorResponseForm[]>([]);

  const brandId = useGetParamId();

  useEffect(() => {
    if (brandId) {
      getListDistributorGroupCountryByBrandId(brandId).then(setDistributors);
    }
  }, []);

  return (
    <Row className={styles.container}>
      <Col span={12}>
        <div className={styles.form}>
          <GeneralData>
            {distributors.length && (
              <Collapse {...CollapseLevel1Props}>
                {distributors.map((location, index) => (
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
                          header={
                            <RenderLabelHeader header={distributor.name} isSubHeader={true} />
                          }
                          key={`${index}-${idx}`}
                          collapsible={isEmpty(distributor.name) ? 'disabled' : undefined}
                        >
                          <div className={styles.info}>
                            <TextForm label="Address">{distributor.address ?? ''}</TextForm>
                            <TextForm label="Person in charge">{distributor.person ?? ''}</TextForm>
                            <TextForm label="Gender">
                              {distributor.gender ? 'Male' : 'Female'}
                            </TextForm>
                            <TextForm label="Work Email">{distributor.email ?? ''}</TextForm>
                            <TextForm label="Work Phone">{distributor.phone ?? ''}</TextForm>
                            <TextForm label="Work Mobile">{distributor.mobile ?? ''}</TextForm>
                            <TextForm label="Authorized Countries">
                              {distributor.authorized_country_name ?? ''}
                            </TextForm>
                            <TextForm label="Coverage Beyond">
                              {String(distributor.coverage_beyond) ?? ''}
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

export default BrandDistributorDetail;
