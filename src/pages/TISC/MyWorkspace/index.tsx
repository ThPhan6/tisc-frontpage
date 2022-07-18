import React, { useEffect, useState } from 'react';
import styles from './styles/index.less';
import { BodyText } from '@/components/Typography';
import { ProfileIcon } from '@/components/ProfileIcon';
import { getBrandCards } from '@/services';
import LoadingPage from '@/components/LoadingPage';

const MyWorkspace: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    getBrandCards().then((res) => {
      setData(res);
    });
    setLoading(false);
  }, []);

  return loading ? (
    <LoadingPage />
  ) : (
    <div className={styles.productCardContainer}>
      {data.map((brand: any) => (
        <div className={styles.productCardItemWrapper}>
          <div className={styles.productCardItem}>
            {' '}
            <div className={styles.top}>
              <div className={styles.brandName}>
                <BodyText level={6} customClass={styles.bold} fontFamily="Roboto">
                  {brand.name}
                </BodyText>
              </div>
              <img src={STORE_URL + brand.logo} alt="brand logo" className={styles.img} />
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
                {brand.teams.map((user: any) => {
                  return <ProfileIcon name={user.firstname + ' ' + user.lastname} />;
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyWorkspace;
