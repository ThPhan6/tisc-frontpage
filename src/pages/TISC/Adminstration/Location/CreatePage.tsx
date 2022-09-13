import React from 'react';

import { PATH } from '@/constants/path';

import LocationCreatePage from '@/features/locations/components/LocationCreatePage';

const TISCLocationCreatePage: React.FC = () => <LocationCreatePage tableLink={PATH.tiscLocation} />;

export default TISCLocationCreatePage;
