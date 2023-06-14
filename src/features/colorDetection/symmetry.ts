/* eslint-disable  @typescript-eslint/no-for-in-array */

/* eslint-disable  prefer-spread */
import { HSBProps } from './types';

import { inherit } from './util';

type symetryKind =
  | 'complementary'
  | 'splitcomplementary'
  | 'analagous'
  | 'triadic'
  | 'tetradic'
  | 'monochromatic';

//The individual symmetry calculators
export const symmetry = (kind: symetryKind, i: HSBProps[]) => {
  const outs: { defaults: HSBProps[]; alts: HSBProps[] } = { defaults: [], alts: [] };
  // outs.defaults = []; //array of default returned colors
  // outs.alts = []; //array of any additional output possibilities (nested arrays)

  switch (kind) {
    case 'complementary':
      for (const x in i) {
        const a = i[x];
        a.h = getComp(i[x].h);
        outs.defaults.push(a);
      }
      return outs;

    case 'splitcomplementary':
      const a = inherit(i[0]);
      a.h = getComp(a.h + 30);

      const b = inherit(i[0]);
      b.h = getComp(b.h - 30);

      outs.defaults = [a, b];
      return outs;

    case 'analagous':
      const hs = [],
        ss = [],
        bs = [];

      for (const g in i) {
        hs.push(i[g].h);
        ss.push(i[g].s);
        bs.push(i[g].b);
      }

      if (i.length == 1) {
        const ana = inherit(i[0]);

        ana.h = polarize(ana.h + 30);

        const anb = inherit(i[0]);
        anb.h = polarize(ana.h - 30);

        outs.defaults = [ana, anb];
        return outs;
      } else if (i.length == 2) {
        //default: 1 result
        const anaa: any = {};
        anaa.h = getMid(hs);
        anaa.s = getMid(ss);
        anaa.b = getMid(bs);

        outs.defaults = [a];
        outs.alts[0] = [a] as any;

        //alternate: 2 results
        let anax, anay;
        const anab: any = {},
          anac: any = {};

        const newI = i[0].h > i[1].h ? [i[0], i[1]] : [i[1], i[0]];

        if (newI[0].h - newI[1].h > 180) {
          newI[1].h = newI[1].h + 360;
          anax = newI[1];
          anay = newI[0];
        } else {
          anax = newI[0];
          anay = newI[1];
        }

        anab.h = polarize(anay.h + (anax.h - anay.h) / 3);
        anab.s = anay.s + (anax.s - anay.s) / 3;
        anab.b = anay.b + (anax.b - anay.b) / 3;

        anac.h = polarize(anax.h - (anax.h - anay.h) / 3);
        anac.s = anax.s - (anax.s - anay.s) / 3;
        anac.b = anax.b - (anax.b - anay.b) / 3;

        outs.alts[1] = [anab, anac] as any;

        // alternate: 3 results
        const and: any = {},
          ane: any = {},
          anf: any = {};
        and.h = getMid(hs);
        and.s = getMid(ss);
        and.b = getMid(bs);

        ane.h = getMid([hs[0], and.h]);
        ane.s = getMid([ss[0], and.s]);
        ane.b = getMid([bs[0], and.b]);

        anf.h = getMid([hs[1], and.h]);
        anf.s = getMid([ss[1], and.s]);
        anf.b = getMid([bs[1], and.b]);

        outs.alts[2] = [and, ane, anf] as any;
        return outs;
      } else if (i.length == 3) {
        // default: 2 results
        const comps: any[] = [],
          diffs = [];

        for (let x = 0; x < i.length; x++) {
          for (let y = x + 1; y < i.length; y++) {
            comps.push([i[x], i[y]]);
          }
        }
        for (const c in comps) {
          diffs.push(getDiff([comps[c][0].h, comps[c][1].h]));
        }

        const its = diffs.indexOf(Math.max.apply(Math, diffs));

        comps.splice(its, 1);

        function getComps(q: any) {
          const newa: any = {};
          newa.h = getMid([comps[q][0].h, comps[q][1].h]);
          newa.s = getMid([comps[q][0].s, comps[q][1].s]);
          newa.b = getMid([comps[q][0].b, comps[q][1].b]);
          return newa;
        }

        outs.defaults = [getComps(0), getComps(1)];
        return outs;
      }
      break;

    case 'triadic': {
      if (i.length == 1) {
        const tria: any = inherit(i[0]);
        tria.h = getComp(tria.h + 60);

        const trib: any = inherit(i[0]);
        trib.h = getComp(trib.h - 60);

        outs.defaults = [tria, trib];
        return outs;
      } else if (i.length == 2) {
        const triaa: any = {};
        triaa.h = getComp(getMid([i[0].h, i[1].h]));
        triaa.s = getMid([i[0].s, i[1].s]);
        triaa.b = getMid([i[0].b, i[1].b]);

        outs.defaults = [a];
        return outs;
      } else if (i.length == 3) {
        const triaaa: any = {};
        triaaa.h = getComp(getMid([i[0].h, i[1].h]));
        triaaa.s = getMid([i[0].s, i[1].s]);
        triaaa.b = getMid([i[0].b, i[1].b]);

        const triab: any = {};
        triab.h = getComp(getMid([i[1].h, i[2].h]));
        triab.s = getMid([i[1].s, i[2].s]);
        triab.b = getMid([i[1].b, i[2].b]);

        const triac: any = {};
        triac.h = getComp(getMid([i[0].h, i[2].h]));
        triac.s = getMid([i[0].s, i[2].s]);
        triac.b = getMid([i[0].b, i[2].b]);

        outs.defaults = [triaaa, triab, triac];
        return outs;
      }

      break;
    }

    case 'tetradic': {
      if (i.length == 1) {
        const tea = inherit(i[0]);
        tea.h = getComp(tea.h);

        const teb = inherit(i[0]);
        teb.h = polarize(tea.h + 60);

        const tec = inherit(i[0]);
        tec.h = getComp(teb.h);

        outs.defaults = [tea, teb, tec];
        return outs;
      } else if (i.length == 2) {
        const teaa = inherit(i[0]);
        teaa.h = getComp(i[0].h);
        teaa.s = i[1].s;
        teaa.b = i[0].b;

        const teab = inherit(teaa);
        teab.h = getComp(i[1].h);
        teab.s = i[0].s;

        outs.defaults = [teaa, teab];
        return outs;
      }

      break;
    }
    case 'monochromatic':
      //default: return 1 color
      const monoa: any = {};
      monoa.h = i[0].h;
      monoa.s = i[0].s > 50 ? i[0].s - 20 : i[0].s + 20;
      monoa.b = i[0].b > 50 ? i[0].b - 10 : i[0].b + 10;

      outs.defaults = [monoa];
      outs.alts[0] = [monoa] as any;

      //alternate: return 2 colors
      const monob: any = {};
      monob.h = i[0].h;
      monob.s = i[0].s > 50 ? i[0].s - 20 : i[0].s + 20;
      monob.b = i[0].b > 50 ? i[0].b - 10 : i[0].b + 10;

      const monoc: any = {};
      monoc.h = i[0].h;
      monoc.s = i[0].s > 50 ? i[0].s - 40 : i[0].s + 40;
      monoc.b = i[0].b > 50 ? i[0].b - 20 : i[0].b + 20;

      outs.alts[1] = [monob, monoc] as any;

      //alternate: return 3 colors
      const monod: any = {};
      monod.h = i[0].h;
      const sdis = i[0].s > 50 ? -15 : 15;
      const bdis = i[0].b > 50 ? -5 : 5;
      monod.s = i[0].s + sdis;
      monod.b = i[0].b + bdis;

      const monoe: any = {};
      monoe.h = monod.h;
      monoe.s = monod.s + sdis;
      monoe.b = monod.b + bdis;

      const monof: any = {};
      monof.h = monoe.h;
      monof.s = monoe.s + sdis;
      monof.b = monoe.b + bdis;

      outs.alts[2] = [monod, monoe, monof] as any;
      return outs;

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
function getDiff(hs: any) {
  let x, y;
  if (hs[0] > hs[1]) {
    x = hs[0];
    y = hs[1];
  } else {
    y = hs[0];
    x = hs[1];
  }
  const diff = x - y;
  if (diff > 180) {
    y = y + 360;
  }

  return Math.abs(x - y);
}

function getMid(hs: any) {
  let x, y;
  if (hs[0] > hs[1]) {
    x = hs[0];
    y = hs[1];
  } else {
    y = hs[0];
    x = hs[1];
  }
  const diff = x - y;
  if (diff > 180) {
    y = y + 360;
  }

  return polarize(x - (x - y) / 2);
}

function getComp(h: number) {
  return polarize(h + 180);
}
