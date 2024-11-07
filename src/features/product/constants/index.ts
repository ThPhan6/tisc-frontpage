import { FeatureLabelPros } from '../types';

export const DEFAULT_ECO_LABELS: FeatureLabelPros = {
  ['carbon_footprint']: {
    name: 'Carbon Footprint Reduction',
    value: false,
  },
  ['clear_energy']: {
    name: 'Clear & Renewable Energy',
    value: false,
  },
  ['eco_green']: {
    name: 'Eco & Green Certification',
    value: false,
  },
  ['power_saving']: {
    name: 'Power Saving Technology',
    value: false,
  },
  ['recycle_reuse']: {
    name: 'Recycle, Reuse, Repurpose',
    value: false,
  },
  ['water_saving']: {
    name: 'Water Saving Technology',
    value: false,
  },
};

export const DEFAULT_PRODUCTION_LABELS: FeatureLabelPros = {
  ['new_release']: {
    name: 'New Release',
    value: false,
  },
  ['promotion']: {
    name: 'Promotion',
    value: false,
  },
  ['limited_edition']: {
    name: 'Limited Edition',
    value: false,
  },
  ['end_soon']: {
    name: 'Production End Soon',
    value: false,
  },
  ['discontinued']: {
    name: 'Discontinued',
    value: false,
  },
};
