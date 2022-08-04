import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { FormGroup } from '@/components/Form';
import { RenderLabelHeader } from '@/components/RenderHeaderLabel';
import { useGetParam } from '@/helper/hook';
import { getListDistributorGroupCountryByBrandId } from '@/services';
import { DistributorResponseForm } from '@/types/distributor.type';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/details.less';

const BrandDistributorDetail = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

  const [distributors, setDistributors] = useState<DistributorResponseForm[]>([]);

  const brandId = useGetParam();

  useEffect(() => {
    if (brandId) {
      getListDistributorGroupCountryByBrandId(brandId).then(setDistributors);
    }
  }, []);

  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={`${indexStyles.form} ${styles.distributor_form}`}>
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
                  {location.distributors?.map((distributor, idx) => (
                    <Collapse.Panel
                      header={<RenderLabelHeader header={distributor.name} isSubHeader={true} />}
                      key={`${index}-${idx}`}
                      collapsible={isEmpty(distributor.name) ? 'disabled' : undefined}
                      // className="site-collapse-custom-panel"
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
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
