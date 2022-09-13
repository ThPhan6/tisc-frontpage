import React from 'react';

import { PATH } from '@/constants/path';

import LocationUpdatePage from '@/features/locations/components/LocationUpdatePage';

const BrandLocationUpdatePage: React.FC = () => (
  <LocationUpdatePage tableLink={PATH.brandLocation} />
);

export default BrandLocationUpdatePage;
