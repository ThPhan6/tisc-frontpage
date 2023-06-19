import { CSSProperties, FC, useEffect } from 'react';

import { RobotoBodyText } from '@/components/Typography';

import './palette.less';
import { REGEX_COLOR_HEX, addTableElement, getTint, hexToRgb, rgbToHex } from './util';

const TABLE_ID = 'tint-color-content';

interface TintPaletteProps {
  color: string;
  className?: string;
  style?: CSSProperties;
}

export const TintPalette: FC<TintPaletteProps> = ({ className, style, color }) => {
  const rgbArray: any[] = [];

  const createTable = () => {
    // setPercentage();

    for (let i = 0; i <= rgbArray.length - 1; i += 1) {
      addTableElement(TABLE_ID, `tints-${i + 1}`);
      addTableElement(TABLE_ID, `tints-values-${i + 1}`);
    }

    /// set color
    for (let j = 0; j <= rgbArray.length - 1; j += 1) {
      for (let i = rgbArray[j].length - 1; i >= 0; i -= 2) {
        /// with clipboard
        // const colorBlockTints = `<td class='colorBlock' style='background-color:${rgbArray[j][i].tint.hex}; height: 48px;' data-clipboard-text='${rgbArray[j][i].tint.hex}'></td>`;

        const colorBlockTints = `<td style='background-color:${rgbArray[j][i].tint.hex}; height: 48px;'></td>`;
        document.querySelector(`#tints-${j + 1}`)?.insertAdjacentHTML('beforeend', colorBlockTints);

        const colorHexTints = `<td style='text-align: center; height: 32px; box-shadow: inset 0 -.7px 0 rgba(0, 0, 0, 0.3); text-transform: uppercase'>${rgbArray[j][i].tint.hex}</td>`;
        document
          .querySelector(`#tints-values-${j + 1}`)
          ?.insertAdjacentHTML('beforeend', colorHexTints);
      }
    }
  };

  const getRGB = (colorHex: string) => {
    //Get RGB value from Hex
    const newColor = hexToRgb(colorHex);
    const rgbInternalArray = [];

    let j = 0;

    //Loop through rgb values multiplying them to get tints
    for (let i = 0; i <= 1; i += 0.1) {
      j = Math.round(j * 10) / 10;
      const rValue = getTint(newColor?.r as any, j);
      const gValue = getTint(newColor?.g as any, j);
      const bValue = getTint(newColor?.b as any, j);
      const rgb = {
        tint: {
          r: rValue,
          g: gValue,
          b: bValue,
        },
      };

      (rgb.tint as any).hex = rgbToHex(rgb.tint.r, rgb.tint.g, rgb.tint.b);

      rgbInternalArray.push(rgb);
      j += 0.1;
    }
    ///
    rgbArray.push(rgbInternalArray);

    ///
    createTable();
  };

  useEffect(() => {
    if (!color || REGEX_COLOR_HEX.test(color) === false) {
      return;
    }

    getRGB(color);
  }, [color]);

  if (!color || REGEX_COLOR_HEX.test(color) === false) {
    return null;
  }

  return (
    <div className={`wrapper ${className}`} style={style}>
      <RobotoBodyText level={5} style={{ height: 32 }}>
        Tint Palette
      </RobotoBodyText>

      <div className="container">
        <div id="color-wrapper">
          <table style={{ width: '100%' }} id={TABLE_ID}></table>
        </div>
      </div>
    </div>
  );
};
