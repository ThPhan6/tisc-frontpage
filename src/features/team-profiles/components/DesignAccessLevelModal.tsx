import { FC } from 'react';

import AccessLevelModal from './AccessLevelModal';

interface DesignAccessLevelModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const DesignAccessLevelModal: FC<DesignAccessLevelModalProps> = ({ visible, setVisible }) => {
  return (
    <AccessLevelModal
      visible={visible}
      setVisible={setVisible}
      headerTitle="DESIGN ACCESS LEVEL"
      titleColumnData={[
        { title: 'Design Admin' },
        { title: 'Design Lead', unuse: true },
        { title: 'Design Team' },
      ]}
    />
  );
};

export default DesignAccessLevelModal;
