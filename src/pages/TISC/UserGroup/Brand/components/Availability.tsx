import { useEffect, useState } from 'react';

import { Col, Collapse, Row } from 'antd';

import { useGetParamId } from '@/helper/hook';
import { getAvailabilityListCountryGroupByBrandId } from '@/services';
import { isEmpty } from 'lodash';

import { AvailabilityCollectionGroup } from '@/types';

import GeneralData from '../../components/GeneralData';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';
import { BodyText } from '@/components/Typography';

import { CollapseLevel1Props, CollapseLevel2Props } from '../../icons';
import styles from '../../styles/index.less';

const BrandAvailabilityDetail = () => {
  const [availability, setAvailability] = useState<AvailabilityCollectionGroup[]>([]);

  const brandId = useGetParamId();

  useEffect(() => {
    if (brandId) {
      getAvailabilityListCountryGroupByBrandId(brandId).then(setAvailability);
    }
  }, []);

  return (
    <Row className={styles.container}>
      <Col span={12}>
        <div className={styles.form}>
          <GeneralData>
            {availability.length && (
              <Collapse {...CollapseLevel1Props}>
                {availability.map((collections, index) => (
                  <Collapse.Panel
                    header={
                      <RenderLabelHeader
                        header={collections.collection_name}
                        quantity={collections.count}
                        isSubHeader={false}
                      />
                    }
                    key={index}
                    collapsible={
                      collections.count == 0 || isEmpty(collections.collection_name)
                        ? 'disabled'
                        : undefined
                    }>
                    <Collapse {...CollapseLevel2Props}>
                      {collections.regions?.map((region, regionIdx) => (
                        <Collapse.Panel
                          header={
                            <RenderLabelHeader
                              header={region.region_name}
                              quantity={region.count}
                              isSubHeader={true}
                            />
                          }
                          key={`${index}-${regionIdx}`}
                          collapsible={region.count == 0 ? 'disabled' : undefined}>
                          <BodyText level={5} fontFamily="Roboto" color="mono-color">
                            {region.region_country}
                          </BodyText>
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

export default BrandAvailabilityDetail;
