import React from 'react';

import useLocationInfo from './hook';

import { TableLink } from '@/types';

const LocationCreatePage: React.FC<TableLink> = ({ tableLink }) => {
  const { renderLocationTable } = useLocationInfo(tableLink, 'create');

  return renderLocationTable();
};

export default LocationCreatePage;
