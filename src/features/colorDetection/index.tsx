import { useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import { detectImageColor } from './services';
import { useScreen } from '@/helper/common';
import { formatNumber, formatPercentNumber } from '@/helper/utils';
import { isNaN, isUndefined } from 'lodash';

import { setPartialProductDetail } from '../product/reducers';
import {
  ColorConversionProps,
  ColorCoversionAnalysisProps,
  ColorOriginRrops,
  ColourAIResponse,
} from './types';
import store, { useAppSelector } from '@/reducers';
import { closeModal } from '@/reducers/modal';

import Popover from '../../components/Modal/Popover';
import TableContent from '../../components/Table/TableContent';
import { BodyText, RobotoBodyText, Title } from '../../components/Typography';
import { SwitchDynamic } from '@/components/Switch';

import {
  AnalogousPalette,
  ComplementaryPalette,
  MonoChromaticPalette,
  SplitComplementaryPalette,
  SquarePalette,
  TetradicPalette,
  TriadicPalette,
} from './Palettes';
import { ShadePalette } from './ShadePalette';
import { TintPalette } from './TintPalette';
import styles from './index.less';

const tableTdLeftWidth = '26%';
const tableTdRightWidth = '74%';

export const ColorDetection = () => {
  const visible = useAppSelector((state) => state.modal.type);

  const { isTablet } = useScreen();

  /// data
  const [colorDetection, setColorDetection] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<ColorCoversionAnalysisProps[]>([]);
  const [basicData, setBasicData] = useState<ColorConversionProps['conversion']['origin'][]>([]);
  const [collectionRecommendation, setCollectionRecommnedation] = useState<
    ColourAIResponse['data']['recommendation_collection']
  >({ id: '', name: '' });
  ///

  const [colorSwitch, setColorSwitch] = useState<boolean>();
  const [chosenColor, setChosenColor] = useState<{ index?: number; name: string }>({
    name: '',
  });

  /// required to detect image color
  const productImages = useAppSelector((state) => state.product.details.images);
  const categories = useAppSelector((state) => state.product.details.categories);

  const getImageColorDetection = async () => {
    const cateIds = categories.map((el) => el.id);
    const stringImages = productImages.map((image) => {
      if (image.indexOf('data:image') > -1) {
        return image.split(',')[1];
      }

      return image;
    });

    const colorDetectData: ColourAIResponse = await detectImageColor(cateIds, stringImages);

    const newColorPanel: any[] = [];

    colorDetectData.data?.images?.forEach((item, index) => {
      /// handle to show product image color
      if (index == 0) {
        newColorPanel.push({
          'Main Image': {
            ...item.color_specification,
          },
        });
      } else {
        newColorPanel.push({
          [`Sub Image ${index}`]: {
            ...item.color_specification,
          },
        });
      }
    });

    setColorDetection([...newColorPanel]);

    if (colorDetectData.data?.recommendation_collection) {
      setCollectionRecommnedation(colorDetectData.data.recommendation_collection);
    }
  };

  useEffect(() => {
    if (visible !== 'Color AI') {
      return;
    }

    getImageColorDetection();

    return () => {
      setColorSwitch(undefined);
      setChosenColor({ name: '' });
    };
  }, [visible]);

  const showColorAnalysis =
    (colorDetail: ColorConversionProps['conversion'], color: string, index: number) => () => {
      if (!colorSwitch) {
        return;
      }

      ///
      setChosenColor({ name: color, index });

      const newBasicInfo: ColorOriginRrops[] = [
        { Hue: colorDetail.origin.hue ?? '' },
        { Saturation: colorDetail.origin.sat ?? '' },
        { Lightness: colorDetail.origin.lightness ?? '' },
        { Whiteness: colorDetail.origin.whiteness ?? '' },
        { Blackness: colorDetail.origin.blackness ?? '' },
        { 'Color Temperature': colorDetail.origin.temperature ?? '' },
      ] as any;

      const newConversionInfo: ColorCoversionAnalysisProps[] = [
        { hex: colorDetail.hex },

        {
          cmyk: {
            c: !isNaN(colorDetail.cmyk.c) ? formatPercentNumber(colorDetail.cmyk.c) : '',
            y: !isNaN(colorDetail.cmyk.y) ? formatPercentNumber(colorDetail.cmyk.y) : '',
            m: !isNaN(colorDetail.cmyk.m) ? formatPercentNumber(colorDetail.cmyk.m) : '',
            k: !isNaN(colorDetail.cmyk.k) ? formatPercentNumber(colorDetail.cmyk.k) : '',
          },
        },
        {
          hsl: {
            h: colorDetail.hsl.h ?? '',
            s: !isNaN(colorDetail.hsl.s) ? formatPercentNumber(colorDetail.hsl.s) : '',
            l: !isNaN(colorDetail.hsl.l) ? formatPercentNumber(colorDetail.hsl.l) : '',
          },
        },
        {
          hwb: {
            h: colorDetail.hwb.h ?? '',
            w: !isNaN(colorDetail.hwb.w) ? formatPercentNumber(colorDetail.hwb.w) : '',
            b: !isNaN(colorDetail.hwb.b) ? formatPercentNumber(colorDetail.hwb.b) : '',
          },
        },
        {
          lab: {
            l: !isNaN(colorDetail.lab.l) ? formatNumber(colorDetail.lab.l, 0) : '',
            a: !isNaN(colorDetail.lab.a) ? formatNumber(colorDetail.lab.a, 0) : '',
            b: !isNaN(colorDetail.lab.b) ? formatNumber(colorDetail.lab.b, 0) : '',
          },
        },
        {
          rgb: {
            r: !isNaN(colorDetail.rgb.r) ? formatNumber(colorDetail.rgb.r, 0) : '',
            g: !isNaN(colorDetail.rgb.g) ? formatNumber(colorDetail.rgb.g, 0) : '',
            b: !isNaN(colorDetail.rgb.b) ? formatNumber(colorDetail.rgb.b, 0) : '',
          },
        },
      ] as any;

      setBasicData([...newBasicInfo]);

      setConversionData([...newConversionInfo]);
    };

  const renderColorAnalysis = () => (
    <div className="flex-start">
      <RobotoBodyText level={5} style={{ marginRight: 32, fontWeight: colorSwitch ? 500 : 300 }}>
        COLOUR ANALYSIS
      </RobotoBodyText>
      <SwitchDynamic
        checked={colorSwitch}
        onClick={(toggle) => {
          setColorSwitch(toggle);
        }}
      />
    </div>
  );

  const imageBlockStyles = {
    marginBottom: 16,
    borderBottom: '1px solid rgb(0 0 0 / 30%)',
    width: '100%',
  };

  const colorProps = {
    style: { marginBottom: 16 },
    color: chosenColor.name,
  };

  return (
    <Popover
      title="COLOUR AI"
      visible
      className={`${isUndefined(colorSwitch) ? '' : 'xTransition'} ${
        isTablet ? styles.modalOnTablet : styles.modal
      } `}
      width={colorSwitch && !isTablet ? '70%' : 576}
      onFormSubmit={() => {
        store.dispatch(
          setPartialProductDetail({
            collection: {
              id: collectionRecommendation.id,
              name: collectionRecommendation.name,
            },
          }),
        );

        closeModal();
      }}
    >
      <Row style={{ display: 'flex', flexFlow: isTablet ? 'column' : 'row wrap' }}>
        {/* left side */}
        <Col span={colorSwitch && !isTablet ? 12 : 24}>
          <div className="h-full">
            <div className={styles.colorHeader}>
              <Title level={8}> COLOUR DETECTION </Title>

              {colorSwitch ? null : renderColorAnalysis()}
            </div>
            <div style={isTablet ? undefined : { height: 560, overflow: 'auto' }}>
              <div>
                {colorDetection.map((item, index) => {
                  const conversionKey = Object.keys(item)[0];
                  const info = item[conversionKey] as ColorConversionProps;
                  const keys = Object.keys(info);

                  return (
                    <div key={index} style={{ ...imageBlockStyles }}>
                      <Title level={8} style={{ height: 32 }}>
                        {conversionKey}
                      </Title>
                      <div className="flex-start">
                        {keys.map((el, elIdx) => {
                          const density = formatNumber(info[el]['density'], 0);
                          const hex = info[el]['conversion']['hex'];

                          return (
                            <div
                              key={elIdx}
                              className="d-flex flex-column"
                              style={{ width: `${density}%` }}
                            >
                              <div
                                className={
                                  chosenColor.name === hex && chosenColor.index === elIdx
                                    ? styles.activeColor
                                    : undefined
                                }
                                onClick={showColorAnalysis(info[el]['conversion'], hex, elIdx)}
                                style={{
                                  background: hex,
                                  height: 48,
                                }}
                              ></div>
                              <RobotoBodyText
                                customClass="flex-center"
                                level={5}
                                style={{
                                  height: 32,
                                  fontWeight:
                                    chosenColor.name === hex && chosenColor.index === elIdx
                                      ? 500
                                      : 300,
                                }}
                              >
                                {density}%
                              </RobotoBodyText>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-start">
              <Title level={8}>Recommendation:</Title>
              <RobotoBodyText level={4} style={{ marginLeft: 16, textTransform: 'capitalize' }}>
                {collectionRecommendation.name}
              </RobotoBodyText>
            </div>
          </div>
        </Col>

        {/* right side */}
        {colorSwitch ? (
          <Col span={isTablet ? 24 : 12} style={{ paddingLeft: isTablet ? 0 : 16 }}>
            <div className={styles.colorHeader}>{colorSwitch ? renderColorAnalysis() : null}</div>
            <div style={isTablet ? undefined : { overflow: 'auto', height: 586 }}>
              {!chosenColor.name ? (
                <RobotoBodyText customClass="h-full flex-center" level={5} color="mono-color-dark">
                  Click on a colour to view the colour analysis
                </RobotoBodyText>
              ) : (
                <div>
                  {/* Basic */}
                  <div>
                    <Title level={8} customClass={styles.title}>
                      Basic
                    </Title>
                    <table className={styles.tableColor}>
                      <tbody>
                        {basicData.map((el, index) => {
                          const key = Object.keys(el)[0];

                          return (
                            <TableContent
                              key={index}
                              customClass={styles.label}
                              textLeftWidth={tableTdLeftWidth}
                              textLeft={
                                <BodyText
                                  level={4}
                                  style={{ fontWeight: 600, textTransform: 'capitalize' }}
                                >
                                  {key}
                                </BodyText>
                              }
                              textRightWidth={tableTdRightWidth}
                              textRight={
                                key === 'Color Temperature' || key === 'Hue' ? (
                                  <RobotoBodyText level={5} style={{ textTransform: 'capitalize' }}>
                                    {el[key]}
                                  </RobotoBodyText>
                                ) : (
                                  <RobotoBodyText level={5} style={{ textTransform: 'capitalize' }}>
                                    {formatPercentNumber(el[key])}
                                  </RobotoBodyText>
                                )
                              }
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Conversion */}
                  <div>
                    <Title level={8} customClass={styles.title}>
                      Conversion
                    </Title>
                    <table className={styles.tableColor}>
                      <tbody>
                        {conversionData.map((el, index) => {
                          const key = Object.keys(el)[0];
                          const values = Object.values(el);

                          const renderColourInfo = () => {
                            return (
                              <div key={index}>
                                {values.map((elvalue: any, elValueIds) => {
                                  if (typeof elvalue === 'object') {
                                    const subKeys = Object.keys(elvalue);

                                    return (
                                      <div className="flex-between" key={elValueIds}>
                                        {subKeys.map((subKey, subIdx) => {
                                          return (
                                            <div
                                              key={subIdx}
                                              className="flex-start"
                                              style={{
                                                width: `calc(${tableTdRightWidth} / ${subKeys.length})`,
                                              }}
                                              title={`${subKey}: ${elvalue[subKey]}`}
                                            >
                                              <RobotoBodyText
                                                level={5}
                                                style={{
                                                  fontWeight: 500,
                                                  textTransform: 'uppercase',
                                                  marginRight: 8,
                                                }}
                                              >
                                                {subKey}:
                                              </RobotoBodyText>

                                              <RobotoBodyText level={5}>
                                                {elvalue[subKey]}
                                              </RobotoBodyText>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  }

                                  return (
                                    <RobotoBodyText
                                      key={index}
                                      level={5}
                                      style={{
                                        textTransform: 'uppercase',
                                      }}
                                    >
                                      {elvalue}
                                    </RobotoBodyText>
                                  );
                                })}
                              </div>
                            );
                          };

                          return (
                            <TableContent
                              key={index}
                              customClass={styles.label}
                              textLeftWidth={tableTdLeftWidth}
                              textLeft={
                                key === 'hex' ? (
                                  <BodyText
                                    key={index}
                                    level={4}
                                    style={{ fontWeight: 600, textTransform: 'capitalize' }}
                                  >
                                    HEX Code
                                  </BodyText>
                                ) : (
                                  <BodyText
                                    key={index}
                                    level={4}
                                    style={{ fontWeight: 600, textTransform: 'uppercase' }}
                                  >
                                    {key}
                                  </BodyText>
                                )
                              }
                              textRightWidth={tableTdRightWidth}
                              textRight={renderColourInfo()}
                            />
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Colour Palatte */}
                  <div>
                    <Title level={8} customClass={styles.title}>
                      Color Palette
                    </Title>

                    <TintPalette {...colorProps} />

                    <ShadePalette {...colorProps} />

                    <MonoChromaticPalette {...colorProps} />

                    <AnalogousPalette {...colorProps} />

                    <ComplementaryPalette {...colorProps} />

                    <SplitComplementaryPalette {...colorProps} />

                    <TriadicPalette {...colorProps} />

                    <SquarePalette {...colorProps} />

                    <TetradicPalette {...colorProps} />
                  </div>
                </div>
              )}
            </div>
          </Col>
        ) : null}
      </Row>
    </Popover>
  );
};
