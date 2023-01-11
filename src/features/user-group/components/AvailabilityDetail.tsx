import { FC, useEffect, useState } from 'react';

import { Collapse, Row } from 'antd';

import { isEmpty } from 'lodash';

import { RequiredValueProps } from '../types';
import { AvailabilityCollectionGroup } from '@/features/market-availability/type';

import { ResponsiveCol } from '@/components/Layout';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';
import { BodyText } from '@/components/Typography';

import styles from '../styles/index.less';
import { CollapseLevel1Props, CollapseLevel2Props } from './ExpandIcon';
import GeneralData from './GeneralData';
import { getAvailabilityListCountryGroupByBrandId } from '@/features/market-availability/api';

const AvailabilityDetail: FC<RequiredValueProps> = ({ id }) => {
  const [availability, setAvailability] = useState<AvailabilityCollectionGroup[]>([]);

  useEffect(() => {
    if (!id) return;

    getAvailabilityListCountryGroupByBrandId(id).then(setAvailability);
  }, []);

  return (
    <Row className={styles.container}>
      <ResponsiveCol>
        <div className={styles.form}>
          <GeneralData>
            {availability.length ? (
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
            ) : null}
          </GeneralData>
        </div>
      </ResponsiveCol>
    </Row>
  );
};

export default AvailabilityDetail;
