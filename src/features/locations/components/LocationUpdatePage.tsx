import React, { useEffect, useState } from 'react';

import useLocationInfo from './hook';

import { TableLink } from '@/types';

import { getLocationById } from '@/features/locations/api';

const LocationUpdatePage: React.FC<TableLink> = ({ tableLink }) => {
  const [loadedData, setLoadedData] = useState(false);

  const { renderLocationTable, setData, locationId } = useLocationInfo(tableLink, 'update');

  useEffect(() => {
    getLocationById(locationId).then((res) => {
      if (res) {
        setData({
          business_name: res.business_name,
          business_number: res.business_number,
          country_id: res.country_id,
          state_id: res.state_id,
          city_id: res.city_id,
          address: res.address,
          postal_code: res.postal_code,
          general_phone: res.general_phone,
          general_email: res.general_email,
          functional_type_ids: res.functional_types.map((type) => type.id),
        });
        setLoadedData(true);
      }
    });
  }, []);

  if (!loadedData) {
    return null;
  }

  return renderLocationTable();
};

export default LocationUpdatePage;
