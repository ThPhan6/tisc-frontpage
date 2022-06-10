export type UpdateTeamProfileBodyProp = {
  backup_email: string;
  personal_mobile: string;
  linkedin: string;
  zone_code: string;
};

export interface PersonalProfileProps {
  isLoading: {
    value: boolean;
    setValue: (value: boolean) => void;
  };
}

export type PersonalProfileValueProp = {
  backupEmail: string;
  mobile: {
    zoneCode: string;
    phoneNumber: string;
  };
  linkedin: string;
};

export const defaultPersonalProfileValue = {
  backupEmail: '',
  mobile: {
    zoneCode: '',
    phoneNumber: '',
  },
  linkedin: '',
};
