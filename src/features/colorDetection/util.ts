import { forEach } from 'lodash';

import { HSBProps, RBGProps } from './types';

export const REGEX_COLOR_HEX = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;

export const getTint = (color: number, factor: number) => {
  return Math.round(color + (255 - color) * 1 * factor);
};

export const getShade = (color: number, factor: number) => {
  return Math.round(color * factor);
};

export const componentToHex = (c: string | number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const inherit = (proto: any) => {
  if (Object.create) return Object.create(proto);
  const t = typeof proto;
  if (t !== 'object' && t !== 'function') throw TypeError();
  function f() {}
  f.prototype = proto;
  return new f();
};

// Converts a hex string to an RGB object
export const hex2rgb = (hex: string) => {
  const newHex = parseInt(hex.indexOf('#') > -1 ? hex.substring(1) : hex, 16);

  return {
    r: newHex >> 16,
    g: (newHex & 0x00ff00) >> 8,
    b: newHex & 0x0000ff,
  } as RBGProps;
};

// Converts a HEX string to an HSB object
export const hex2hsb = (hex: string) => {
  if (!hex || REGEX_COLOR_HEX.test(hex) === false) {
    return;
  }

  const rgb = hex2rgb(hex);
  const hsb = rgb2hsb(Object.assign({}, rgb));

  if (hsb.s === 0) hsb.h = 360;
  return hsb;
};

// Converts an RGB object to a hex string
export const rgb2hex = (rgb: RBGProps) => {
  const hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];

  forEach(hex, (val, nr) => {
    if (val?.length === 1) hex[nr] = '0' + val;
  });

  return '#' + hex.join('');
};

// Converts an HSB object to a hex string
export const hsb2hex = (hsb: HSBProps) => {
  return rgb2hex(hsb2rgb(hsb) as any);
};

// Converts an HSB object to an RGB object
function hsb2rgb(hsb: HSBProps) {
  const newhsb = inherit(hsb);

  const rgb: any = {};
  let h = Math.round(newhsb.h);
  const s = Math.round((hsb.s * 255) / 100);
  const v = Math.round((hsb.b * 255) / 100);
  if (s === 0) {
    rgb.r = rgb.g = rgb.b = v;
  } else {
    const t1 = v;
    const t2 = ((255 - s) * v) / 255;
    const t3 = ((t1 - t2) * (h % 60)) / 60;
    if (h === 360) h = 0;
    if (h < 60) {
      rgb.r = t1;
      rgb.b = t2;
      rgb.g = t2 + t3;
    } else if (h < 120) {
      rgb.g = t1;
      rgb.b = t2;
      rgb.r = t1 - t3;
    } else if (h < 180) {
      rgb.g = t1;
      rgb.r = t2;
      rgb.b = t2 + t3;
    } else if (h < 240) {
      rgb.b = t1;
      rgb.r = t2;
      rgb.g = t1 - t3;
    } else if (h < 300) {
      rgb.b = t1;
      rgb.g = t2;
      rgb.r = t2 + t3;
    } else if (h < 360) {
      rgb.r = t1;
      rgb.g = t2;
      rgb.b = t1 - t3;
    } else {
      rgb.r = 0;
      rgb.g = 0;
      rgb.b = 0;
    }
  }
  return {
    r: Math.round(rgb.r),
    g: Math.round(rgb.g),
    b: Math.round(rgb.b),
  };
}

// Converts an RGB object to an HSB object
function rgb2hsb(rgb: RBGProps): HSBProps {
  const hsb = { h: 0, s: 0, b: 0 };
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const delta = max - min;
  hsb.b = max;
  hsb.s = max !== 0 ? (255 * delta) / max : 0;
  if (hsb.s !== 0) {
    if (rgb.r === max) {
      hsb.h = (rgb.g - rgb.b) / delta;
    } else if (rgb.g === max) {
      hsb.h = 2 + (rgb.b - rgb.r) / delta;
    } else {
      hsb.h = 4 + (rgb.r - rgb.g) / delta;
    }
  } else {
    hsb.h = -1;
  }
  hsb.h *= 60;
  if (hsb.h < 0) {
    hsb.h += 360;
  }
  hsb.s *= 100 / 255;
  hsb.b *= 100 / 255;

  return hsb;
}

export const hexToRgbString = (hex: string) => {
  let r: any = 0;
  let g: any = 0;
  let b: any = 0;

  // 3 digits
  if (hex.length == 4) {
    r = '0x' + hex[1] + hex[1];
    g = '0x' + hex[2] + hex[2];
    b = '0x' + hex[3] + hex[3];

    // 6 digits
  } else if (hex.length == 7) {
    r = '0x' + hex[1] + hex[2];
    g = '0x' + hex[3] + hex[4];
    b = '0x' + hex[5] + hex[6];
  }

  return 'rgb(' + +r + ',' + +g + ',' + +b + ')';
};

export const hexToHSL = (hex: any) => {
  // Convert hex to RGB first
  let r: any = 0;
  let g: any = 0;
  let b: any = 0;

  if (hex.length == 4) {
    r = '0x' + hex[1] + hex[1];
    g = '0x' + hex[2] + hex[2];
    b = '0x' + hex[3] + hex[3];
  } else if (hex.length == 7) {
    r = '0x' + hex[1] + hex[2];
    g = '0x' + hex[3] + hex[4];
    b = '0x' + hex[5] + hex[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s + '%', l + '%'];
};

export const getBrightness = (r: number, g: number, b: number) => {
  const rValue = Number(r) * 0.2126;
  const gValue = Number(g) * 0.7152;
  const bValue = Number(b) * 0.0722;

  return rValue + gValue + bValue;
};

export const setColorPercentageToTable = (tableId: string, trId: string) => {
  if (document.getElementById(tableId)) {
    (document.getElementById(tableId) as HTMLTableElement).innerHTML = `<tr id=${trId}><tr>`;
  }

  /// add 20 percent
  for (let i = 0; i <= 110 - 1; i += 20) {
    const colorPercentage = `<td class="color-perc"><span>${i}%</span></td>`;
    document.querySelector(`#${trId}`)?.insertAdjacentHTML('beforeend', colorPercentage);
  }
};

export const addTableElement = (tableId: string, elementId: string) => {
  if (document.getElementById(tableId)) {
    /// remove all td
    if (document.getElementById(elementId)) {
      document.querySelectorAll(`#${tableId} > tbody > tr > td`).forEach((el) => {
        el.remove();
      });
    }
    /// insert row
    else {
      (document.getElementById(tableId) as HTMLTableElement).insertRow(-1).id = elementId;
    }
  }
};
