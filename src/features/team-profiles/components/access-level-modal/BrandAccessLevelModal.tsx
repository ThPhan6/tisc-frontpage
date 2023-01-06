import { FC } from 'react';

import { USER_ROLE } from '@/constants/userRoles';

import { ModalVisible } from '../../types';

import AccessLevelModal from './AccessLevelModal';

const BrandAccessLevelModal: FC<ModalVisible> = ({ visible, setVisible }) => {
  return (
    <AccessLevelModal
      visible={visible}
      setVisible={setVisible}
      headerTitle="BRAND ACCESS LEVEL"
      titleColumnData={[{ title: 'Brand Admin' }, { title: 'Brand Team' }]}
      userRole={USER_ROLE.brand}
    />
  );
};

export default BrandAccessLevelModal;
