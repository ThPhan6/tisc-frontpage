import { FC, useEffect, useState } from 'react';

import { map } from 'lodash';

import { CheckboxValue } from '../CustomCheckbox/types';
import { MemberAssignedForm } from './type';

import { MemberHeaderLabel } from '@/components/RenderHeaderLabel';

import Popover from '../Modal/Popover';
import styles from './index.less';

interface AssignTeamProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onChange: (selected: any) => void;
  teams: any[];
  memberAssigned?: any[];
}

const AssignTeam: FC<AssignTeamProps> = ({
  visible,
  setVisible,
  onChange,
  teams,
  memberAssigned,
}) => {
  const [selected, setSelected] = useState<CheckboxValue[]>([]);

  useEffect(() => {
    setSelected(
      memberAssigned?.map((member: MemberAssignedForm) => ({
        label: '',
        value: member.id,
      })) as CheckboxValue[],
    );
  }, [memberAssigned]);

  return (
    <Popover
      title="ASSIGN TEAM"
      visible={visible}
      setVisible={setVisible}
      chosenValue={selected}
      setChosenValue={onChange}
      className={styles.teams}
      combinableCheckbox
      dropdownCheckboxTitle={(data) => data.name}
      dropdownCheckboxList={map(teams, (team) => {
        return {
          name: team.name || team.country_name || '',
          options: team.users.map((member: MemberAssignedForm, index: number) => {
            return {
              value: member.id,
              label: (
                <MemberHeaderLabel
                  firstName={member.first_name || ''}
                  lastName={member.last_name || ''}
                  avatar={member.avatar}
                  key={member.id ?? index}
                />
              ),
            };
          }),
        };
      })}
    />
  );
};

export default AssignTeam;
