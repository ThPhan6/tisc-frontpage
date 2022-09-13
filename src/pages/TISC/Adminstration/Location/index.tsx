import React from 'react';

import { PATH } from '@/constants/path';

import LocationTable from '@/features/locations/components/LocationTable';

const TISCLocation: React.FC = () => (
  <LocationTable createLink={PATH.tiscLocationCreate} updateLink={PATH.tiscLocationUpdate} />
);

export default TISCLocation;
