import { FC, useEffect, useState } from 'react';

import { Col, Collapse, Row } from 'antd';

import { getMaterialCodeByDesignFirm } from '../services';

import { RequiredValueProps } from '../types';
import { MaterialCodeDesignFirm } from '@/types';

import { RenderLabelHeader } from '@/components/RenderHeaderLabel';
import { BodyText, Title } from '@/components/Typography';

import styles from '../styles/design.less';
import indexStyles from '../styles/index.less';
import { CollapseLevel1Props, CollapseLevel2Props } from './ExpandIcon';
import GeneralData from './GeneralData';

const MaterialCode: FC<RequiredValueProps> = ({ id }) => {
  const [materialCodeData, setMaterialCodeData] = useState<MaterialCodeDesignFirm[]>([]);

  useEffect(() => {
    if (!id) return;

    getMaterialCodeByDesignFirm(id).then((data) => {
      if (data) {
        setMaterialCodeData(data);
      }
    });
  }, []);

  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={`${indexStyles.form} ${styles.team_form}`}>
          <GeneralData>
            {materialCodeData.length && (
              <Collapse {...CollapseLevel1Props}>
                {materialCodeData.map((item, index) => (
                  <Collapse.Panel
                    header={
                      <RenderLabelHeader
                        header={item.name}
                        quantity={item.count}
                        isSubHeader={false}
                        isUpperCase={false}
                      />
                    }
                    key={index}
                    collapsible={item.count === 0 ? 'disabled' : undefined}>
                    <Collapse {...CollapseLevel2Props}>
                      {item.subs.map((listMaterial, materialIndex) => (
                        <Collapse.Panel
                          header={
                            <RenderLabelHeader
                              header={listMaterial.name}
                              quantity={listMaterial.count}
                              isSubHeader={true}
                              isUpperCase={false}
                            />
                          }
                          key={`${index}-${materialIndex}`}
                          collapsible={listMaterial.count === 0 ? 'disabled' : undefined}>
                          <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                            {listMaterial.codes.map((materialCode, idx) => (
                              <table className={styles.list_material_table} key={idx}>
                                <tr>
                                  <td className={styles.code}>
                                    <Title level={8} customClass={styles.colorMaterial}>
                                      {materialCode.code}
                                    </Title>
                                  </td>
                                  <td className={styles.material}>
                                    <BodyText
                                      level={5}
                                      fontFamily="Roboto"
                                      customClass={styles.colorMaterial}>
                                      {materialCode.description}
                                    </BodyText>
                                  </td>
                                </tr>
                              </table>
                            ))}
                          </div>
                        </Collapse.Panel>
                      ))}
                    </Collapse>
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </GeneralData>
        </div>
      </Col>
    </Row>
  );
};

export default MaterialCode;
