import { FC } from 'react';

import { USER_ROLE } from '@/constants/userRoles';

import { ModalVisible } from '../../types';

import AccessLevelModal from './AccessLevelModal';

const DesignAccessLevelModal: FC<ModalVisible> = ({ visible, setVisible }) => {
  return (
    <AccessLevelModal
      visible={visible}
      setVisible={setVisible}
      headerTitle="DESIGN ACCESS LEVEL"
      titleColumnData={[{ title: 'Design Admin' }, { title: 'Design Team' }]}
      userRole={USER_ROLE.design}
    />
  );
};
export default DesignAccessLevelModal;
