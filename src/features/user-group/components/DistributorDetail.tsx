import { FC, useEffect, useState } from 'react';

import { COVERAGE_BEYOND } from '@/constants/util';
import { Col, Collapse, Row } from 'antd';

import { getValueByCondition } from '@/helper/utils';
import { isEmpty } from 'lodash';

import { RequiredValueProps } from '../types';
import { DistributorResponseForm } from '@/features/distributors/type';

import TextForm from '@/components/Form/TextForm';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';

import styles from '../styles/index.less';
import { CollapseLevel1Props, CollapseLevel2Props } from './ExpandIcon';
import GeneralData from './GeneralData';
import { getListDistributorGroupCountryByBrandId } from '@/features/distributors/api';

const DistributorDetail: FC<RequiredValueProps> = ({ id }) => {
  const [distributors, setDistributors] = useState<DistributorResponseForm[]>([]);

  useEffect(() => {
    if (!id) return;

    getListDistributorGroupCountryByBrandId(id).then(setDistributors);
  }, []);

  const getCoverageBeyond = (coverageBeyond: boolean) =>
    getValueByCondition(
      [
        [coverageBeyond === COVERAGE_BEYOND.notAllow, 'Not Allow'],
        [coverageBeyond === COVERAGE_BEYOND.allow, 'Allow'],
      ],
      '',
    );

  return (
    <Row className={styles.container}>
      <Col span={12}>
        <div className={styles.form}>
          <GeneralData>
            {distributors.length ? (
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
                    }>
                    <Collapse {...CollapseLevel2Props}>
                      {location.distributors?.map((distributor, idx) => (
                        <Collapse.Panel
                          header={
                            <RenderLabelHeader header={distributor.name} isSubHeader={true} />
                          }
                          key={`${index}-${idx}`}
                          collapsible={isEmpty(distributor.name) ? 'disabled' : undefined}>
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
                              {getCoverageBeyond(distributor.coverage_beyond)}
                            </TextForm>
                          </div>
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                  </Collapse.Panel>
                ))}
              </Collapse>
            ) : null}
          </GeneralData>
        </div>
      </Col>
    </Row>
  );
};

export default DistributorDetail;
