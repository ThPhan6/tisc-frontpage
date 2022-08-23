import type { FC } from 'react';

import { useAssignProductToSpaceForm } from '@/features/product/modals/hooks';

import { OnChangeSpecifyingProductFnc } from './types';

import styles from './styles/allocationTab.less';

interface AllocationTabProps {
  projectId: string;
  productId: string;
  roomId?: string;
  isEntire?: boolean;
  onChangeSpecifyingState: OnChangeSpecifyingProductFnc;
}

const AllocationTab: FC<AllocationTabProps> = ({
  projectId,
  productId,
  roomId,
  isEntire,
  onChangeSpecifyingState,
}) => {
  const { AssignProductToSpaceForm } = useAssignProductToSpaceForm(productId, projectId, {
    onChangeEntireProjectCallback: (is_entire) => onChangeSpecifyingState({ is_entire }),
    onChangeSelectedRoomsCallback: (selectedRooms) =>
      onChangeSpecifyingState({ project_zone_ids: selectedRooms }),
    roomId,
    isEntire,
  });

  return (
    <div className={styles.allocationTab}>
      <AssignProductToSpaceForm specifyingModal noPaddingLeft />
    </div>
  );
};

export default AllocationTab;
