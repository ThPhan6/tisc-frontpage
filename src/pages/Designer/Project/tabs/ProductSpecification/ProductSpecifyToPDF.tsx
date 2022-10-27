import { FC, useEffect, useState } from 'react';

import { ProductSpecifiedTabKeys, ProductSpecifiedTabs } from '../../constants/tab';
import { Col, Row } from 'antd';

import { createPDF, getSpecifiedProductByPDF } from '@/features/project/services';

import { DEFAULT_VALUE_DETAIL_PDF, DetailPDF, TemplatesItem } from './type';

import IssuingInformation from './components/IssuingInformation';
import { PreviewPDF } from './components/PreviewPDF';
import CoverStandardPage from './components/StandardCoverPage';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from './index.less';
import { hidePageLoading, showPageLoading } from '@/features/loading/loading';

interface ProductSpecififyPDF {
  projectId: string;
}

const ProductSpecifyToPDF: FC<ProductSpecififyPDF> = ({ projectId }) => {
  const [selectedTab, setSelectedTab] = useState<ProductSpecifiedTabKeys>(
    ProductSpecifiedTabKeys.issuingInformation,
  );
  const [data, setData] = useState<DetailPDF>(DEFAULT_VALUE_DETAIL_PDF);
  const [generatepdf, setGeneratePDF] = useState<any>();

  const getCoverStandardIds = (templateIds: string[], coverAndStandard: TemplatesItem[]) => {
    const ids: string[] = [];
    let coverIds = undefined;
    templateIds.forEach((template) => {
      coverAndStandard.forEach((coverStandard) => {
        const result = coverStandard.items.find((item) => item.id === template);
        if (result) {
          coverIds = result;
          ids.push(coverIds.id);
        }
      });
    });
    return ids;
  };

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
              template_cover_ids: getCoverStandardIds(res.config.template_ids, res.templates.cover),
              template_standard_ids: getCoverStandardIds(
                res.config.template_ids,
                res.templates.specification,
              ),
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

  const onPreview = () => {
    showPageLoading();
    createPDF(data.config.project_id, {
      location_id: data.config.location_id,
      issuing_for_id: data.config.issuing_for_id,
      revision: data.config.revision,
      has_cover: data.config.has_cover,
      document_title: data.config.document_title,
      template_ids: data.config.has_cover
        ? [...data.config.template_cover_ids, ...data.config.template_standard_ids]
        : data.config.template_standard_ids,
    }).then((res) => {
      setGeneratePDF(res);
      hidePageLoading();
    });
  };

  return (
    <Row className={styles.content}>
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
            <CoverStandardPage data={data} onChangeData={onChangeData} type="cover" />
          </CustomTabPane>
          <CustomTabPane active={selectedTab === ProductSpecifiedTabKeys.standardSpecification}>
            <CoverStandardPage
              data={data}
              onChangeData={onChangeData}
              type="standard"
              onPreview={onPreview}
            />
          </CustomTabPane>
        </div>
      </Col>
      <Col span={12} className={styles.content_right}>
        <PreviewPDF generatePDF={generatepdf} data={data} />
      </Col>
    </Row>
  );
};
export default ProductSpecifyToPDF;
