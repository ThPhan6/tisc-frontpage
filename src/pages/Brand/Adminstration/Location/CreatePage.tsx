import React from 'react';

import { PATH } from '@/constants/path';

import LocationCreatePage from '@/features/locations/components/LocationCreatePage';

const BrandLocationCreatePage: React.FC = () => (
  <LocationCreatePage tableLink={PATH.brandLocation} />
);

export default BrandLocationCreatePage;
