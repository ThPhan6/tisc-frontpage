export enum SupportCategories {
  wood = 'wood',
  stone = 'stone',
}

export interface RBGProps {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HSBProps {
  h: number;
  s: number;
  b: number;
}

export interface HSLProps {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface CYMKProps {
  c: number;
  m: number;
  y: number;
  k: number;
  a?: number;
}

export interface HWBProps {
  h: number;
  w: number;
  b: number;
  a?: number;
}

export interface LABProps {
  l: number;
  a: number;
  b: number;
}

export interface nCOLProps {
  ncol: string;
  w: number;
  b: number;
  a?: number;
}

export interface ColorOriginRrops {
  red: number;
  green: number;
  blue: number;
  hue: number;
  sat: number;
  lightness: number;
  whiteness: number;
  blackness: number;
  cyan: number;
  magenta: number;
  yellow: number;
  black: number;
  ncol?: string;
  opacity: number;
  temperature: string;
  valid?: boolean;
}

export interface ColorCoversionAnalysisProps {
  hex: string;
  rgb: RBGProps;
  hsl: HSLProps;
  cmyk: CYMKProps;
  hwb: HWBProps;
  lab: LABProps;
}

export interface ColorConversionProps {
  conversion: {
    origin: ColorOriginRrops;
    hex: string;
    rgb: RBGProps;
    hsl: HSLProps;
    cmyk: CYMKProps;
    hwb: HWBProps;
    lab: LABProps;
    nCol: nCOLProps;
    name: string;
  };
  colors_fetched_counts: string;
  density: number;
}

export interface ColourAIResponse {
  data: {
    recommendation_collection: { id: string; name: string };
    images: {
      name: string;
      color_specification: ColorConversionProps[];
    }[];
  };
}
