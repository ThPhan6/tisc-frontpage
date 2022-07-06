import { RadioValue } from '@/components/CustomRadio/types';
import { PhoneInputValueProp } from '@/components/Form/types';

export interface TeamProfilesProps {
  firstname: string;
  lastname: string;
  location_id: string;
  position: string;
  email: string;
  phone: PhoneInputValueProp;
  mobile: PhoneInputValueProp;
  gender: RadioValue;
  department: RadioValue;
  access_level: RadioValue;
  status: boolean;
}

export interface AccessLevelModalProps {}

export type typeInput = 'firstname' | 'lastname' | 'position' | 'email';

export type typePhoneInput = 'phone' | 'mobile';

export type typeRadio = 'gender' | 'department' | 'access_level';
