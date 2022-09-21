import { FC } from 'react';

import { ReactComponent as AccessableTickIcon } from '@/assets/icons/accessable-tick-icon.svg';
// for future data
import { ReactComponent as FeebBackIcon } from '@/assets/icons/feedback.svg';
import { ReactComponent as ShareViaEmailIcon } from '@/assets/icons/ic-share.svg';
import { ReactComponent as RecommendationIcon } from '@/assets/icons/recommendation.svg';

import { BodyText } from '@/components/Typography';

import AccessLevelModal from './AccessLevelModal';
import styles from './AccessLevelModal.less';

const furturePermissionData = [
  {
    logo: <FeebBackIcon className={styles.menu_item__logo} />,
    name: 'Feedback(future)',
  },
  {
    logo: <RecommendationIcon className={styles.menu_item__logo} />,
    name: 'Recommendation(future)',
  },
  {
    logo: <ShareViaEmailIcon className={styles.menu_item__logo} />,
    name: 'Share via Email(future)',
  },
];

interface TISCAccessLevelModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const TISCAccessLevelModal: FC<TISCAccessLevelModalProps> = ({ visible, setVisible }) => {
  return (
    <AccessLevelModal
      visible={visible}
      setVisible={setVisible}
      headerTitle="TISC ACCESS LEVEL"
      showMyDashboard
      titleColumnData={[
        { title: 'TISC Admin' },
        { title: ' TISC Team', unuse: true },
        { title: 'Consultant Team' },
      ]}>
      {/* future data, can delete */}
      {furturePermissionData.map((fData, index) => (
        <tr key={`futureData_${index}`}>
          <td className={`${styles.furture_data_name} ${styles.menu_item}`}>
            {fData.logo}
            <BodyText fontFamily="Roboto" level={6}>
              {fData.name}
            </BodyText>
          </td>
          {[1, 2, 3].map((_, i) => (
            <td key={`${index}_${i}`} style={{ textAlign: 'center' }}>
              <AccessableTickIcon className={styles.menu_accessable_null} />
            </td>
          ))}
        </tr>
      ))}
    </AccessLevelModal>
  );
};

export default TISCAccessLevelModal;
