export interface ProjectSpaceRoom {
  id?: string;
  room_name: string;
  room_id: string;
  room_size: number | string;
  quantity: number | string;
}
export interface ProjectSpaceArea {
  id?: string;
  name: string;
  rooms: ProjectSpaceRoom[];
}
export interface ProjectSpaceZone {
  id?: string;
  project_id?: string;
  name: string;
  areas: ProjectSpaceArea[];
}
export interface ProjectSpaceListProps extends ProjectSpaceZone {
  count: number;
  areas: {
    count: number;
    id?: string;
    name: string;
    rooms: {
      id?: string;
      room_name: string;
      room_id: string;
      room_size: number;
      quantity: number;
      sub_total: number;
      room_size_unit: number;
    }[];
  }[];
}
