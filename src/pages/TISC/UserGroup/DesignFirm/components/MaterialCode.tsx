import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { BodyText, Title } from '@/components/Typography';
import { MaterialCodeDesignFirm } from '@/types';
import { Col, Collapse, Row } from 'antd';
import { FC, useState } from 'react';
import { RenderLabelHeader } from '../../components/renderHeader';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/ComponentViewDesign.less';

interface MaterialCodeProp {
  materialCodeData: MaterialCodeDesignFirm[];
}

const MaterialCode: FC<MaterialCodeProp> = ({ materialCodeData }) => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

  return (
    <Row className={indexStyles.container}>
      <Col span={12}>
        <div className={`${indexStyles.form} ${styles.team_form}`}>
          <Collapse
            accordion
            bordered={false}
            expandIconPosition="right"
            expandIcon={({ isActive }) => (isActive ? <DropupIcon /> : <DropdownIcon />)}
            className={indexStyles.dropdownList}
            activeKey={activeKey}
            onChange={(key) => {
              setActiveKey(key);
            }}
          >
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
                collapsible={item.count === 0 ? 'disabled' : undefined}
              >
                <Collapse
                  accordion
                  bordered={false}
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? <DropupV2Icon /> : <DropdownV2Icon />)}
                  className={indexStyles.secondDropdownList}
                >
                  {item.subs.map((material, materialIndex) => (
                    <Collapse.Panel
                      header={
                        <RenderLabelHeader
                          header={material.name}
                          quantity={material.count}
                          isSubHeader={true}
                          isUpperCase={false}
                        />
                      }
                      key={`${index}-${materialIndex}`}
                      collapsible={material.count === 0 ? 'disabled' : undefined}
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                        {material.codes.map((itm, idx) => (
                          <table className={styles.list_material_table} key={idx}>
                            <tr>
                              <td className={styles.code}>
                                <Title level={8} customClass={styles.colorMaterial}>
                                  {itm.code}
                                </Title>
                              </td>
                              <td className={styles.material}>
                                <BodyText
                                  level={5}
                                  fontFamily="Roboto"
                                  customClass={styles.colorMaterial}
                                >
                                  {itm.description}
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
        </div>
      </Col>
    </Row>
  );
};

export default MaterialCode;
