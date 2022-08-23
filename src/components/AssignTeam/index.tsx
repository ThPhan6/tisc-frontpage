import { FC } from 'react';

import { map } from 'lodash';

import { AssignTeamForm } from '@/types';

import { RenderMemberHeader } from '@/components/RenderHeaderLabel';

import Popover from '../Modal/Popover';
import styles from './index.less';

interface AssignTeamProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  selected: any;
  setSelected: (selected: any) => void;
  teams: AssignTeamForm[];
}

const AssignTeam: FC<AssignTeamProps> = ({ visible, setVisible, selected, setSelected, teams }) => {
  return (
    <Popover
      title="ASSIGN TEAM"
      visible={visible}
      setVisible={setVisible}
      chosenValue={selected}
      setChosenValue={setSelected}
      className={styles.teams}
      dropdownCheckboxTitle={(data) => data.name}
      dropdownCheckboxList={map(teams, (team) => {
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
    />
  );
};

export default AssignTeam;
