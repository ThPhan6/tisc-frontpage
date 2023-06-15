import { useEffect, useState } from 'react';

import { Col, Row } from 'antd';

import { detectImageColor } from './services';
import { formatNumber } from '@/helper/utils';
import { isUndefined } from 'lodash';

import { setPartialProductDetail } from '../product/reducers';
import {
  ColorConversionProps,
  ColorCoversionAnalysisProps,
  ColorOriginRrops,
  ColourAIResponse,
  fdata,
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

export const ColorDetection = () => {
  const visible = useAppSelector((state) => state.modal.type);

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

    fdata.data?.images?.forEach((item, index) => {
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

    if (fdata.data?.recommendation_collection) {
      setCollectionRecommnedation(fdata.data.recommendation_collection);
    }
  };

  useEffect(() => {
    if (visible !== 'Color AI') {
      return;
    }

    getImageColorDetection();

    return () => {
      setColorSwitch(undefined);
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
            c: colorDetail.cmyk.c ?? '',
            y: colorDetail.cmyk.y ?? '',
            m: colorDetail.cmyk.m ?? '',
            k: colorDetail.cmyk.k ?? '',
          },
        },
        {
          hsl: {
            h: colorDetail.hsl.h ?? '',
            s: colorDetail.hsl.s ?? '',
            l: colorDetail.hsl.l ?? '',
          },
        },
        {
          hwb: {
            h: colorDetail.hwb.h ?? '',
            w: colorDetail.hwb.w ?? '',
            b: colorDetail.hwb.b ?? '',
          },
        },
        { lab: colorDetail.lab },
        {
          rgb: {
            r: colorDetail.rgb.r ?? '',
            g: colorDetail.rgb.g ?? '',
            b: colorDetail.rgb.b ?? '',
          },
        },
      ] as any;

      setBasicData([...newBasicInfo]);

      setConversionData([...newConversionInfo]);
    };

  const renderColorAnalysis = () => (
    <div className="flex-start">
      <RobotoBodyText
        level={5}
        color={colorSwitch ? 'mono-color' : 'mono-color-dark'}
        style={{ marginRight: 32, fontWeight: colorSwitch ? 500 : 300 }}
      >
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
      className={`${isUndefined(colorSwitch) ? '' : 'xTransition'} ${styles.modal} `}
      width={colorSwitch ? '70%' : 576}
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
      <Row className="h-full">
        {/* left side */}
        <Col span={colorSwitch ? 12 : 24}>
          <div className="h-full">
            <div className={styles.colorHeader}>
              <Title level={8}> COLOUR DETECTION </Title>

              {colorSwitch ? null : renderColorAnalysis()}
            </div>
            <div style={{ height: 566, overflow: 'auto' }}>
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
                          const density = formatNumber(info[el]['density']);
                          const hex = info[el]['conversion']['hex'];

                          return (
                            <div
                              key={elIdx}
                              className="d-flex flex-column"
                              style={{ width: `${density}%` }}
                            >
                              <div
                                className={`${
                                  chosenColor.name === hex && chosenColor.index === elIdx
                                    ? styles.activeColor
                                    : ''
                                } ${styles.activeHover}`}
                                onClick={showColorAnalysis(info[el]['conversion'], hex, elIdx)}
                                style={{
                                  background: hex,
                                  height: 48,
                                }}
                              ></div>
                              <RobotoBodyText
                                customClass="flex-center"
                                level={5}
                                style={{ height: 32 }}
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
          <Col span={12} style={{ paddingLeft: 16 }}>
            <div className={styles.colorHeader}>{colorSwitch ? renderColorAnalysis() : null}</div>
            <div style={{ overflow: 'auto', height: 586 }}>
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
                          textLeft={
                            <BodyText
                              level={4}
                              style={{ fontWeight: 600, textTransform: 'capitalize' }}
                            >
                              {key}
                            </BodyText>
                          }
                          textRight={
                            <RobotoBodyText level={5} style={{ textTransform: 'capitalize' }}>
                              {el[key]}
                            </RobotoBodyText>
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
                                          style={{ width: `calc(75% / ${subKeys.length})` }}
                                          title={`${subKey}: ${formatNumber(elvalue[subKey])}`}
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
                                            {formatNumber(elvalue[subKey])}
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
          </Col>
        ) : null}
      </Row>
    </Popover>
  );
};
