import { FC, useEffect, useState } from 'react';

import { isEqual, map } from 'lodash';

import { CheckboxValue } from '../CustomCheckbox/types';
import { MemberAssignedForm } from './type';
import { AssignedTeamMember } from '@/features/team-profiles/types';
import { useAppSelector } from '@/reducers';
import { modalPropsSelector } from '@/reducers/modal';

import { MemberHeaderLabel } from '@/components/RenderHeaderLabel';

import Popover from '../Modal/Popover';
import styles from './index.less';

export const getAssignTeamCheck = (
  assignTeam: AssignedTeamMember[],
  assignTeamState: { users: any[] }[],
  checkedData: CheckboxValue[],
) => {
  // new assign team
  const memberAssignTeam: AssignedTeamMember[] = [];

  checkedData.forEach((checked) => {
    assignTeamState.forEach((team) => {
      const member = team.users.find((user) => user.id === checked.value);

      if (member) {
        memberAssignTeam.push(member);
      }
    });
  });

  const checkedIds = checkedData.map((check) => check.value);
  const assignedTeamIds = assignTeam.map((team) => team.id);
  const noSelectionChange = isEqual(checkedIds, assignedTeamIds);

  return { noSelectionChange, memberAssignTeamIds: memberAssignTeam.map((member) => member.id) };
};

const AssignTeamModal: FC = () => {
  const { onChange, teams, memberAssigned } = useAppSelector(modalPropsSelector).assignTeam;

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
      visible
      chosenValue={selected}
      setChosenValue={onChange}
      className={styles.teams}
      combinableCheckbox
      dropdownCheckboxTitle={(data) => data.name}
      dropdownCheckboxList={map(teams, (team) => ({
        name: team.name || team.country_name || '',
        options: team.users.map((member: MemberAssignedForm, index: number) => ({
          value: member.id,
          label: (
            <MemberHeaderLabel
              firstName={member.firstname || ''}
              lastName={member.lastname || ''}
              avatar={member.avatar}
              key={member.id ?? index}
            />
          ),
        })),
      }))}
    />
  );
};

export default AssignTeamModal;
