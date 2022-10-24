export interface GeneralData {
  id: string;
  name: string;
}
export interface KeyValueData {
  key: string;
  value: string | number;
}

export enum RespondedOrPendingStatus {
  'Pending',
  'Responded',
}

export enum ActiveStatus {
  Active = 1,
  Inactive = 2,
  Pending = 3,
}
export type ActiveStatusKey = keyof typeof ActiveStatus;
