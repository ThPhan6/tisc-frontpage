import { CSSProperties, FC, useEffect, useState } from 'react';

import { HSBProps } from './types';
import { BodyTextProps } from '@/components/Typography/types/index';

import { RobotoBodyText } from '@/components/Typography';

import { symmetry } from './symmetry';
import { REGEX_COLOR_HEX, hex2hsb, hsb2hex, rgbToHex } from './util';
import compColors from 'complementary-colors';

const styleProps: BodyTextProps = {
  level: 5,
  customClass: 'flex-center',
  style: {
    textTransform: 'uppercase',
    height: 32,
  },
};

const titleProps: BodyTextProps = {
  level: 5,
  style: {
    height: 32,
  },
};

interface ColourPaletteProps {
  color: string;
  className?: string;
  style?: CSSProperties;
}

export const ComplementaryPalette: FC<ColourPaletteProps> = ({ className, style, color }) => {
  const [palette, setPalette] = useState<HSBProps[]>([]);

  useEffect(() => {
    if (!color || REGEX_COLOR_HEX.test(color) === false) {
      return;
    }

    const hsb = hex2hsb(color) as HSBProps;

    const complementary = symmetry('complementary', [Object.assign({}, hsb)]);

    setPalette([hsb, ...complementary.defaults]);

    return () => {
      setPalette([]);
    };
  }, [color]);

  if (!color || REGEX_COLOR_HEX.test(color) === false) {
    return null;
  }

  return (
    <div className={className} style={style}>
      <RobotoBodyText {...titleProps}>Complementary Palette</RobotoBodyText>

      <div className="flex-start border-bottom-light">
        {palette.map((el, index) => (
          <div className="d-flex flex-column w-full" key={index}>
            <div
              style={{
                background: hsb2hex(el),
                height: 48,
              }}
            />
            <RobotoBodyText {...styleProps}>{hsb2hex(el)}</RobotoBodyText>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SplitComplementaryPalette: FC<ColourPaletteProps> = ({ className, style, color }) => {
  const [palette, setPalette] = useState<any[]>([]);

  useEffect(() => {
    if (!color || REGEX_COLOR_HEX.test(color) === false) {
      return;
    }

    const hsb = hex2hsb(color) as HSBProps;

    const splitComplementary = symmetry('splitcomplementary', [Object.assign({}, hsb)]);

    setPalette([hsb, ...splitComplementary.defaults]);

    return () => {
      setPalette([]);
    };
  }, [color]);

  if (!color || REGEX_COLOR_HEX.test(color) === false) {
    return null;
  }

  return (
    <div className={className} style={style}>
      <RobotoBodyText {...titleProps}>Split Complementary Palette</RobotoBodyText>

      <div className="flex-start border-bottom-light">
        {palette.map((el, index) => (
          <div className="d-flex flex-column w-full" key={index}>
            <div
              style={{
                background: hsb2hex(el),
                height: 48,
              }}
            />
            <RobotoBodyText {...styleProps}>{hsb2hex(el)}</RobotoBodyText>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnalogousPalette: FC<ColourPaletteProps> = ({ className, style, color }) => {
  const [palette, setPalette] = useState<any[]>([]);

  useEffect(() => {
    if (!color || REGEX_COLOR_HEX.test(color) === false) {
      return;
    }

    const hsb = hex2hsb(color) as HSBProps;

    const analogous = symmetry('analogous', [Object.assign({}, hsb)]);

    setPalette([hsb, ...analogous.defaults]);

    return () => {
      setPalette([]);
    };
  }, [color]);

  if (!color || REGEX_COLOR_HEX.test(color) === false) {
    return null;
  }

  return (
    <div className={className} style={style}>
      <RobotoBodyText {...titleProps}>Analogous Palette</RobotoBodyText>

      <div className="flex-start border-bottom-light">
        {palette.map((el, index) => (
          <div className="d-flex flex-column w-full" key={index}>
            <div
              style={{
                background: hsb2hex(el),
                height: 48,
              }}
            />
            <RobotoBodyText {...styleProps}>{hsb2hex(el)}</RobotoBodyText>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TetradicPalette: FC<ColourPaletteProps> = ({ className, style, color }) => {
  const [palette, setPalette] = useState<any[]>([]);

  useEffect(() => {
    if (!color || REGEX_COLOR_HEX.test(color) === false) {
      return;
    }

    const hsb = hex2hsb(color) as HSBProps;

    const tetradic = symmetry('tetradic', [Object.assign({}, hsb)]);

    setPalette([hsb, ...tetradic.defaults]);

    return () => {
      setPalette([]);
    };
  }, [color]);

  if (!color || REGEX_COLOR_HEX.test(color) === false) {
    return null;
  }

  return (
    <div className={className} style={style}>
      <RobotoBodyText {...titleProps}>Tetradic Palette</RobotoBodyText>

      <div className="flex-start border-bottom-light">
        {palette.map((el, index) => (
          <div className="d-flex flex-column w-full" key={index}>
            <div
              style={{
                background: hsb2hex(el),
                height: 48,
              }}
            />
            <RobotoBodyText {...styleProps}>{hsb2hex(el)}</RobotoBodyText>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TriadicPalette: FC<ColourPaletteProps> = ({ className, style, color }) => {
  const [palette, setPalette] = useState<any[]>([]);

  useEffect(() => {
    if (!color || REGEX_COLOR_HEX.test(color) === false) {
      return;
    }

    const hsb = hex2hsb(color) as HSBProps;

    const triadic = symmetry('triadic', [Object.assign({}, hsb)]);

    setPalette([hsb, ...triadic.defaults]);

    return () => {
      setPalette([]);
    };
  }, [color]);

  if (!color || REGEX_COLOR_HEX.test(color) === false) {
    return null;
  }

  return (
    <div className={className} style={style}>
      <RobotoBodyText {...titleProps}>Triadic Palette</RobotoBodyText>

      <div className="flex-start border-bottom-light">
        {palette.map((el, index) => (
          <div className="d-flex flex-column w-full" key={index}>
            <div
              style={{
                background: hsb2hex(el),
                height: 48,
              }}
            />
            <RobotoBodyText {...styleProps}>{hsb2hex(el)}</RobotoBodyText>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SquarePalette: FC<ColourPaletteProps> = ({ className, style, color }) => {
  const [palette, setPalette] = useState<any[]>([]);

  useEffect(() => {
    if (!color || REGEX_COLOR_HEX.test(color) === false) {
      return;
    }

    const myColor = new compColors(color);
    const square: any[] = myColor.square();

    setPalette(square);

    return () => {
      setPalette([]);
    };
  }, [color]);

  if (!color || REGEX_COLOR_HEX.test(color) === false) {
    return null;
  }

  return (
    <div className={className} style={style}>
      <RobotoBodyText {...titleProps}>Square Palette</RobotoBodyText>

      <div className="flex-start border-bottom-light">
        {palette.map((el, index) => (
          <div className="d-flex flex-column w-full" key={index}>
            <div
              style={{
                background: rgbToHex(el['r'], el['g'], el['b']),
                height: 48,
              }}
            />
            <RobotoBodyText {...styleProps}>{rgbToHex(el['r'], el['g'], el['b'])}</RobotoBodyText>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MonoChromaticPalette: FC<ColourPaletteProps> = ({ className, style, color }) => {
  const [palette, setPalette] = useState<any[]>([]);

  useEffect(() => {
    if (!color || REGEX_COLOR_HEX.test(color) === false) {
      return;
    }

    const hsb = hex2hsb(color) as HSBProps;

    const monochromatic = symmetry('monochromatic', [Object.assign({}, hsb)]);

    setPalette([hsb, ...monochromatic.defaults]);

    return () => {
      setPalette([]);
    };
  }, [color]);

  if (!color || REGEX_COLOR_HEX.test(color) === false) {
    return null;
  }

  return (
    <div className={className} style={style}>
      <RobotoBodyText {...titleProps}>Monochromatic Palette</RobotoBodyText>

      <div className="flex-start border-bottom-light">
        {palette.map((el, index) => (
          <div className="d-flex flex-column w-full" key={index}>
            <div
              style={{
                background: hsb2hex(el),
                height: 48,
              }}
            />
            <RobotoBodyText {...styleProps}>{hsb2hex(el)}</RobotoBodyText>
          </div>
        ))}
      </div>
    </div>
  );
};
