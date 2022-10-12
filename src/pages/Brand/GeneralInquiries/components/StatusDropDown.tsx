import { ReactComponent as DropDownIcon } from '@/assets/icons/drop-down-icon.svg';

import { HeaderDropdown } from '@/components/HeaderDropdown';
import { RobotoBodyText } from '@/components/Typography';

// enum TaskStatus {
//   complete = 'Completed',
//   toDoList = 'To-Do-List',
//   inProgress = 'In Progress',
//   cancelled = 'Cancelled',
// }

export const StatusDropDown = () => {
  return (
    <HeaderDropdown align={{ offset: [0, 7] }} placement="bottomRight" trigger={['click']}>
      <RobotoBodyText>Cancelled</RobotoBodyText>
      <DropDownIcon style={{ marginLeft: '8px' }} />
    </HeaderDropdown>
  );
};
