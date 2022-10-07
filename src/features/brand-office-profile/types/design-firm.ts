export interface UpdateOfficeProfileRequestBody {
  name: string;
  parent_company: string;
  slogan: string;
  profile_n_philosophy: string;
  official_website: string;
  design_capabilities: string[];
}

export const initialOfficeProfileState: UpdateOfficeProfileRequestBody = {
  name: '',
  parent_company: '',
  slogan: '',
  profile_n_philosophy: '',
  official_website: '',
  design_capabilities: [],
};

export interface LogoOfficeProfile {
  logo: string;
}
