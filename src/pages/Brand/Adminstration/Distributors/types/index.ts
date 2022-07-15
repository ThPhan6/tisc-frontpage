export interface DistributorsProp {
  distributorName: string;
  country: string;
  province: string;
  city: string;
  address: string;
  zipCode: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  phone: string;
  mobile: string;
  authorizedCountry: string;
  coverageBeyond: string;
}

export const distributorsValueProp = {
  distributorName: '',
  country: '',
  province: '',
  city: '',
  address: '',
  zipCode: '',
  firstName: '',
  lastName: '',
  gender: 'male',
  email: '',
  phone: '',
  mobile: '',
  authorizedCountry: '',
  coverageBeyond: 'not allow',
};
