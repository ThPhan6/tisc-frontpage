import { useState } from 'react';

import { ProductSpecifiedTabKeys, ProductSpecifiedTabs } from '../../constants/tab';
import { Col, Row } from 'antd';

import PageTemplate from '@/assets/images/page.png';

import CoverAndPreamble from './components/CoverAndPreamble';
import IssuingInformation from './components/IssuingInformation';
import { StandardSpecification } from './components/StandardSpecification';
import CustomButton from '@/components/Button';
import CustomPaginator from '@/components/Table/components/CustomPaginator';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import styles from './index.less';

const data = {
  config: {
    created_at: '2022-10-12 11:27:55',
    created_by: '1110813b-8422-4e94-8d2a-8fdef644480e',
    document_title: '',
    has_cover: false,
    id: '7b3db8c8-b9c8-4fe1-81cd-784226ffc17e',
    issuing_date: '',
    issuing_for_id: '',
    location_id: '',
    project_id: '1',
    revision: '',
    template_ids: [],
    updated_at: null,
  },
  templates: {
    cover: [
      {
        name: 'Standard Preambles (select relevant ones)',
        items: [
          {
            created_at: '2022-10-12T02:27:04.290Z',
            group: 1,
            id: 'b10e1c5d-2ddf-4f9d-b3d6-504de51dd44f',
            name: 'General Conditions',
            pdf_url: '/templates/introduction/General-Conditions.pdf',
            preview_url: '/templates/introduction/General-Conditions.jpg',
            sequence: 5,
            updated_at: '2022-10-12T02:27:04.290Z',
          },
          {
            created_at: '2022-10-12T02:27:04.290Z',
            group: 1,
            id: '79848e8c-ef1f-4fc3-b6c2-3540000cb306',
            name: 'Principals & Definitions',
            pdf_url: '/templates/introduction/Principals-and-Definitions.pdf',
            preview_url: '/templates/introduction/Principals-and-Definitions.jpg',
            sequence: 3,
            updated_at: '2022-10-12T02:27:04.290Z',
          },
          {
            created_at: '2022-10-12T02:27:04.290Z',
            group: 1,
            id: '268f8018-8c1e-4268-a028-ac76ab6f5741',
            name: 'Submittal & Review',
            pdf_url: '/templates/introduction/Submittal-and-Review.pdf',
            preview_url: '/templates/introduction/Submittal-and-Review.jpg',
            sequence: 4,
            updated_at: '2022-10-12T02:27:04.290Z',
          },
          {
            created_at: '2022-10-12T02:27:04.290Z',
            group: 1,
            id: 'e3396f7e-16b1-4386-875e-0d9812490b7a',
            name: 'Copyright & Protocol',
            pdf_url: '/templates/introduction/Copyright-and-Protocol.pdf',
            preview_url: '/templates/introduction/Copyright-and-Protocol.jpg',
            sequence: 2,
            updated_at: '2022-10-12T02:27:04.290Z',
          },
          {
            created_at: '2022-10-12T02:27:04.287Z',
            group: 1,
            id: 'd4d05f5f-4b71-4f4c-a27c-aee3b4eaffc7',
            name: 'Guideline',
            pdf_url: '/templates/introduction/Guideline.pdf',
            preview_url: '/templates/introduction/Guideline.jpg',
            sequence: 1,
            updated_at: '2022-10-12T02:27:04.287Z',
          },
        ],
      },
    ],
    specification: [
      {
        name: 'Brands & Distributors',
        items: [
          {
            created_at: '2022-10-12T02:27:04.291Z',
            group: 2,
            id: 'c948de8d-68a9-4100-8247-a7f96fe062fb',
            name: 'Wallcovering',
            pdf_url: '/templates/preambles/Wallcovering.pdf',
            preview_url: '/templates/preambles/Wallcovering.jpg',
            sequence: 24,
            updated_at: '2022-10-12T02:27:04.291Z',
          },
          {
            created_at: '2022-10-12T02:27:04.291Z',
            group: 2,
            id: 'c3789410-8668-49df-8f4f-85bdd7135e2f',
            name: 'Stone & Tile',
            pdf_url: '/templates/preambles/Stone-And-Tile.pdf',
            preview_url: '/templates/preambles/Stone-And-Tile.jpg',
            sequence: 22,
            updated_at: '2022-10-12T02:27:04.291Z',
          },
        ],
      },
      {
        name: 'Finishes, Materials & Products',
        items: [
          {
            created_at: '2022-10-12T02:27:04.291Z',
            group: 3,
            id: '3f46d04f-fbb8-406a-8028-06338dd443f2',
            name: 'Distributor Contact Reference by Category',
            pdf_url: '',
            preview_url:
              '/templates/specification/brand-distributor/Distributor-Contact-Reference-By-Category.jpg',
            sequence: 27,
            updated_at: '2022-10-12T02:27:04.291Z',
          },
          {
            created_at: '2022-10-12T02:27:04.291Z',
            group: 3,
            id: '41b4b646-1051-40f9-841a-bf193f3f5c13',
            name: 'Brand Contact Reference by Category',
            pdf_url: '',
            preview_url:
              '/templates/specification/brand-distributor/Brand-Contact-Reference-By-Category.jpg',
            sequence: 26,
            updated_at: '2022-10-12T02:27:04.291Z',
          },
        ],
      },
      {
        name: 'Schedules & Specifications',
        items: [
          {
            created_at: '2022-10-12T02:27:04.291Z',
            group: 4,
            id: '6af239fe-5ff1-4587-b71c-4026f8c8dbd4',
            name: 'Finished, Materials & Products Reference by Code',
            pdf_url: '',
            preview_url: '/templates/specification/finish-material-product/Listing-By-Code.jpg',
            sequence: 31,
            updated_at: '2022-10-12T02:27:04.291Z',
          },
          {
            created_at: '2022-10-12T02:27:04.291Z',
            group: 4,
            id: '264010de-b990-49c1-8113-29a48662b84d',
            name: 'Finished, Materials & Products Reference by Brand',
            pdf_url: '',
            preview_url: '/templates/specification/finish-material-product/Reference-By-Brand.jpg',
            sequence: 30,
            updated_at: '2022-10-12T02:27:04.291Z',
          },
        ],
      },
      {
        name: 'Zones / Areas / Rooms',
        items: [
          {
            created_at: '2022-10-12T02:27:04.291Z',
            group: 5,
            id: 'a3bbfc2c-b7c5-4ca8-9bbe-563329ec4c56',
            name: 'Finishes, Materials & Products Specification',
            pdf_url: '',
            preview_url:
              '/templates/specification/schedule-specification/Finishes-Materials-And-Products-Specification.jpg',
            sequence: 33,
            updated_at: '2022-10-12T02:27:04.291Z',
          },
          {
            created_at: '2022-10-12T02:27:04.291Z',
            group: 5,
            id: 'fe618a97-af93-410a-87ae-5b688682407c',
            name: 'Finish Schedule by Room',
            pdf_url: '',
            preview_url:
              '/templates/specification/schedule-specification/Finish-Schedule-By-Room.jpg',
            sequence: 32,
            updated_at: '2022-10-12T02:27:04.291Z',
          },
        ],
      },
    ],
  },
};
const ProductSpecifyToPDF = () => {
  const [selectedTab, setSelectedTab] = useState<ProductSpecifiedTabKeys>(
    ProductSpecifiedTabKeys.issuingInformation,
  );
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
            />
            <CustomTabPane active={selectedTab === ProductSpecifiedTabKeys.issuingInformation}>
              <IssuingInformation />
            </CustomTabPane>
            <CustomTabPane active={selectedTab === ProductSpecifiedTabKeys.coverAndPreamble}>
              <CoverAndPreamble data={data} />
            </CustomTabPane>
            <CustomTabPane active={selectedTab === ProductSpecifiedTabKeys.standardSpecification}>
              <StandardSpecification data={data} />
            </CustomTabPane>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.content_right}>
            <div className={styles.pdf}>
              <img src={PageTemplate} />
            </div>
            <div className={styles.customPagination}>
              <CustomPaginator fetchData={() => {}} pagination={{}} dataLength={0} sorter={{}} />
              <div className={styles.action}>
                <CustomButton size="small" properties="rounded">
                  Download
                </CustomButton>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductSpecifyToPDF;
