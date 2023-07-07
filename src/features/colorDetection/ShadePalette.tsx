import { CSSProperties, FC, useEffect } from 'react';

import { RobotoBodyText } from '@/components/Typography';

import './palette.less';
import { REGEX_COLOR_HEX, addTableElement, getShade, hexToRgb, rgbToHex } from './util';

const TABLE_ID = 'shade-color-content';

interface ShadePaletteProps {
  color: string;
  className?: string;
  style?: CSSProperties;
}

export const ShadePalette: FC<ShadePaletteProps> = ({ className, style, color }) => {
  // new ClipboardJS('.colorBlock');
  const rgbArray: any[] = [];

  const createTable = () => {
    // setPercentage();

    for (let i = 0; i <= rgbArray.length - 1; i += 1) {
      addTableElement(TABLE_ID, `shades-${i + 1}`);
      addTableElement(TABLE_ID, `shades-values-${i + 1}`);
    }

    for (let j = 0; j <= rgbArray.length - 1; j += 1) {
      for (let i = rgbArray[j].length - 1; i >= 0; i -= 2) {
        /// with clipboard
        // const colorBlockShades = `<td  className='colorBlock' style = 'height: 48px; background-color:${
        //   rgbArray[j][rgbArray[j].length - 1 - i].shade.hex
        // };'  data-clipboard-text='${rgbArray[j][i].shade.hex}' > </td > `;

        const colorBlockShades = `<td style = 'height: 48px; background-color:${
          rgbArray[j][rgbArray[j].length - 1 - i].shade.hex
        };'> </td > `;
        document
          .querySelector(`#shades-${j + 1}`)
          ?.insertAdjacentHTML('beforeend', colorBlockShades);

        const colorHexShades = `<td style='text-align: center; height: 32px; box-shadow: inset 0 -.7px 0 rgba(0, 0, 0, 0.3); text-transform: uppercase '>${
          rgbArray[j][rgbArray[j].length - 1 - i].shade.hex
        }</td>  `;
        document
          .querySelector(`#shades-values-${j + 1}`)
          ?.insertAdjacentHTML('beforeend', colorHexShades);
      }
    }
  };

  const getRGB = (colorHex: string) => {
    //Get RGB value from Hex
    const newColor = hexToRgb(colorHex);
    const rgbInternalArray = [];

    let j = 0;

    //Loop through rgb values multiplying them to get shades
    for (let i = 0; i <= 1; i += 0.1) {
      j = Math.round(j * 10) / 10;
      const rValue = getShade(newColor?.r as any, j);
      const gValue = getShade(newColor?.g as any, j);
      const bValue = getShade(newColor?.b as any, j);
      const rgb = {
        shade: {
          r: rValue,
          g: gValue,
          b: bValue,
        },
      };

      (rgb.shade as any).hex = rgbToHex(rgb.shade.r, rgb.shade.g, rgb.shade.b);

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
        Shade Palette
      </RobotoBodyText>

      <div className="container">
        <div id="color-wrapper">
          <table style={{ width: '100%' }} id={TABLE_ID}></table>
        </div>
      </div>
    </div>
  );
};
