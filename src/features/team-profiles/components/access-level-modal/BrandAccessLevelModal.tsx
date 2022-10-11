import { FC } from 'react';

import { ModalVisible } from '../../types';

import AccessLevelModal from './AccessLevelModal';

const BrandAccessLevelModal: FC<ModalVisible> = ({ visible, setVisible }) => {
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
