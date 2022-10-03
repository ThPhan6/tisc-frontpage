import React, { useEffect, useState } from 'react';

import { getBrandCards } from '@/features/user-group/services';
import { getFullName } from '@/helper/utils';

import { BrandCard, BrandCardTeam } from '@/features/user-group/types';

import LoadingPage from '@/components/LoadingPage';
import TeamIcon from '@/components/TeamIcon/TeamIcon';
import { BodyText } from '@/components/Typography';

import styles from './index.less';

const MyWorkspace: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BrandCard[]>([]);

  useEffect(() => {
    setLoading(true);
    getBrandCards().then((res) => {
      if (res) {
        setData(res);
      }
      setLoading(false);
    });
  }, []);

  return loading ? (
    <LoadingPage />
  ) : (
    <div className={styles.productCardContainer}>
      {data.map((brand: BrandCard) => (
        <div key={brand.id} className={styles.productCardItemWrapper}>
          <div className={styles.productCardItem}>
            <div className={styles.top}>
              <div className={styles.brandName}>
                <BodyText level={6} customClass={styles.bold} fontFamily="Roboto">
                  {brand.name}
                </BodyText>
              </div>
              <img src={STORE_URL + brand.logo} className={styles.img} />
              <BodyText level={6} fontFamily="Roboto">
                {brand.country}
              </BodyText>
            </div>
            <div className={styles.middle}>
              <div className={styles.middleKey}>
                <BodyText level={5}>Categories:</BodyText>
              </div>
              <div className={styles.middleValue}>
                <BodyText level={6} fontFamily="Roboto">
                  {brand.category_count}
                </BodyText>
              </div>
            </div>
            <div className={styles.middle}>
              <div className={styles.middleKey}>
                <BodyText level={5}>Collections:</BodyText>
              </div>
              <div className={styles.middleValue}>
                <BodyText level={6} fontFamily="Roboto">
                  {brand.collection_count}
                </BodyText>
              </div>
            </div>
            <div className={styles.middle}>
              <div className={styles.middleKey}>
                <BodyText level={5}>Cards:</BodyText>
              </div>
              <div className={styles.middleValue}>
                <BodyText level={6} fontFamily="Roboto">
                  {brand.card_count}
                </BodyText>
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.profile_icon}>
                <BodyText level={5} customClass={styles.team}>
                  Teams:
                </BodyText>
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
  );
};

export default MyWorkspace;
