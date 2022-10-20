import { BrandProfile } from '@/types/user.type';

export interface WebsiteUrlItem {
  country_id: string;
  url: string;
}

export const websiteValueDefautl: WebsiteUrlItem = {
  country_id: '',
  url: '',
};

export const initialBrandProfileState: Partial<BrandProfile> = {
  mission_n_vision: '',
  name: '',
  logo: '',
  parent_company: '',
  slogan: '',
  official_websites: [],
};

export interface WebsiteUrl {
  websiteValue: WebsiteUrlItem;
  onChange: (value: WebsiteUrlItem) => void;
  onDeleteWebsiteItem: () => void;
}
