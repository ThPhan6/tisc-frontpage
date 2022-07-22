import { WebsiteUrlItem } from '@/types/user.type';

export const websiteValueDefautl = {
  country_id: '',
  url: '',
};

export interface UpdateBrandProfileRequestBody {
  name: string;
  parent_company: string;
  slogan: string;
  mission_n_vision: string;
  official_websites: WebsiteUrlItem[];
}

export interface WebsiteUrl {
  websiteValue: WebsiteUrlItem;
  onChange: (value: WebsiteUrlItem) => void;
  onDeleteWebsiteItem: () => void;
}

export interface LogoBrandProfile {
  logo: string;
}

export const logoValueDefault = {
  logo: '',
};
