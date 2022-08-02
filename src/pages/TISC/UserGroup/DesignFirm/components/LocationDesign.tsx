import { BodyText } from '@/components/Typography';
import { CollapsingProps } from '@/pages/HowTo/types';
import { Col, Collapse, Row } from 'antd';
import { FC, useState } from 'react';
import styles from '../styles/LocationDesign.less';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '@/assets/icons/drop-up-icon.svg';
import ItemLocationDesign from './ItemLocationDesign';

interface LocationDesignProps extends CollapsingProps {
  value: {
    id: string;
    name: string;
    location: {
      business_name: string;
      info: { location: string; address: string; phone: string; gmail: string };
    }[];
  };
  index: number;
  customClass?: string;
}
const data = [
  {
    id: '1',
    name: 'Singapore',
    location: [
      {
        business_name: 'singapo1',
        info: {
          location: 'main office',
          address: 'aa',
          phone: '11',
          gmail: 'a@gmail.com',
        },
      },
    ],
  },
  {
    id: '2',
    name: 'Thailand',
    location: [
      {
        business_name: 'singapo1',
        info: {
          location: 'main office',
          address: 'aa',
          phone: '11',
          gmail: 'a@gmail.com',
        },
      },
    ],
  },
];
const RenderHeader: FC<LocationDesignProps> = (props) => {
  const { value, activeKey, handleActiveCollapse, index, customClass } = props;
  return (
    <div className={styles.panel_header}>
      <div
        className={`${styles.panel_header__field} ${customClass}`}
        onClick={() => handleActiveCollapse(value ? index : -1)}
      >
        <div className={styles.titleIcon}>
          <div>
            <BodyText
              level={5}
              fontFamily="Roboto"
              customClass={
                String(index) !== activeKey ? styles.font_weight_300 : styles.font_weight_500
              }
            >
              {value.name}
              <span style={{ marginLeft: '8px' }}>({value.location.length})</span>
            </BodyText>
          </div>
        </div>
        <div className={styles.addIcon}>
          {String(index) !== activeKey ? <DropdownIcon /> : <DropupIcon />}
        </div>
      </div>
    </div>
  );
};

const ListLocation: FC<LocationDesignProps> = ({
  index,
  value,
  activeKey,
  handleActiveCollapse,
  customClass,
}) => {
  const [activeKeyItem, setActiveKeyItem] = useState<string>('');
  const handleActiveCollapseItem = (indexItem: number) => {
    setActiveKeyItem(activeKeyItem === String(indexItem) ? '' : String(indexItem));
  };
  return (
    <div className={styles.location}>
      <Collapse ghost activeKey={activeKey}>
        <Collapse.Panel
          header={
            <RenderHeader
              index={index}
              value={value}
              activeKey={activeKey}
              handleActiveCollapse={handleActiveCollapse}
              customClass={customClass}
            />
          }
          key={index}
          showArrow={false}
          className={value.id !== activeKey ? styles['bottomMedium'] : styles['bottomBlack']}
        >
          <div>
            {value.location.map((location, key) => {
              return (
                <ItemLocationDesign
                  index={key}
                  value={location}
                  activeKey={activeKeyItem}
                  handleActiveCollapse={handleActiveCollapseItem}
                />
              );
            })}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

const LocationDesign = () => {
  const [activeKey, setActiveKey] = useState<string>('');
  const handleActiveCollapse = (index: number) => {
    setActiveKey(activeKey === String(index) ? '' : String(index));
  };
  return (
    <div>
      <Row>
        <Col span={12}>
          <div className={styles.content}>
            {data.map((item, index) => (
              <div>
                <ListLocation
                  key={index}
                  index={index}
                  value={item}
                  activeKey={activeKey}
                  handleActiveCollapse={handleActiveCollapse}
                />
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default LocationDesign;
