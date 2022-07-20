export interface PermissionItem {
  accessable: null | boolean;
  name: string;
  id: string;
}

export interface PermissionData {
  logo: string;
  accessable: null | boolean;
  name: string;
  number: number;
  parent_number: number | null;
  items: PermissionItem[];
  subs?: PermissionData[];
}
