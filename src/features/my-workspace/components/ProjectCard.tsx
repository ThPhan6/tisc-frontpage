import { FC, useState } from 'react';

import { PATH } from '@/constants/path';
import { QUERY_KEY } from '@/constants/util';
import { FilterNames } from '@/pages/Designer/Project/constants/filter';
import { Row, Spin } from 'antd';
import { history } from 'umi';

import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';

import { useScreen } from '@/helper/common';
import { pushTo } from '@/helper/history';
import {
  formatNumber,
  getDesignDueDay,
  getFullName,
  getValueByCondition,
  updateUrlParams,
} from '@/helper/utils';

import { setBrand } from '@/features/product/reducers';
import { ProjectListProps } from '@/features/project/types';
import { BrandCard, BrandCardTeam, BrandDetail } from '@/features/user-group/types';
import store, { useAppSelector } from '@/reducers';
import { ProjecTrackingList } from '@/types/project-tracking.type';

import { EmptyOne } from '@/components/Empty';
import { loadingSelector } from '@/components/LoadingPage/slices';
import loadingStyles from '@/components/LoadingPage/styles/index.less';
import { LogoIcon } from '@/components/LogoIcon';
import { ProfileIcon } from '@/components/ProfileIcon';
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
    [isBrandUser, PATH.brandDashboardProjectDetail],
    [isDesignerUser, PATH.designerUpdateProject],
  ]);

  const { isMobile } = useScreen();
  const handleClickItem = (cardInfo: ProjecTrackingList & BrandCard & ProjectListProps) => {
    if (cardInfo.id) {
      if (isTiscUser) {
        history.push(PATH.productConfiguration, { fromMyWorkspace: true });

        /// set brand info
        store.dispatch(setBrand({ id: cardInfo.id, name: cardInfo.name } as BrandDetail));

        /// update params
        updateUrlParams({
          set: [
            { key: QUERY_KEY.b_id, value: cardInfo.id },
            { key: QUERY_KEY.b_name, value: cardInfo.name },
            { key: QUERY_KEY.coll_id, value: 'all' },
            { key: QUERY_KEY.coll_name, value: 'VIEW ALL' },
          ],
        });

        return;
      }

      pushTo(detailPath.replace(':id', cardInfo.id));
    }
  };

  const renderTopInfo = (info: any) => {
    if (isTiscUser) {
      return (
        <>
          <div className={styles.brandName}>
            <div className="flex-between">
              <BodyText level={6} customClass={styles.bold} fontFamily="Roboto">
                {info.name}
              </BodyText>
              <LogoIcon logo={info.logo} /* className={styles.img} */ size={24} />
            </div>
          </div>
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
          {isBrandUser ? info.projectLocation : info.code}
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
                {formatNumber(info.category_count)}
              </BodyText>
            </div>
          </div>
          <div className={styles.middle}>
            <div className={styles.middleKey}>
              <BodyText level={5}>Collections:</BodyText>
            </div>
            <div className={styles.middleValue}>
              <BodyText level={6} fontFamily="Roboto">
                {formatNumber(info.collection_count)}
              </BodyText>
            </div>
          </div>
          <div className={styles.middle}>
            <div className={styles.middleKey}>
              <BodyText level={5}>Cards:</BodyText>
            </div>
            <div className={styles.middleValue}>
              <BodyText level={6} fontFamily="Roboto">
                {formatNumber(info.card_count)}
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
          {info.newRequest ? (
            <UnreadIcon />
          ) : (
            <span style={isBrandUser ? { width: '18px', height: '18px' } : {}} />
          )}
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
          {info.newNotification ? (
            <UnreadIcon />
          ) : (
            <span style={isBrandUser ? { width: '18px', height: '18px' } : {}} />
          )}
        </div>
      </>
    );
  };

  const renderTeamNumber = (teams: BrandCardTeam[]) => {
    return teams.map((user: BrandCardTeam) => (
      <TeamIcon
        key={user.id}
        avatar={user.avatar}
        name={getFullName(user)}
        customClass={styles.avatar}
      />
    ));
  };

  const getAssignedTeamInfo = (info: any) => {
    const assignedTeam = getValueByCondition([
      [isTiscUser, info.teams],
      [isBrandUser, info.assignedTeams],
      [isDesignerUser, info.assign_teams],
    ]);

    const maxTeamNumber = isMobile ? 3 : 5;
    if (assignedTeam.length > maxTeamNumber) {
      return (
        <>
          {renderTeamNumber(assignedTeam.slice(0, maxTeamNumber))}

          <ProfileIcon
            name={`+${assignedTeam.slice(maxTeamNumber, assignedTeam.length).length}`}
            customClass={styles.backgroundIcon}
            isFullName
          />
        </>
      );
    }

    return renderTeamNumber(assignedTeam);
  };

  if (loading) {
    return null;
  }

  return (
    <div className={data.length ? styles.cardContainer : ''}>
      {data.length ? (
        data.map((item: any, index) => (
          <div
            key={item.id ?? index}
            className={styles.cardItemWrapper}
            onClick={() => handleClickItem(item)}
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
