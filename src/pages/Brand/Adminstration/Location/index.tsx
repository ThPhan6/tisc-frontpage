import React from 'react';

import { PATH } from '@/constants/path';

import LocationTable from '@/features/locations/components/LocationTable';

const BrandLocation: React.FC = () => (
  <LocationTable createLink={PATH.brandLocationCreate} updateLink={PATH.brandLocationUpdate} />
);

export default BrandLocation;
