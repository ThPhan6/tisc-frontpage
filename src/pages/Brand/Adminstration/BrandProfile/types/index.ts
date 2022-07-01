export type BrandProfileProp = {
  brand: string;
  company: string;
  image: string;
  slogan: string;
  mission: string;
  website: WebsiteValueProp[];
};

export type WebsiteValueProp = {
  country: string;
  url: string;
};

export const brandProfileValueDefault = {
  brand: '',
  company: '',
  image: '',
  slogan: '',
  mission: '',
  website: [],
};

export const websiteValueDefautl = {
  country: '',
  url: '',
};

export interface ItemWebsiteProp {
  value: WebsiteValueProp;
  onChange: (value: WebsiteValueProp) => void;
}
