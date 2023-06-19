/* eslint-disable  @typescript-eslint/no-for-in-array */

/* eslint-disable  prefer-spread */
import { HSBProps } from './types';

import { inherit } from './util';

type symetryKind =
  | 'complementary'
  | 'splitcomplementary'
  | 'analogous'
  | 'triadic'
  | 'tetradic'
  | 'monochromatic';

//The individual symmetry calculators
export const symmetry = (kind: symetryKind, i: HSBProps[]) => {
  const outs: { defaults: any[] } = { defaults: [] };
  // outs.defaults = []; //array of default returned colors
  // outs.alts = []; //array of any additional output possibilities (nested arrays)

  switch (kind) {
    case 'complementary': {
      for (const x in i) {
        const a = i[x];
        a.h = getComp(i[x].h);
        outs.defaults.push(a);
      }
      return outs;
    }

    case 'splitcomplementary': {
      const a = inherit(i[0]);
      a.h = getComp(a.h + 30);

      const b = inherit(i[0]);
      b.h = getComp(b.h - 30);

      outs.defaults = [a, b];
      return outs;
    }

    case 'analogous': {
      const hs = [],
        ss = [],
        bs = [];
      for (const g in i) {
        hs.push(i[g].h);
        ss.push(i[g].s);
        bs.push(i[g].b);
      }

      if (i.length == 1) {
        const a = inherit(i[0]);
        a.h = polarize(a.h + 30);

        const b = inherit(i[0]);
        b.h = polarize(b.h - 30);

        outs.defaults = [a, b];
        return outs;
      }

      // else if (i.length == 2) {
      //   //default: 1 result
      //   var a = {};
      //   a.h = getMid(hs);
      //   a.s = getMid(ss);
      //   a.b = getMid(bs);

      //   outs.defaults = [a];
      //   outs.alts[0] = [a];

      //   //alternate: 2 results
      //   var x,
      //     y,
      //     b = {},
      //     c = {};

      //   i = i[0].h > i[1].h ? [i[0], i[1]] : [i[1], i[0]];

      //   if (i[0].h - i[1].h > 180) {
      //     i[1].h = i[1].h + 360;
      //     x = i[1];
      //     y = i[0];
      //   } else {
      //     x = i[0];
      //     y = i[1];
      //   }

      //   b.h = polarize(y.h + (x.h - y.h) / 3);
      //   b.s = y.s + (x.s - y.s) / 3;
      //   b.b = y.b + (x.b - y.b) / 3;

      //   c.h = polarize(x.h - (x.h - y.h) / 3);
      //   c.s = x.s - (x.s - y.s) / 3;
      //   c.b = x.b - (x.b - y.b) / 3;

      //   outs.alts[1] = [b, c];

      //   // alternate: 3 results
      //   var d = {},
      //     e = {},
      //     f = {};
      //   d.h = getMid(hs);
      //   d.s = getMid(ss);
      //   d.b = getMid(bs);

      //   e.h = getMid([hs[0], d.h]);
      //   e.s = getMid([ss[0], d.s]);
      //   e.b = getMid([bs[0], d.b]);

      //   f.h = getMid([hs[1], d.h]);
      //   f.s = getMid([ss[1], d.s]);
      //   f.b = getMid([bs[1], d.b]);

      //   outs.alts[2] = [d, e, f];
      //   return outs;
      // } else if (i.length == 3) {
      //   // default: 2 results
      //   var comps = [],
      //     diffs = [];
      //   for (x = 0; x < i.length; x++) {
      //     for (y = x + 1; y < i.length; y++) {
      //       comps.push([i[x], i[y]]);
      //     }
      //   }
      //   for (c in comps) {
      //     diffs.push(getDiff([comps[c][0].h, comps[c][1].h]));
      //   }

      //   var its = diffs.indexOf(Math.max.apply(Math, diffs));

      //   comps.splice(its, 1);

      //   function getComps(q) {
      //     a = {};
      //     a.h = getMid([comps[q][0].h, comps[q][1].h]);
      //     a.s = getMid([comps[q][0].s, comps[q][1].s]);
      //     a.b = getMid([comps[q][0].b, comps[q][1].b]);
      //     return a;
      //   }

      //   outs.defaults = [getComps(0), getComps(1)];
      //   return outs;
      // }
      break;
    }

    case 'triadic': {
      if (i.length == 1) {
        const a = inherit(i[0]);
        a.h = getComp(a.h + 60);

        const b = inherit(i[0]);
        b.h = getComp(b.h - 60);

        outs.defaults = [a, b];
        return outs;
      }
      //  else if (i.length == 2) {
      //   var a = {};
      //   a.h = getComp(getMid([i[0].h, i[1].h]));
      //   a.s = getMid([i[0].s, i[1].s]);
      //   a.b = getMid([i[0].b, i[1].b]);

      //   outs.defaults = [a];
      //   return outs;
      // } else if (i.length == 3) {
      //   var a = {};
      //   a.h = getComp(getMid([i[0].h, i[1].h]));
      //   a.s = getMid([i[0].s, i[1].s]);
      //   a.b = getMid([i[0].b, i[1].b]);

      //   var b = {};
      //   b.h = getComp(getMid([i[1].h, i[2].h]));
      //   b.s = getMid([i[1].s, i[2].s]);
      //   b.b = getMid([i[1].b, i[2].b]);

      //   var c = {};
      //   c.h = getComp(getMid([i[0].h, i[2].h]));
      //   c.s = getMid([i[0].s, i[2].s]);
      //   c.b = getMid([i[0].b, i[2].b]);

      //   outs.defaults = [a, b, c];
      //   return outs;
      // }

      break;
    }

    case 'tetradic': {
      if (i.length == 1) {
        const a = inherit(i[0]);
        a.h = getComp(a.h);

        const b = inherit(i[0]);
        b.h = polarize(a.h + 60);

        const c = inherit(i[0]);
        c.h = getComp(b.h);

        outs.defaults = [a, b, c];
        return outs;
      }
      //  else if (i.length == 2) {
      //   var a = inherit(i[0]);
      //   a.h = getComp(i[0].h);
      //   a.s = i[1].s;
      //   a.b = i[0].b;

      //   var b = inherit(a);
      //   b.h = getComp(i[1].h);
      //   b.s = i[0].s;

      //   outs.defaults = [a, b];
      //   return outs;
      // }

      break;
    }

    case 'monochromatic': {
      //default: return 1 color
      const a: any = {};
      a.h = i[0].h;
      a.s = i[0].s > 50 ? i[0].s - 20 : i[0].s + 20;
      a.b = i[0].b > 50 ? i[0].b - 10 : i[0].b + 10;

      outs.defaults = [a];
      // outs.alts[0] = [a];

      //alternate: return 2 colors
      // const b = {};
      // b.h = i[0].h;
      // b.s = i[0].s > 50 ? i[0].s - 20 : i[0].s + 20;
      // b.b = i[0].b > 50 ? i[0].b - 10 : i[0].b + 10;

      // const c = {};
      // c.h = i[0].h;
      // c.s = i[0].s > 50 ? i[0].s - 40 : i[0].s + 40;
      // c.b = i[0].b > 50 ? i[0].b - 20 : i[0].b + 20;

      // outs.alts[1] = [b, c];

      //alternate: return 3 colors
      // const d = {};
      // d.h = i[0].h;
      // const sdis = i[0].s > 50 ? -15 : 15;
      // const bdis = i[0].b > 50 ? -5 : 5;
      // d.s = i[0].s + sdis;
      // d.b = i[0].b + bdis;

      // const e = {};
      // e.h = d.h;
      // e.s = d.s + sdis;
      // e.b = d.b + bdis;

      // const f = {};
      // f.h = e.h;
      // f.s = e.s + sdis;
      // f.b = e.b + bdis;

      // outs.alts[2] = [d, e, f];
      return outs;
    }

    default:
      return outs;
  }

  return outs;
};

//Utility functions
function polarize(h: number) {
  let newH = h;
  if (h > 360) newH = h - 360;
  if (h < 0) newH = h + 360;
  return newH;
}

//these two should really be one function, but alas, my waning logic skills
// function getDiff(hs: any) {
//   let x, y;
//   if (hs[0] > hs[1]) {
//     x = hs[0];
//     y = hs[1];
//   } else {
//     y = hs[0];
//     x = hs[1];
//   }
//   const diff = x - y;
//   if (diff > 180) {
//     y = y + 360;
//   }

//   return Math.abs(x - y);
// }

// function getMid(hs: any) {
//   let x, y;
//   if (hs[0] > hs[1]) {
//     x = hs[0];
//     y = hs[1];
//   } else {
//     y = hs[0];
//     x = hs[1];
//   }
//   const diff = x - y;
//   if (diff > 180) {
//     y = y + 360;
//   }

//   return polarize(x - (x - y) / 2);
// }

function getComp(h: number) {
  return polarize(h + 180);
}
