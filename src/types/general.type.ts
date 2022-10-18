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
