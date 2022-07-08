import Popover from '@/components/Modal/Popover';
import { BodyText, MainTitle } from '@/components/Typography';
import { FC } from 'react';
import styles from '../styles/DistributionTerritoryModal.less';

export const DistributionTerritoryModal: FC<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}> = ({ visible, setVisible }) => {
  return (
    <Popover
      title="DISTRIBUTION TERRITORY"
      visible={visible}
      setVisible={setVisible}
      noFooter
      extraTopAction={
        <div className={styles.content}>
          <div className={styles.text}>
            <MainTitle level={4} customClass={styles.customTitle}>
              Authorized Country
            </MainTitle>
            <BodyText level={6}>
              The <span className={styles.customText}>Authorized Country</span> highlights the
              distribution rights under the contract between the brand company and its distributors.
            </BodyText>
          </div>
          <div className={styles.text}>
            <MainTitle level={4} customClass={styles.customTitle}>
              Coverage Beyond
            </MainTitle>
            <BodyText level={6}>
              The brand company could extend the unauthorised country territory rights by selecting
              the <span className={styles.customText}>Allow</span> or{' '}
              <span className={styles.customText}>Not Allow</span> button. This change might impact
              product search and display options.
            </BodyText>
          </div>
        </div>
      }
    />
  );
};
