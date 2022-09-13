import React from 'react';

import { PATH } from '@/constants/path';

import LocationUpdatePage from '@/features/locations/components/LocationUpdatePage';

const TISCLocationUpdatePage: React.FC = () => <LocationUpdatePage tableLink={PATH.tiscLocation} />;

export default TISCLocationUpdatePage;
