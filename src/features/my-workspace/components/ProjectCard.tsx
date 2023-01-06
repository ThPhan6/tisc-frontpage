import { FC } from 'react';

import { PATH } from '@/constants/path';
import { FilterNames } from '@/pages/Designer/Project/constants/filter';
import { Row } from 'antd';

import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';

import { pushTo } from '@/helper/history';
import { getDesignDueDay, getFullName, getValueByCondition } from '@/helper/utils';

import { ProjectListProps } from '@/features/project/types';
import { BrandCard, BrandCardTeam } from '@/features/user-group/types';
import { useAppSelector } from '@/reducers';
import { ProjecTrackingList } from '@/types/project-tracking.type';

import { EmptyOne } from '@/components/Empty';
import { loadingSelector } from '@/components/LoadingPage/slices';
import { LogoIcon } from '@/components/LogoIcon';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { BodyText } from '@/components/Typography';

import styles from './ProjectCard.less';

interface ProjectCardProps {
  data: ProjecTrackingList[] | BrandCard[] | ProjectListProps[];
  isTiscUser: boolean;
  isBrandUser: boolean;
  isDesignerUser: boolean;
}
export const ProjectCard: FC<ProjectCardProps> = ({
  data,
  isTiscUser,
  isBrandUser,
  isDesignerUser,
}) => {
  const loading = useAppSelector(loadingSelector);
  const detailPath = getValueByCondition([
    [isTiscUser, PATH.tiscUserGroupBrandViewDetail],
    [isBrandUser, PATH.brandProjectTrackingDetail],
    [isDesignerUser, PATH.designerUpdateProject],
  ]);

  const handleClickItem = (id: string) => {
    if (id) {
      pushTo(detailPath.replace(':id', id));
    }
  };

  const renderTopInfo = (info: any) => {
    if (isTiscUser) {
      return (
        <>
          <div className={styles.brandName}>
            <BodyText level={6} customClass={styles.bold} fontFamily="Roboto">
              {info.name}
            </BodyText>
          </div>
          <LogoIcon logo={info.logo} className={styles.img} />
          <BodyText level={6} fontFamily="Roboto">
            {info.country}
          </BodyText>
        </>
      );
    }

    return (
      <>
        <div className={styles.brandName}>
          <BodyText level={6} customClass={styles.bold} fontFamily="Roboto">
            {isBrandUser ? info.projectName : info.name}
          </BodyText>
        </div>
        <BodyText level={6} fontFamily="Roboto" customClass={styles.location}>
          {isBrandUser ? info.projectLocation : `Code ${info.code}`}
        </BodyText>
      </>
    );
  };

  const renderMiddleInfo = (info: any) => {
    if (isTiscUser) {
      return (
        <>
          <div className={styles.middle}>
            <div className={styles.middleKey}>
              <BodyText level={5}>Categories:</BodyText>
            </div>
            <div className={styles.middleValue}>
              <BodyText level={6} fontFamily="Roboto">
                {info.category_count}
              </BodyText>
            </div>
          </div>
          <div className={styles.middle}>
            <div className={styles.middleKey}>
              <BodyText level={5}>Collections:</BodyText>
            </div>
            <div className={styles.middleValue}>
              <BodyText level={6} fontFamily="Roboto">
                {info.collection_count}
              </BodyText>
            </div>
          </div>
          <div className={styles.middle}>
            <div className={styles.middleKey}>
              <BodyText level={5}>Cards:</BodyText>
            </div>
            <div className={styles.middleValue}>
              <BodyText level={6} fontFamily="Roboto">
                {info.card_count}
              </BodyText>
            </div>
          </div>
        </>
      );
    }

    const dueDay = getDesignDueDay(info.design_due);

    return (
      <>
        <div className={styles.middle}>
          <div className={styles.middleKey}>
            <BodyText level={5}>{isBrandUser ? 'Requests' : 'Project Status'}:</BodyText>
          </div>
          <div className={styles.middleValue}>
            <BodyText level={6} fontFamily="Roboto" customClass="text-overflow">
              {isBrandUser ? info.requestCount : FilterNames[Number(info.status)]}
            </BodyText>
          </div>
          {info.newRequest ? <UnreadIcon /> : <span />}
        </div>

        <div className={styles.middle}>
          <div className={styles.middleKey}>
            <BodyText level={5}>{isBrandUser ? 'Notifications' : 'Design due'}:</BodyText>
          </div>
          <div
            className={`${styles.middleValue} ${!isBrandUser && dueDay.value < 0 ? 'late' : ''}`}
          >
            <BodyText level={6} fontFamily="Roboto" customClass="text-overflow">
              {isBrandUser ? info.notificationCount : dueDay.text}
            </BodyText>
          </div>
          {info.newNotification ? <UnreadIcon /> : <span />}
        </div>
      </>
    );
  };

  const getAssignedTeamInfo = (info: any) => {
    const assignedTeam = getValueByCondition([
      [isTiscUser, info.teams],
      [isBrandUser, info.assignedTeams],
      [isDesignerUser, info.assign_teams],
    ]);

    return assignedTeam?.map((user: BrandCardTeam) => (
      <TeamIcon
        key={user.id}
        avatar={user.avatar}
        name={getFullName(user)}
        customClass={styles.avatar}
      />
    ));
  };

  if (loading) {
    return null;
  }

  return (
    <div className={styles.cardContainer}>
      {data.length ? (
        data.map((item: any, index) => (
          <div
            key={item.id ?? index}
            className={styles.cardItemWrapper}
            onClick={() => handleClickItem(item.id)}
          >
            <div className={styles.cardItem}>
              <div className={styles.top}>{renderTopInfo(item)}</div>

              {renderMiddleInfo(item)}

              <div className={styles.profile_icon}>
                <BodyText level={5} style={{ marginRight: '14px' }}>
                  Teams:
                </BodyText>
                <div className={styles.team}>{getAssignedTeamInfo(item)}</div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <Row justify="center" style={{ width: '100%' }}>
          <EmptyOne />
        </Row>
      )}
    </div>
  );
};
