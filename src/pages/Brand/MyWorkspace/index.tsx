import { useEffect, useState } from 'react';

import { PATH } from '@/constants/path';
import { GlobalFilter } from '@/pages/Designer/Project/constants/filter';
import { PageContainer } from '@ant-design/pro-layout';

import { ReactComponent as UnreadIcon } from '@/assets/icons/action-unreaded-icon.svg';

import { getBrandSummary } from '@/features/user-group/services';
import { pushTo } from '@/helper/history';
import { getFullName } from '@/helper/utils';

import { DataMenuSummaryProps } from '@/components/MenuSummary/types';
import { BrandCardTeam } from '@/features/user-group/types';

import { MenuSummary } from '@/components/MenuSummary';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { BodyText } from '@/components/Typography';
import ProjectFilter from '@/pages/Designer/Project/components/ProjectListHeader/ProjectFilter';

import styles from './index.less';

const MyWorkspace = () => {
  const [summaryData, setSummaryData] = useState<DataMenuSummaryProps[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(GlobalFilter);
  useEffect(() => {
    getBrandSummary().then((data) => {
      if (data) {
        setSummaryData(data);
      }
    });
  }, []);
  //   const [data, setData] = useState<>
  const data = [
    {
      id: '1',
      name: 'test',
      country: 'Da Nang',
      request: '3',
      notifi: '3',
      unread: true,
      teams: [
        {
          id: 'f805b4e0-9b55-41a0-8cea-d43b02e14bc1',
          firstname: 'Tisc',
          lastname: 'consultant',
          avatar: null,
        },
        {
          id: '3089fad1-943e-420c-bd4d-aa945a7e3631',
          firstname: 'Loc',
          lastname: 'Nguyen',
          avatar: null,
        },
        {
          id: '19419580-4a0c-41a0-9b23-fe2ff63c8973',
          firstname: 'Loc',
          lastname: 'Nguyen',
          avatar: null,
        },
      ],
    },
  ];
  const handleClickItem = (id: string) => {
    pushTo(PATH.brandViewDetailDashboard.replace(':id', id));
  };
  return (
    <div>
      <PageContainer
        pageHeaderRender={() => {
          return (
            <div className={styles.customHeader}>
              <MenuSummary typeMenu={'brand'} menuSummaryData={summaryData} />
              <ProjectFilter
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
              />
            </div>
          );
        }}>
        <div className={styles.productCardContainer}>
          {data.map((brand) => (
            <div
              key={brand.id}
              className={styles.productCardItemWrapper}
              onClick={() => handleClickItem(brand.id)}>
              <div className={styles.productCardItem}>
                <div className={styles.top}>
                  <div className={styles.brandName}>
                    <BodyText level={6} customClass={styles.bold} fontFamily="Roboto">
                      {brand.name}
                    </BodyText>
                  </div>
                  <BodyText level={6} fontFamily="Roboto">
                    {brand.country}
                  </BodyText>
                </div>
                <div className={styles.middle}>
                  <div className={styles.middleKey}>
                    <BodyText level={5}>Requests:</BodyText>
                  </div>
                  <div className={styles.middleValue}>
                    <BodyText level={6} fontFamily="Roboto">
                      {brand.request}
                    </BodyText>
                  </div>
                  {brand.unread ? <UnreadIcon /> : ''}
                </div>
                <div className={styles.middle}>
                  <div className={styles.middleKey}>
                    <BodyText level={5}>Notifications:</BodyText>
                  </div>
                  <div className={styles.middleValue}>
                    <BodyText level={6} fontFamily="Roboto">
                      {brand.notifi}
                    </BodyText>
                  </div>
                  {brand.unread ? <UnreadIcon /> : ''}
                </div>

                <div className={styles.profile_icon}>
                  <BodyText level={5}>Teams:</BodyText>
                  <div className={styles.team}>
                    {brand.teams.map((user: BrandCardTeam) => (
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
      </PageContainer>
    </div>
  );
};
export default MyWorkspace;
