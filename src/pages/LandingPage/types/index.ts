import type { STATUS_RESPONSE } from '@/constants/util';

export type LoginInput = {
  email: string;
  password: string;
};

export enum UserType {
  TISC = 1,
  Brand = 2,
  Designer = 3,
  Partner = 4,
}

export type LoginResponseProps = {
  message: STATUS_RESPONSE;
  statusCode: number;
  token: string;
  type: UserType;
};

export type UserInfoDataProp = {
  id: string;
  role_id: string;
  permissions: any;
  access_level: string;
  firstname: string;
  lastname: string;
  gender: string;
  location: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
  phone_code: string;
  avatar: string;
  backup_email: string;
  personal_mobile: string;
  personal_phone_code: string;
  linkedin: string;
  type: UserType;
  interested: number[];
  retrieve_favourite: boolean;
  remark: string;
};

export type PasswordInput = {
  password: string;
  confirmPassword: string;
};
export type PasswordRequestBody = {
  password: string;
  confirmed_password: string;
  reset_password_token?: string;
  captcha: string;
};

export interface ModalProps {
  theme?: 'default' | 'dark';
  visible: boolean;
  onClose: () => void;
}

export type SignUpDesignerRequestBody = {
  firstname: string;
  email: string;
  password: string;
  confirmed_password: string;
  captcha: string;
};

export type ContactRequestBody = {
  name: string;
  email: string;
  inquiry: string;
};

export type Policy = {
  id: string;
  title: string;
  document: {
    document: '';
  };
};

export interface InformationBooking {
  brand_name: string;
  website: string;
  name: string;
  email: string;
  agree_tisc?: boolean;
  date: string;
  slot: number;
  timezone: string;
  id: string;
  time_text: string;
  start_time_text: string;
  end_time_text: string;
}

export interface AvailableTime {
  start: string;
  end: string;
  available: boolean;
  slot: number;
}

export enum SlotTime {
  EightToNine,
  NineToTen,
  TenToEleven,
  EleventToTwelve,
  FourteenToFifteen,
  FifteenToSixteen,
  SixteenToSeventeen,
  SeventeenToEighteen,
}

export enum Timezones {
  'Europe/Paris' = 'GMT +1:00 Central Europe Standard Time',
  'Europe/Athens' = 'GMT +2:00 East Europe Standard Time',
  'Asia/Qatar' = 'GMT +3:00 East Africa Standard Time',
  'Asia/Dubai' = 'GMT +4:00 Arabian Standard Time',
  'Asia/Tashkent' = 'GMT +5:00 West Asia Standard Time',
  'Asia/Dhaka' = 'GMT +6:00 Central Asia Standard Time',
  'Asia/Bangkok' = 'GMT +7:00 South East Asia Standard Time',
  'Asia/Singapore' = 'GMT +8:00 Singapore Standard Time',
  'Asia/Tokyo' = 'GMT +9:00 Tokyo Standard Time',
  'Pacific/Guam' = 'GMT +10:00 West Pacific Standard Time',
  'Australia/Sydney' = 'GMT +11:00 Central Pacific Standard Time',
  'Pacific/Fiji' = 'GMT +12:00 New Zealand Standard Time',
  'Pacific/Midway' = 'GMT -11:00 Midway Islands Standard Time',
  'America/Adak' = 'GMT -10:00 Hawaii Standard Time',
  'America/Metlakatla' = 'GMT -9:00 Alaska Standard Time',
  'America/Vancouver' = 'GMT -8:00 Pacific Standard Time',
  'America/Boise' = 'GMT -7:00 Mountain Standard Time',
  'America/Chicago' = 'GMT -6:00 Central America Standard Time',
  'America/New_York' = 'GMT -5:00 Eastern Standard Time',
  'America/Dominica' = 'GMT -4:00 Atlantic Standard Time',
  'America/Araguaina' = 'GMT -3:00 East South America Standard Time',
  'Atlantic/South_Georgia' = 'GMT -2:00 Mid-Atlantic Standard Time',
  'Atlantic/Cape_Verde' = 'GMT -1:00 Central African Standard Time',
}
export interface BookingPayloadRequest {
  brand_name: string;
  website: string;
  name: string;
  email: string;
  date: string;
  slot: number;
  timezone: string;
  captcha: string;
}
