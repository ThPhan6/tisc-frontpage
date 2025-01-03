export interface PermissionItem {
  accessable: boolean;
  name: string;
  id: string;
}

export interface PermissionData {
  id: string;
  logo: string;
  name: string;
  parent_id: string | null;
  items: PermissionItem[];
  subs?: PermissionData[];
}
