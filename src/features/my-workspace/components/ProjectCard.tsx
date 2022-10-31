import { FC } from 'react';

import { PATH } from '@/constants/path';
import { FilterNames } from '@/pages/Designer/Project/constants/filter';

import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';

import { pushTo } from '@/helper/history';
import { getDesignDueDay, getFullName, getValueByCondition } from '@/helper/utils';

import { ProjectListProps } from '@/features/project/types';
import { BrandCard, BrandCardTeam } from '@/features/user-group/types';
import { ProjecTrackingList } from '@/types/project-tracking.type';

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
  const pathDetail = getValueByCondition([
    [isBrandUser, PATH.brandViewDetailDashboard],
    [isDesignerUser, PATH.designerUpdateProject],
  ]);

  const handleClickItem = (id: string) => {
    if (id && !isTiscUser) {
      pushTo(pathDetail.replace(':id', id));
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
          {isBrandUser ? info.location : `Code ${info.code}`}
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

    return (
      <>
        <div className={styles.middle}>
          <div className={styles.middleKey}>
            <BodyText level={5}>{isBrandUser ? 'Requests' : 'Project Status'}:</BodyText>
          </div>
          <div className={styles.middleValue}>
            <BodyText level={6} fontFamily="Roboto">
              {isBrandUser ? info.requestCount : FilterNames[Number(info.status)]}
            </BodyText>
          </div>
          {info.newRequest ? <UnreadIcon /> : <span style={{ width: '18px', height: '18px' }} />}
        </div>

        <div className={styles.middle}>
          <div className={styles.middleKey}>
            <BodyText level={5}>{isBrandUser ? 'Notifications' : 'Design due'}:</BodyText>
          </div>
          <div className={styles.middleValue}>
            <BodyText level={6} fontFamily="Roboto">
              {isBrandUser ? info.notificationCount : getDesignDueDay(info.design_due)}
            </BodyText>
          </div>
          {info.newNotification ? (
            <UnreadIcon />
          ) : (
            <span style={{ width: '18px', height: '18px' }} />
          )}
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

  return (
    <div className={styles.cardContainer} style={{ cursor: isTiscUser ? 'default' : 'pointer' }}>
      {data?.map((item: any, index) => (
        <div
          key={item.id ?? index}
          className={styles.cardItemWrapper}
          onClick={() => handleClickItem(item.id)}>
          <div className={styles.cardItem}>
            <div className={styles.top}>{renderTopInfo(item)}</div>

            {renderMiddleInfo(item)}

            <div className={styles.profile_icon}>
              <BodyText level={5} style={{ marginRight: '24px' }}>
                Teams:
              </BodyText>
              <div className={styles.team}>{getAssignedTeamInfo(item)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
