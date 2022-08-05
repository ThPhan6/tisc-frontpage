import { map } from 'lodash';
import { FC } from 'react';
import { CheckboxValue } from '../CustomCheckbox/types';
import Popover from '../Modal/Popover';
import { RenderMemberHeader } from '@/components/RenderHeaderLabel';

interface AssignTeamProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  selected?: CheckboxValue[];
  setSelected?: (selected: CheckboxValue[]) => void;
  teams: any[];
}

const AssignTeam: FC<AssignTeamProps> = ({ visible, setVisible, selected, setSelected, teams }) => {
  return (
    <Popover
      title="ASSIGN TEAM"
      visible={visible}
      setVisible={setVisible}
      chosenValue={selected}
      setChosenValue={setSelected}
      dropdownCheckboxTitle={(data) => data.name}
      dropdownCheckboxList={map(teams, (team) => {
        return {
          name: team.name,
          options: team.subs.map((member) => {
            return {
              label: (
                <RenderMemberHeader
                  firstName={member.firstname}
                  lastName={member.lastname}
                  avatar={member.avatar}
                />
              ),
              value: member.id,
            };
          }),
        };
      })}
    />
  );
};

export default AssignTeam;
