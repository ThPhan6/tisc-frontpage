import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { BodyText, Title } from '@/components/Typography';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import indexStyles from '../../styles/index.less';
import { ActiveKeyType } from '../../types';
import styles from '../styles/ComponentViewDesign.less';

const data = [
  {
    name: 'General Material',
    material_code: [
      {
        list_material: 'Metal Alloy',
        subs: [
          {
            code: 'AL',
            material: 'Architectural Aluminium',
          },
          {
            code: 'BRS',
            material: 'Architectural Brass',
          },
        ],
      },
    ],
  },
  {
    name: 'Interior Fitout',
    material_code: [
      {
        list_material: 'Metal Alloy',
        subs: [
          {
            code: 'AL',
            material: 'Architectural Aluminium',
          },
          {
            code: 'BRS',
            material: 'Architectural Brass',
          },
        ],
      },
    ],
  },
];

interface Material {
  list_material: string;
  subs: {
    code: string;
    material: string;
  }[];
}
interface ListMaterial {
  name: string;
  material_code: Material[];
}
const MaterialCode = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

  const renderMaterialHeader = (user: Material) => {
    return (
      <div className={styles.userName}>
        <span className={indexStyles.dropdownCount}>
          {user.list_material}
          <span
            style={{
              marginLeft: 8,
              fontWeight: 300,
            }}
          >
            ({user.subs.length})
          </span>
        </span>
      </div>
    );
  };

  const renderHeader = (team: ListMaterial) => {
    return (
      <span>
        {team.name}
        <span
          className={indexStyles.dropdownCount}
          style={{
            marginLeft: 8,
          }}
        >
          ({team.material_code.length})
        </span>
      </span>
    );
  };

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
            {data.map((item, index) => (
              <Collapse.Panel
                header={renderHeader(item)}
                key={index}
                collapsible={isEmpty(item.name) ? 'disabled' : undefined}
              >
                <Collapse
                  accordion
                  bordered={false}
                  expandIconPosition="right"
                  expandIcon={({ isActive }) => (isActive ? <DropupV2Icon /> : <DropdownV2Icon />)}
                  className={indexStyles.secondDropdownList}
                >
                  {item.material_code.map((material, userIndex) => (
                    <Collapse.Panel
                      header={renderMaterialHeader(material)}
                      key={`${index}-${userIndex}`}
                      collapsible={isEmpty(material.list_material) ? 'disabled' : undefined}
                    >
                      <div className={`${indexStyles.info} ${styles.teamInfo}`}>
                        {material.subs.map((itm, idx) => (
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
                                  {itm.material}
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
