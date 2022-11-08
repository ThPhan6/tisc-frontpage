import { FC } from 'react';

import { Col, Collapse, Row } from 'antd';

import { SpaceDetail } from '../type';

import { BodyText, Title } from '@/components/Typography';
import {
  CollapseLevel1Props,
  CollapseLevel2Props,
} from '@/features/user-group/components/ExpandIcon';
import GeneralData from '@/features/user-group/components/GeneralData';

import styles from './Component.less';

interface RenderLabelHeaderProps {
  header: string;
  quantity?: number | string;
  isSubHeader: boolean;
}

interface SpaceTabProps {
  space?: SpaceDetail;
}

export const RenderLabelHeader: FC<RenderLabelHeaderProps> = ({
  header,
  quantity,
  isSubHeader,
}) => {
  return (
    <span className={isSubHeader ? styles.dropdownCount : ''}>
      {header}

      <span
        className={styles.quantity}
        style={{
          marginLeft: 8,
        }}>
        ({quantity ?? '0'})
      </span>
    </span>
  );
};

export const SpaceTab: FC<SpaceTabProps> = ({ space }) => {
  return (
    <Row>
      <Col span={12} className={styles.container}>
        <div className={styles.content}>
          <GeneralData>
            {space?.zones.length
              ? space?.zones.map((zone, index) => (
                  <Collapse {...CollapseLevel1Props}>
                    <Collapse.Panel
                      header={
                        <RenderLabelHeader
                          header={zone.name}
                          quantity={zone.areas.length}
                          isSubHeader={false}
                        />
                      }
                      key={index}
                      collapsible={zone.areas.length === 0 ? 'disabled' : undefined}>
                      <Collapse {...CollapseLevel2Props}>
                        {zone.areas.map((area, areaIndex) => (
                          <Collapse.Panel
                            header={
                              <RenderLabelHeader
                                header={area.name}
                                quantity={area.rooms.length}
                                isSubHeader={true}
                              />
                            }
                            key={`${index}-${areaIndex}`}
                            collapsible={area.rooms.length === 0 ? 'disabled' : undefined}>
                            {area.rooms.map((room, idx) => (
                              <table className={styles.roomCode} key={idx}>
                                <tr>
                                  <td className={styles.code}>
                                    <BodyText level={5} fontFamily="Roboto">
                                      {room.room_size}
                                    </BodyText>
                                  </td>
                                  <td className={styles.room}>
                                    <BodyText level={5} fontFamily="Roboto">
                                      {room.room_name}
                                    </BodyText>
                                  </td>
                                </tr>
                              </table>
                            ))}
                          </Collapse.Panel>
                        ))}
                      </Collapse>
                    </Collapse.Panel>
                  </Collapse>
                ))
              : null}
          </GeneralData>
        </div>
        <div className={styles.bottom}>
          <BodyText level={6} fontFamily="Roboto" style={{ marginRight: '8px' }}>
            Total Area:
          </BodyText>
          <Title level={9} style={{ marginRight: '12px' }}>
            {space?.metricArea} sq.m.
          </Title>
          <Title level={9}>{space?.imperialArea} sq.ft.</Title>
        </div>
      </Col>
    </Row>
  );
};
