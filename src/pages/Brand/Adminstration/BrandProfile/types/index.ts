export interface IBrandProfileProp {
  name: string;
  parent_company: string;
  slogan: string;
  mission_n_vision: string;
  official_websites: IWebsiteValueProp[];
}

export interface IWebsiteValueProp {
  country_id: string;
  url: string;
}

export const brandProfileValueDefault = {
  name: '',
  parent_company: '',
  image: '',
  slogan: '',
  mission_n_vision: '',
  official_websites: [],
};

export const websiteValueDefautl = {
  country_id: '',
  url: '',
};

export interface ItemWebsiteProp {
  websiteValue: IWebsiteValueProp;
  onChange: (value: IWebsiteValueProp) => void;
}
