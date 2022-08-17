import { useAssignProductToSpaceForm } from '@/features/product/modals/hooks';
import type { FC } from 'react';
import { OnChangeSpecifyingProductFnc } from './types';
import styles from './styles/allocationTab.less';

interface AllocationTabProps {
  projectId: string;
  productId: string;
  onChangeSpecifyingState: OnChangeSpecifyingProductFnc;
}

const AllocationTab: FC<AllocationTabProps> = ({
  projectId,
  productId,
  onChangeSpecifyingState,
}) => {
  const { AssignProductToSpaceForm } = useAssignProductToSpaceForm(
    productId,
    projectId,
    (isEntire) => onChangeSpecifyingState({ is_entire: isEntire }),
    (selectedRooms) => onChangeSpecifyingState({ project_zone_ids: selectedRooms }),
  );

  return (
    <div className={styles.allocationTab}>
      <AssignProductToSpaceForm specifyingModal noPaddingLeft />
    </div>
  );
};

export default AllocationTab;
