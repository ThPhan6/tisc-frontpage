import { FC } from 'react';

import { ReactComponent as AvailableIcon } from '@/assets/icons/availability-available.svg';
import { ReactComponent as DiscontinuedIcon } from '@/assets/icons/availability-discontinued.svg';
import { ReactComponent as DiscrepancyIcon } from '@/assets/icons/availability-discrepancy.svg';
import { ReactComponent as OutOfStockIcon } from '@/assets/icons/availability-out-of-stock.svg';

import Popover from '@/components/Modal/Popover';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import styles from './AvailabilityModal.less';

interface AvailabilityModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const AvailabilityModal: FC<AvailabilityModalProps> = ({ visible, setVisible }) => {
  return (
    <Popover
      title="LEGEND"
      visible={visible}
      setVisible={setVisible}
      className={styles.modal}
      noFooter>
      <div>
        <RobotoBodyText level={5} customClass={styles.fontBold}>
          AVAILABILITY
        </RobotoBodyText>

        <div className={styles.leftSpace}>
          <RobotoBodyText level={6}>
            Availability is a system-generated indicator that evaluates the selected product supply
            source concerning project location. The function highlights any potential product
            availability discrepancy. We recommend contacting the brand company for more information
            and making selection adjustments accordingly.
          </RobotoBodyText>

          <div className={styles.mainContent}>
            <div className={styles.info}>
              <AvailableIcon />
              <div className={styles.paddingLeft}>
                <MainTitle level={4}> Available</MainTitle>
                <RobotoBodyText level={6}>
                  The selected product seems to be available at project location.
                </RobotoBodyText>
              </div>
            </div>

            <div className={styles.info}>
              <DiscontinuedIcon />
              <div className={styles.paddingLeft}>
                <MainTitle level={4}> Discontinued</MainTitle>
                <RobotoBodyText level={6}>
                  The brand company has informed us that the selected product will be discontinued
                  soon or might already be discontinued. Please check with the nearest vendor for
                  stock information.
                </RobotoBodyText>
              </div>
            </div>

            <div className={styles.info}>
              <DiscrepancyIcon />
              <div className={styles.paddingLeft}>
                <MainTitle level={4}> Location Discrepancy </MainTitle>
                <RobotoBodyText level={6}>
                  The selected product seems to have no local distributor ready to serve the project
                  location. It could be: a) the product is not designed for the regional market, or
                  b) the brand company has no distribution network. Please check with the brand
                  company for more information.
                </RobotoBodyText>
              </div>
            </div>

            <div className={styles.info}>
              <OutOfStockIcon />
              <div className={styles.paddingLeft}>
                <MainTitle level={4}> Out of Stock </MainTitle>
                <RobotoBodyText level={6}>
                  The selected product seems not in stock at the project location region. Please
                  check with your brand company or vendor for the nearest stock information.
                </RobotoBodyText>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popover>
  );
};
