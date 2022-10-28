import { FC } from 'react';

import { PATH } from '@/constants/path';

import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';

import { pushTo } from '@/helper/history';
import { getFullName } from '@/helper/utils';

import { BrandCardTeam } from '@/features/user-group/types';
import { ProjecTrackingList } from '@/types/project-tracking.type';

import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { BodyText } from '@/components/Typography';

import styles from './ProjectCard.less';

interface ProjectCardProps {
  data?: ProjecTrackingList[];
}
export const ProjectCard: FC<ProjectCardProps> = ({ data }) => {
  const handleClickItem = (id: string) => {
    pushTo(PATH.brandViewDetailDashboard.replace(':id', id));
  };
  return (
    <div className={styles.productCardContainer}>
      {data?.map((brand) => (
        <div
          key={brand.id}
          className={styles.productCardItemWrapper}
          onClick={() => handleClickItem(brand.id)}>
          <div className={styles.productCardItem}>
            <div className={styles.top}>
              <div className={styles.brandName}>
                <BodyText level={6} customClass={styles.bold} fontFamily="Roboto">
                  {brand.projectName}
                </BodyText>
              </div>
              <BodyText level={6} fontFamily="Roboto" customClass={styles.location}>
                {brand.projectLocation}
              </BodyText>
            </div>
            <div className={styles.middle}>
              <div className={styles.middleKey}>
                <BodyText level={5}>Requests:</BodyText>
              </div>
              <div className={styles.middleValue}>
                <BodyText level={6} fontFamily="Roboto">
                  {brand.requestCount}
                </BodyText>
              </div>
              {brand.newRequest ? (
                <UnreadIcon />
              ) : (
                <span style={{ width: '18px', height: '18px' }}></span>
              )}
            </div>
            <div className={styles.middle}>
              <div className={styles.middleKey}>
                <BodyText level={5}>Notifications:</BodyText>
              </div>
              <div className={styles.middleValue}>
                <BodyText level={6} fontFamily="Roboto">
                  {brand.notificationCount}
                </BodyText>
              </div>
              {brand.newNotification ? (
                <UnreadIcon />
              ) : (
                <span style={{ width: '18px', height: '18px' }}></span>
              )}
            </div>

            <div className={styles.profile_icon}>
              <BodyText level={5} style={{ marginRight: '24px' }}>
                Teams:
              </BodyText>
              <div className={styles.team}>
                {brand.assignedTeams.map((user: BrandCardTeam) => (
                  <TeamIcon
                    key={user.id}
                    avatar={user.avatar}
                    name={getFullName(user)}
                    customClass={styles.avatar}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
