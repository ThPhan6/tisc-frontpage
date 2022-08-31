import { ProjectBodyRequest, ProjectSpaceArea, ProjectSpaceRoom, ProjectSpaceZone } from '@/types';

import { FilterValues } from './filter';

export const DefaultProjectRequest: ProjectBodyRequest = {
  name: '',
  code: '',
  country_id: '',
  state_id: '',
  city_id: '',
  address: '',
  postal_code: '',
  project_type_id: '',
  building_type_id: '',
  measurement_unit: 2,
  design_due: '',
  construction_start: '',
  status: FilterValues.live,
};

export const DefaultProjectRoom: ProjectSpaceRoom = {
  room_name: '',
  room_id: '',
  room_size: '',
  quantity: '',
};
export const DefaultProjectArea: ProjectSpaceArea = {
  name: '',
  rooms: [DefaultProjectRoom],
};

export const DefaultProjectZone: ProjectSpaceZone = {
  name: '',
  areas: [],
};
