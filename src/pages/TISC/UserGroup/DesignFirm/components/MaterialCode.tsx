import { ReactComponent as DropdownV2Icon } from '@/assets/icons/action-down-icon.svg';
import { ReactComponent as DropupV2Icon } from '@/assets/icons/action-up-icon.svg';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText, Title } from '@/components/Typography';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import { useState } from 'react';
import indexStyles from '../../index.less';
import styles from '../styles/TeamsDesign.less';

type ActiveKeyType = string | number | (string | number)[];

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

const MaterialCode = () => {
  const [activeKey, setActiveKey] = useState<ActiveKeyType>([]);

  const renderMaterialHeader = (user: any) => {
    return (
      <div className={styles.userName}>
        <span>
          {user.list_material}
          <span
            className={indexStyles.dropdownCount}
            style={{
              marginLeft: 8,
            }}
          >
            ({user.subs.length})
          </span>
        </span>
      </div>
    );
  };

  const renderHeader = (team: any) => {
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
                      {material.subs.map((itm, idx) => {
                        console.log(item);
                        <div className={`${indexStyles.info} ${styles.teamInfo}`} key={idx}>
                          <CustomInput containerClass={styles.customInputURL} value={itm.code} />
                          <CustomInput
                            containerClass={styles.customInputURL}
                            value={itm.material}
                          />
                          <Title level={8}>{itm.code}</Title>
                          <BodyText level={5} fontFamily="Roboto">
                            {itm.material}
                          </BodyText>
                        </div>;
                      })}
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
