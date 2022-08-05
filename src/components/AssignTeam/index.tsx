import { map } from 'lodash';
import { FC } from 'react';
import { CheckboxValue } from '../CustomCheckbox/types';
import Popover from '../Modal/Popover';
import { RenderMemberHeader } from '@/components/RenderHeaderLabel';
import { AssignTeamForm } from '@/types';

interface AssignTeamProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  selected?: CheckboxValue[];
  setSelected?: (selected: CheckboxValue[]) => void;
  teams: AssignTeamForm[];
  handleSubmit: () => void;
}

const AssignTeam: FC<AssignTeamProps> = ({
  visible,
  setVisible,
  selected,
  setSelected,
  teams,
  handleSubmit,
}) => {
  return (
    <Popover
      title="ASSIGN TEAM"
      visible={visible}
      setVisible={setVisible}
      chosenValue={selected}
      setChosenValue={setSelected}
      onFormSubmit={handleSubmit}
      dropdownCheckboxTitle={(data) => data.name}
      dropdownCheckboxList={map(teams, (team) => {
        return {
          name: team.name,
          options: team.users.map((member, index) => {
            return {
              label: (
                <RenderMemberHeader
                  firstName={member.full_name}
                  avatar={member.avatar}
                  key={member.id ?? index}
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
