export interface WebsiteUrlItem {
  country_id: string;
  url: string;
}

export const websiteValueDefautl: WebsiteUrlItem = {
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

export const initialBrandProfileState: UpdateBrandProfileRequestBody = {
  mission_n_vision: '',
  name: '',
  parent_company: '',
  slogan: '',
  official_websites: [],
};

export interface WebsiteUrl {
  websiteValue: WebsiteUrlItem;
  onChange: (value: WebsiteUrlItem) => void;
  onDeleteWebsiteItem: () => void;
}

export interface LogoBrandProfile {
  logo: string;
}
