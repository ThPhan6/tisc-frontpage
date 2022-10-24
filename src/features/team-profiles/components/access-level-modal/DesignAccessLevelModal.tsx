import { FC } from 'react';

import { ModalVisible } from '../../types';

import AccessLevelModal from './AccessLevelModal';

const DesignAccessLevelModal: FC<ModalVisible> = ({ visible, setVisible }) => {
  return (
    <AccessLevelModal
      visible={visible}
      setVisible={setVisible}
      headerTitle="DESIGN ACCESS LEVEL"
      titleColumnData={[
        { title: 'Design Admin' },
        { title: ' Design Lead', unuse: true },
        { title: 'Design Team' },
      ]}
    />
  );
};

export default DesignAccessLevelModal;
