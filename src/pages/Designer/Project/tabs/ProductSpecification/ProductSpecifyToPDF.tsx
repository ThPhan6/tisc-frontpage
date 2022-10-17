import { FC, useEffect, useState } from 'react';

import { ProductSpecifiedTabKeys, ProductSpecifiedTabs } from '../../constants/tab';
import { Col, Row } from 'antd';

import PageTemplate from '@/assets/images/page.png';

import { getSpecifiedProductByPDF } from '@/features/project/services';

import { DEFAULT_VALUE, DetailPDF } from './type';

import CoverStandard from './components/CoverStandard';
import IssuingInformation from './components/IssuingInformation';
import CustomButton from '@/components/Button';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from './index.less';

interface ProductSpecififyPDF {
  projectId: string;
}
const ProductSpecifyToPDF: FC<ProductSpecififyPDF> = ({ projectId }) => {
  const [selectedTab, setSelectedTab] = useState<ProductSpecifiedTabKeys>(
    ProductSpecifiedTabKeys.issuingInformation,
  );
  const [data, setData] = useState<DetailPDF>(DEFAULT_VALUE);

  useEffect(() => {
    if (projectId) {
      getSpecifiedProductByPDF(projectId).then((res) => {
        if (res) {
          setData({
            config: {
              created_at: res.config.created_at,
              created_by: res.config.created_by,
              document_title: res.config.document_title,
              has_cover: res.config.has_cover,
              id: res.config.id,
              issuing_date: res.config.issuing_date,
              issuing_for_id: res.config.issuing_for_id,
              location_id: res.config.location_id,
              project_id: res.config.project_id,
              revision: res.config.revision,
              template_ids: res.config.template_ids,
              updated_at: res.config.updated_at,
              template_cover_ids: [],
              template_standard_ids: [],
            },
            templates: res.templates,
          });
        }
      });
    }
  }, []);

  const onChangeData = (newData: DetailPDF) => {
    setData((prevState) => ({
      ...prevState,
      ...newData,
    }));
  };

  return (
    <div className={styles.content}>
      <Row>
        <Col span={12}>
          <div className={styles.content_left}>
            <CustomTabs
              listTab={ProductSpecifiedTabs}
              centered={true}
              tabPosition="top"
              tabDisplay="space"
              className={styles.projectTabInfo}
              onChange={(changedKey) => setSelectedTab(changedKey as ProductSpecifiedTabKeys)}
              activeKey={selectedTab}
              style={{ padding: '16px 16px 0 16px' }}
            />
            <CustomTabPane active={selectedTab === ProductSpecifiedTabKeys.issuingInformation}>
              <IssuingInformation data={data} onChangeData={onChangeData} />
            </CustomTabPane>
            <CustomTabPane active={selectedTab === ProductSpecifiedTabKeys.coverAndPreamble}>
              <CoverStandard data={data} onChangeData={onChangeData} type="cover" />
            </CustomTabPane>
            <CustomTabPane active={selectedTab === ProductSpecifiedTabKeys.standardSpecification}>
              <CoverStandard data={data} onChangeData={onChangeData} type="standard" />
            </CustomTabPane>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.content_right}>
            <div className={styles.pdf}>
              <img src={PageTemplate} />
            </div>
            <div className={styles.action}>
              <CustomButton size="small" properties="rounded">
                Download
              </CustomButton>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default ProductSpecifyToPDF;
