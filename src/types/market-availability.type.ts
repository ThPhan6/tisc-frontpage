export interface MarketAvailabilityForm {
  collections: string[];
}
export interface MarketAvailabilityDataList {
  africa: number;
  asia: number;
  available_countries: number;
  collection_id: string;
  collection_name: string;
  europe: number;
  north_america: number;
  oceania: number;
  south_america: number;
}
export interface MarketAvailabilityDetailRegionCountry {
  id: number;
  name: string;
  phone_code: string;
  region: string;
  available: boolean;
}
export interface MarketAvailabilityDetailRegion {
  name: string;
  count: number;
  countries: MarketAvailabilityDetailRegionCountry[];
}

export interface MarketAvailabilityDetails {
  collection_id: string;
  collection_name: string;
  total_available: number;
  total: number;
  regions: MarketAvailabilityDetailRegion[];
}

export interface RegionAvailabilityCollection {
  region_name: string;
  count: number;
  region_country: string;
}

export interface AvailabilityCollectionGroup {
  collection_name: string;
  count: number;
  regions: RegionAvailabilityCollection[];
}
