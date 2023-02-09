import { FC } from 'react';

import Popover from '@/components/Modal/Popover';
import { BodyText, Title } from '@/components/Typography';

import styles from './InformationMarketAvailability.less';

const InformationMarketAvailability: FC<{}> = () => {
  return (
    <Popover
      title="MARKET AVAILABILITY"
      visible
      noFooter
      extraTopAction={
        <div className={styles.content}>
          <div className={styles.text}>
            <BodyText level={6} fontFamily="Roboto">
              The <span className={styles.customText}>Market Availability</span> feature allows the
              brand company to determine the collections or product lines available in defined
              regions and territories. The platform provides a friendly reminder to designers who
              might select the product for the incorrect project location.
            </BodyText>
            <BodyText level={6} fontFamily="Roboto" customClass={styles.textContent}>
              Below are three steps to accomplish the task.
            </BodyText>
          </div>

          <div className={styles.text}>
            <Title level={9} customClass={styles.title}>
              01 - Collections/Series Listing
            </Title>
            <BodyText level={6} fontFamily="Roboto">
              TISC will assist the brand company in converting the products into the database and
              creating <span className={styles.customText}>Collections/Series</span> for future
              configuration on market availability.
            </BodyText>
          </div>
          <div className={styles.text}>
            <Title level={9} customClass={styles.title}>
              02 - Distributors & Authorisation Countries
            </Title>
            <BodyText level={6} fontFamily="Roboto">
              Before the <span className={styles.customText}>Market Availability</span>{' '}
              configurations, the brand company should input and define the distributors and its
              country coverages.
            </BodyText>
          </div>
          <div className={styles.text}>
            <Title level={9} customClass={styles.title}>
              03 - Configurations
            </Title>
            <BodyText level={6} fontFamily="Roboto">
              The brand company could then assign each{' '}
              <span className={styles.customText}>Collections/Series</span> to the regions and
              countries defined by distribution country coverages.
            </BodyText>
          </div>
        </div>
      }
    />
  );
};

export default InformationMarketAvailability;
