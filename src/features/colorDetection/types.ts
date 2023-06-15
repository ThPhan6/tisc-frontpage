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

export const fdata = {
  data: {
    recommendation_collection: {
      id: '40901fbe-f7e4-4781-b68a-d04315cf467a',
      name: 'Light Grey Collection',
    },
    images: [
      {
        name: 1686654141625,
        color_specification: [
          {
            conversion: {
              origin: {
                red: 214,
                green: 199,
                blue: 177,
                hue: 36,
                sat: 0.31,
                lightness: 0.77,
                whiteness: 0.69,
                blackness: 0.16,
                cyan: 0,
                magenta: 0.07,
                yellow: 0.17,
                black: 0.16,
                ncol: 'R59',
                opacity: 1,
                valid: true,
                temperature: 'warm red orange',
              },
              hex: '#d6c7b1',
              rgb: {
                r: 214,
                g: 199,
                b: 177,
                a: 1,
              },
              hsl: {
                h: 36,
                s: 0.31,
                l: 0.77,
                a: 1,
              },
              cmyk: {
                c: 0,
                m: 0.07,
                y: 0.17,
                k: 0.16,
                a: 1,
              },
              hwb: {
                h: 36,
                w: 0.69,
                b: 0.16,
                a: 1,
              },
              lab: {
                l: 80.91488701892104,
                a: 1.6563010998700833,
                b: 12.902427064102362,
              },
              nCol: {
                ncol: 'R59',
                w: 0.69,
                b: 0.16,
                a: 1,
              },
              name: '',
            },
            colors_fetched_counts: 10055,
            density: 44.68888888888889,
          },
          {
            conversion: {
              origin: {
                red: 226,
                green: 219,
                blue: 206,
                hue: 39,
                sat: 0.26,
                lightness: 0.85,
                whiteness: 0.81,
                blackness: 0.11,
                cyan: 0,
                magenta: 0.03,
                yellow: 0.09,
                black: 0.11,
                ncol: 'R65',
                opacity: 1,
                valid: true,
                temperature: 'warm red orange',
              },
              hex: '#e2dbce',
              rgb: {
                r: 226,
                g: 219,
                b: 206,
                a: 1,
              },
              hsl: {
                h: 39,
                s: 0.26,
                l: 0.85,
                a: 1,
              },
              cmyk: {
                c: 0,
                m: 0.03,
                y: 0.09,
                k: 0.11,
                a: 1,
              },
              hwb: {
                h: 39,
                w: 0.81,
                b: 0.11,
                a: 1,
              },
              lab: {
                l: 87.62475169981806,
                a: 0.17353274962006449,
                b: 7.226947479459911,
              },
              nCol: {
                ncol: 'R65',
                w: 0.81,
                b: 0.11,
                a: 1,
              },
              name: '',
            },
            colors_fetched_counts: 6976,
            density: 31.004444444444445,
          },
          {
            conversion: {
              origin: {
                red: 236,
                green: 230,
                blue: 218,
                hue: 40,
                sat: 0.32,
                lightness: 0.89,
                whiteness: 0.85,
                blackness: 0.07,
                cyan: 0,
                magenta: 0.03,
                yellow: 0.08,
                black: 0.07,
                ncol: 'R67',
                opacity: 1,
                valid: true,
                temperature: 'N/A',
              },
              hex: '#ece6da',
              rgb: {
                r: 236,
                g: 230,
                b: 218,
                a: 1,
              },
              hsl: {
                h: 40,
                s: 0.32,
                l: 0.89,
                a: 1,
              },
              cmyk: {
                c: 0,
                m: 0.03,
                y: 0.08,
                k: 0.07,
                a: 1,
              },
              hwb: {
                h: 40,
                w: 0.85,
                b: 0.07,
                a: 1,
              },
              lab: {
                l: 91.45484478024309,
                a: -0.015558916973357206,
                b: 6.549644641232133,
              },
              nCol: {
                ncol: 'R67',
                w: 0.85,
                b: 0.07,
                a: 1,
              },
              name: '',
            },
            colors_fetched_counts: 5469,
            density: 24.306666666666665,
          },
        ],
      },
      {
        name: 1686654141436,
        color_specification: [
          {
            conversion: {
              origin: {
                red: 217,
                green: 215,
                blue: 219,
                hue: 270,
                sat: 0.05,
                lightness: 0.85,
                whiteness: 0.84,
                blackness: 0.14,
                cyan: 0.01,
                magenta: 0.02,
                yellow: 0,
                black: 0.14,
                ncol: 'B50',
                opacity: 1,
                valid: true,
                temperature: 'N/A',
              },
              hex: '#d9d7db',
              rgb: {
                r: 217,
                g: 215,
                b: 219,
                a: 1,
              },
              hsl: {
                h: 270,
                s: 0.05,
                l: 0.85,
                a: 1,
              },
              cmyk: {
                c: 0.01,
                m: 0.02,
                y: 0,
                k: 0.14,
                a: 1,
              },
              hwb: {
                h: 270,
                w: 0.84,
                b: 0.14,
                a: 1,
              },
              lab: {
                l: 86.23946257833961,
                a: 1.408568088776263,
                b: -1.733796446208502,
              },
              nCol: {
                ncol: 'B50',
                w: 0.84,
                b: 0.14,
                a: 1,
              },
              name: '',
            },
            colors_fetched_counts: 10573,
            density: 46.99111111111111,
          },
        ],
      },
    ],
  },
};
