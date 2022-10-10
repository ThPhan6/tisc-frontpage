import { useState } from 'react';

import {
  createAssignTeamByBrandId,
  getListAssignTeamByBrandId,
} from '@/features/user-group/services';
import { getFullName } from '@/helper/utils';
import { isEqual, map } from 'lodash';

import { CheckboxValue } from '../CustomCheckbox/types';
import { AssignTeamForm, MemberAssignTeam } from '@/features/user-group/types';

import Popover from '../Modal/Popover';
import { RenderMemberHeader } from '../RenderHeaderLabel';
import styles from './index.less';

export const useAssignTeam = (tableRef: any) => {
  // get each assign team
  const [recordAssignTeam, setRecordAssignTeam] = useState<any>();

  const [visible, setVisible] = useState<boolean>(false);
  // get list assign team to display inside popup
  const [assignTeam, setAssignTeam] = useState<AssignTeamForm[]>([]);
  // seleted member
  const [selected, setSelected] = useState<CheckboxValue[]>([]);

  const showAssignTeams = (brandInfo: any) => async () => {
    // get list team
    await getListAssignTeamByBrandId(brandInfo.id).then((res) => {
      if (res) {
        /// set assignTeam state to display
        setAssignTeam(res);

        // show user selected
        setSelected(
          brandInfo.assign_team.map((member: any) => {
            return {
              label: '',
              value: member.id,
            };
          }),
        );
        /// get brand info
        setRecordAssignTeam(brandInfo);
      }
    });
    // open popup
    setVisible(true);
  };
  // update assign team
  const handleSubmitAssignTeam = (checkedData: CheckboxValue[]) => {
    // new assign team
    const memberAssignTeam: MemberAssignTeam[] = [];

    // for reset member selected
    let newAssignTeamSelected: CheckboxValue[] = [];

    checkedData.forEach((checked) => {
      assignTeam.forEach((team) => {
        const member = team.users.find((user) => user.id === checked.value);

        if (member) {
          memberAssignTeam.push(member);
        }
      });
    });

    if (recordAssignTeam?.id) {
      // dont call api if havent changed
      const checkedIds = checkedData.map((check) => check.value);
      const assignedTeamIds = recordAssignTeam.assign_team.map((team: any) => team.id);
      const noSelectionChange = isEqual(checkedIds, assignedTeamIds);
      if (noSelectionChange) return;

      // add member selected to data
      createAssignTeamByBrandId(
        recordAssignTeam.id,
        memberAssignTeam.map((member) => member.id),
      ).then((isSuccess) => {
        if (isSuccess) {
          // reload table after updating
          tableRef.current.reload();

          // set member selected for next display
          if (memberAssignTeam.length > 0) {
            newAssignTeamSelected = memberAssignTeam.map((member) => ({
              label: getFullName(member),
              value: member.id,
            }));
          }
          setSelected(newAssignTeamSelected);

          // close popup
          setVisible(false);
        }
      });
    }
  };
  const AssignTeam = () => (
    <Popover
      title="ASSIGN TEAM"
      visible={visible}
      setVisible={setVisible}
      chosenValue={selected}
      setChosenValue={handleSubmitAssignTeam}
      className={styles.teams}
      dropdownCheckboxTitle={(data) => data.name}
      dropdownCheckboxList={map(assignTeam, (team) => {
        return {
          name: team.name,
          options: team.users.map((member, index) => {
            return {
              label: (
                <RenderMemberHeader
                  firstName={member.first_name}
                  lastName={member.last_name}
                  avatar={member.avatar}
                  key={member.id ?? index}
                />
              ),
              value: member.id,
            };
          }),
        };
      })}
      combinableCheckbox
    />
  );
  return {
    AssignTeam,
    showAssignTeams,
  };
};
