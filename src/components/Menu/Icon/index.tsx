import { ReactComponent as AdminstrationIcon } from '@/assets/icons/adminstration-icon.svg';
import { ReactComponent as AttributeIcon } from '@/assets/icons/attributes-icon.svg';
import { ReactComponent as BasisIcon } from '@/assets/icons/basis-icon.svg';
import { ReactComponent as BilledServiceIcon } from '@/assets/icons/billed-service-icon.svg';
import { ReactComponent as BrandIcon } from '@/assets/icons/brand-icon.svg';
import { ReactComponent as CategoryIcon } from '@/assets/icons/category-icon.svg';
import { ReactComponent as GeneralInquiryIcon } from '@/assets/icons/chat-icon.svg';
import { ReactComponent as ConfigurationIcon } from '@/assets/icons/configuration-icon.svg';
import { ReactComponent as DesignFirmIcon } from '@/assets/icons/design-firm-icon.svg';
import { ReactComponent as DistributorIcon } from '@/assets/icons/distributor.svg';
import { ReactComponent as DocumentationIcon } from '@/assets/icons/documentation-icon.svg';
import { ReactComponent as GeneralInquireIcon } from '@/assets/icons/general-inquire-icon.svg';
import { ReactComponent as ListingIcon } from '@/assets/icons/listing-icon.svg';
import { ReactComponent as LocationIcon } from '@/assets/icons/location-icon.svg';
import { ReactComponent as MatketAvailability } from '@/assets/icons/market-availability-icon.svg';
import { ReactComponent as MaterialProductCode } from '@/assets/icons/material-product-code-icon.svg';
import { ReactComponent as MessageIcon } from '@/assets/icons/messages-icon.svg';
import { ReactComponent as MyFavouriteIcon } from '@/assets/icons/my-favourite-icon.svg';
import { ReactComponent as OfficeLibrary } from '@/assets/icons/office-library-icon.svg';
import { ReactComponent as OfficeProfile } from '@/assets/icons/office-profile-icon.svg';
import { ReactComponent as ProductIcon } from '@/assets/icons/product-icon.svg';
import { ReactComponent as ProjectIcon } from '@/assets/icons/project-icon.svg';
import { ReactComponent as ProjectTrackingIcon } from '@/assets/icons/project-tracking.svg';
import { ReactComponent as RevenueIcon } from '@/assets/icons/revenue-icon.svg';
import { ReactComponent as TeamProfileIcon } from '@/assets/icons/team-profile-icon.svg';
import { ReactComponent as UserGroupIcon } from '@/assets/icons/user-group-icon.svg';
import { ReactComponent as WorkspaceIcon } from '@/assets/icons/workspace-icon.svg';

const IconList = {
  'adminstration-icon.svg': <AdminstrationIcon className="anticon" />,
  'attributes-icon.svg': <AttributeIcon className="anticon" />,
  'basis-icon.svg': <BasisIcon className="anticon" />,
  'brand-icon.svg': <BrandIcon className="anticon" />,
  'category-icon.svg': <CategoryIcon className="anticon" />,
  'configuration-icon.svg': <ConfigurationIcon className="anticon" />,
  'design-firm-icon.svg': <DesignFirmIcon className="anticon" />,
  'office-library-icon.svg': <OfficeLibrary className="anticon" />,
  'documentation-icon.svg': <DocumentationIcon className="anticon" />,
  'listing-icon.svg': <ListingIcon className="anticon" />,
  'location-icon.svg': <LocationIcon className="anticon" />,
  'messages-icon.svg': <MessageIcon className="anticon" />,
  'product-icon.svg': <ProductIcon className="anticon" />,
  'project-icon.svg': <ProjectIcon className="anticon" />,
  'revenue-icon.svg': <RevenueIcon className="anticon" />,
  'team-profile-icon.svg': <TeamProfileIcon className="anticon" />,
  'user-group-icon.svg': <UserGroupIcon className="anticon" />,
  'workspace-icon.svg': <WorkspaceIcon className="anticon" />,
  'my-favourite-icon.svg': <MyFavouriteIcon className="anticon" />,
  'project-tracking-icon.svg': <ProjectTrackingIcon className="anticon" />,
  'general-inquire-icon.svg': <GeneralInquireIcon className="anticon" />,
  'general-inquiry-icon.svg': <GeneralInquiryIcon className="anticon" />,
  'distributor-icon.svg': <DistributorIcon className="anticon" />,
  'market-availability-icon.svg': <MatketAvailability className="anticon" />,
  'office-profile-icon.svg': <OfficeProfile className="anticon" />,
  'material-product-code.svg': <MaterialProductCode className="anticon" />,
  'billed-service-icon.svg': <BilledServiceIcon className="anticon" />,
};
export const renderIconByName = (key: any, unaccessible: boolean): React.ReactNode => {
  if (key && IconList[key] && !unaccessible) {
    return IconList[key];
  }
  return null;
};
