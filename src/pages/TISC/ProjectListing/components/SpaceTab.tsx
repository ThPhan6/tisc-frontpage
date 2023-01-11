import { FC } from 'react';

import { Collapse, Row } from 'antd';

import { formatNumber } from '@/helper/utils';

import { SpaceDetail } from '../type';
import { ProjectSpaceArea } from '@/features/project/types';

import { ResponsiveCol } from '@/components/Layout';
import { BodyText, Title } from '@/components/Typography';
import {
  CollapseLevel1Props,
  CollapseLevel2Props,
} from '@/features/user-group/components/ExpandIcon';
import GeneralData from '@/features/user-group/components/GeneralData';

import styles from './Component.less';

interface LabelHeaderProps {
  header: string;
  quantity?: number | string;
  isSubHeader: boolean;
}
interface SpaceTabProps {
  space?: SpaceDetail;
}
interface ListAreaProps {
  areas: ProjectSpaceArea[];
  index: number;
}

const LabelHeader: FC<LabelHeaderProps> = ({ header, quantity, isSubHeader }) => {
  return (
    <span className={isSubHeader ? styles.dropdownCount : ''}>
      {header}
      <span
        className={styles.quantity}
        style={{
          marginLeft: 8,
        }}
      >
        ({quantity ?? '0'})
      </span>
    </span>
  );
};

const ProjectSpaceAreas: FC<ListAreaProps> = ({ areas, index }) => {
  return (
    <Collapse {...CollapseLevel2Props}>
      {areas.map((area, areaIndex) => (
        <Collapse.Panel
          header={
            <LabelHeader header={area.name} quantity={area.rooms.length} isSubHeader={true} />
          }
          key={`${index}-${areaIndex}`}
          collapsible={area.rooms.length === 0 ? 'disabled' : undefined}
        >
          {area.rooms.map((room, idx) => (
            <table className={styles.roomCode} key={idx}>
              <tr>
                <td className={styles.code}>
                  <BodyText level={5} fontFamily="Roboto">
                    {room.room_id}
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
  );
};

export const SpaceTab: FC<SpaceTabProps> = ({ space }) => {
  return (
    <Row>
      <ResponsiveCol className={styles.container}>
        <div className={styles.content}>
          <GeneralData>
            {space?.zones.length
              ? space?.zones.map((zone, index) => (
                  <Collapse {...CollapseLevel1Props}>
                    <Collapse.Panel
                      header={
                        <LabelHeader
                          header={zone.name}
                          quantity={zone.areas.length}
                          isSubHeader={false}
                        />
                      }
                      key={index}
                      collapsible={zone.areas.length === 0 ? 'disabled' : undefined}
                    >
                      <ProjectSpaceAreas areas={zone.areas} index={index} />
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
            {formatNumber(space?.metricArea ?? 0)} sq.m.
          </Title>
          <Title level={9}>{formatNumber(space?.imperialArea ?? 0)} sq.ft.</Title>
        </div>
      </ResponsiveCol>
    </Row>
  );
};
