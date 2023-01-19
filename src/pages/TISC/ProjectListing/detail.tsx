import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as CloseIcon } from '@/assets/icons/close-icon.svg';
import { ReactComponent as InformationIcon } from '@/assets/icons/info.svg';
import { ReactComponent as OfficeLibrary } from '@/assets/icons/office-library-icon.svg';
import { ReactComponent as SpaceIcon } from '@/assets/icons/space-icon.svg';
import { ReactComponent as SpecifiedIcon } from '@/assets/icons/tabs-add-icon.svg';
import { ReactComponent as ConsideredIcon } from '@/assets/icons/tabs-icon.svg';
import { ReactComponent as TeamIcon } from '@/assets/icons/team-icon.svg';

import { pushTo } from '@/helper/history';
import { useGetParamId } from '@/helper/hook';
import { getFullName } from '@/helper/utils';

import { BrandInfo, CustomProduct, ProjectListingDetail } from './type';
import { TabItem } from '@/components/Tabs/types';

import { BasicInformation } from './components/BasicInformation';
import { ProductAndProjectTab } from './components/ProductAndProjectTab';
import { ProjectListingHeader } from './components/ProjectListingHeader';
import { SpaceTab } from './components/SpaceTab';
import { TableHeader } from '@/components/Table/TableHeader';
import { CustomTabPane, CustomTabs } from '@/components/Tabs';

import { getOneProjectListing } from './api';
import styles from './index.less';

enum ProjectListingTabKeys {
  information = 'Basic Information',
  space = 'Zones/Areas/Rooms',
  productConsidered = 'Product Considered',
  productSpecified = 'Product Specified',
  projectTeam = 'Project Team',
}

const ListTab: TabItem[] = [
  {
    tab: ProjectListingTabKeys.information,
    key: ProjectListingTabKeys.information,
    icon: <InformationIcon style={{ width: '16px', height: '16px' }} />,
  },
  {
    tab: ProjectListingTabKeys.space,
    key: ProjectListingTabKeys.space,
    icon: <SpaceIcon style={{ width: '16px', height: '16px' }} />,
  },
  {
    tab: ProjectListingTabKeys.productConsidered,
    key: ProjectListingTabKeys.productConsidered,
    icon: <ConsideredIcon style={{ width: '16px', height: '16px' }} />,
  },
  {
    tab: ProjectListingTabKeys.productSpecified,
    key: ProjectListingTabKeys.productSpecified,
    icon: <SpecifiedIcon style={{ width: '16px', height: '16px' }} />,
  },
  {
    tab: ProjectListingTabKeys.projectTeam,
    key: ProjectListingTabKeys.projectTeam,
    icon: <TeamIcon style={{ width: '16px', height: '16px' }} />,
  },
];

const ProjectDetail = () => {
  const [selectedTab, setSelectedTab] = useState<ProjectListingTabKeys>(
    ProjectListingTabKeys.information,
  );
  const [projectDetail, setProjectDetail] = useState<ProjectListingDetail>();
  const projectListingId = useGetParamId();

  useEffect(() => {
    if (projectListingId) {
      getOneProjectListing(projectListingId).then((res) => {
        if (res) {
          setProjectDetail(res);
        }
      });
    }
  }, []);

  const getListProduct = (
    products?: { brands: BrandInfo[]; customProducts: CustomProduct[] },
    isSpecified?: boolean,
  ) => {
    const customProductList = products?.customProducts.length
      ? [
          {
            title: 'Office Library & Resources',
            image: <OfficeLibrary style={{ width: '24px', height: '24px' }} />,
            content: products.customProducts.map((product) => ({ ...product, isSpecified })),
          },
        ]
      : [];
    const brandProducts =
      products?.brands.map((el) => ({
        title: el.name,
        image: el.logo,
        content: el.products.map((product) => ({ ...product, isSpecified })),
      })) ?? [];

    return [...customProductList, ...brandProducts];
  };

  return (
    <ProjectListingHeader>
      <TableHeader
        title={projectDetail?.basic.name}
        rightAction={
          <CloseIcon
            onClick={() => pushTo(PATH.tiscProjectListing)}
            style={{ cursor: 'pointer' }}
          />
        }
      />
      <CustomTabs
        listTab={ListTab}
        widthItem="auto"
        customClass={styles.customTabs}
        onChange={(key) => setSelectedTab(key as ProjectListingTabKeys)}
        activeKey={selectedTab}
        hideTitleOnTablet
      />

      {/* Basic Information */}
      <CustomTabPane active={selectedTab === ProjectListingTabKeys.information}>
        <BasicInformation basicInformation={projectDetail?.basic} />
      </CustomTabPane>

      {/* Zones/Areas/Rooms */}
      <CustomTabPane active={selectedTab === ProjectListingTabKeys.space}>
        <SpaceTab space={projectDetail?.spacing} />
      </CustomTabPane>

      {/* Product Considered */}
      <CustomTabPane active={selectedTab === ProjectListingTabKeys.productConsidered}>
        <ProductAndProjectTab
          type="productConsider"
          data={getListProduct(projectDetail?.considered)}
          summary={{
            deleted: projectDetail?.considered.deleted,
            unlisted: projectDetail?.considered.unlisted,
            consider: projectDetail?.considered.consider,
          }}
        />
      </CustomTabPane>

      {/* Product Specified */}
      <CustomTabPane active={selectedTab === ProjectListingTabKeys.productSpecified}>
        <ProductAndProjectTab
          type="productSpecified"
          data={getListProduct(projectDetail?.specified, true)}
          summary={{
            deleted: projectDetail?.specified.deleted,
            specified: projectDetail?.specified.specified,
            cancelled: projectDetail?.specified.cancelled,
          }}
        />
      </CustomTabPane>

      {/* Project Team */}
      <CustomTabPane active={selectedTab === ProjectListingTabKeys.projectTeam}>
        <ProductAndProjectTab
          type="project"
          data={projectDetail?.members.map((el) => ({
            ...el,
            title: getFullName(el),
            image: el.avatar,
            content: {
              id: el.id,
              firstname: el.firstname,
              lastname: el.lastname,
              gender: el.gender,
              work_location: el.work_location,
              position: el.position,
              email: el.email,
              phone: el.phone,
              mobile: el.mobile,
              status: el.status,
              department: el.department,
              phone_code: el.phone_code,
              access_level: el.access_level,
              avatar: el.avatar,
            },
          }))}
          summary={{
            team: projectDetail?.members.length,
          }}
        />
      </CustomTabPane>
    </ProjectListingHeader>
  );
};
export default ProjectDetail;
