import { FC } from 'react';

import AccessLevelModal from './AccessLevelModal';

interface BrandAccessLevelModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const BrandAccessLevelModal: FC<BrandAccessLevelModalProps> = ({ visible, setVisible }) => {
  return (
    <AccessLevelModal
      visible={visible}
      setVisible={setVisible}
      headerTitle="BRAND ACCESS LEVEL"
      titleColumnData={[
        { title: 'Brand Admin' },
        { title: ' Brand Lead', unuse: true },
        { title: 'Brand Team' },
      ]}
    />
  );
};

export default BrandAccessLevelModal;
