import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { BodyText } from '@/components/Typography';
import { useGetParam } from '@/helper/hook';
import { getAvailabilityListCountryGroupByBrandId } from '@/services';
import { AvailabilityCollectionGroup } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { RenderMainHeader } from '../../components/renderHeader';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/details.less';

const BrandAvailabilityDetail = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

  const [availability, setAvailability] = useState<AvailabilityCollectionGroup[]>([]);

  const brandId = useGetParam();

  useEffect(() => {
    if (brandId) {
      getAvailabilityListCountryGroupByBrandId(brandId).then(setAvailability);
    }
  }, []);

  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={`${indexStyles.form} ${styles.availability_form}`}>
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
            {availability.map((collections, index) => (
              <Collapse.Panel
                // header={renderCollectionHeader(collection)}
                header={
                  collections.collection_name && (
                    <RenderMainHeader
                      header={collections.collection_name}
                      quantity={collections.regions?.length}
                      isUpperCase={false}
                    />
                  )
                }
                key={index}
                collapsible={isEmpty(collections.collection_name) ? 'disabled' : undefined}
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
                  {collections.regions &&
                    collections.regions.map((region, regionIdx) => (
                      <Collapse.Panel
                        header={
                          region.region_name && (
                            <RenderMainHeader
                              header={region.region_name}
                              quantity={region.count}
                              isUpperCase={false}
                            />
                          )
                        }
                        key={`${index}-${regionIdx}`}
                        collapsible={isEmpty(region.region_name) ? 'disabled' : undefined}
                        // className="site-collapse-custom-panel"
                      >
                        <BodyText level={5} fontFamily="Roboto" color="mono-color">
                          {region.region_country}
                        </BodyText>
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

export default BrandAvailabilityDetail;
