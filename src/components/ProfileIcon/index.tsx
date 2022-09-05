import { FC } from 'react';

import { getLetterAvatarBackgroundColor } from '@/helper/utils';

import style from './index.less';

interface ProfileUserProps {
  name: string;
  customClass?: string;
}

export const ProfileIcon: FC<ProfileUserProps> = ({ name, customClass }) => {
  const firstUserCharacter = name.charAt(0);
  const backgroundColor = getLetterAvatarBackgroundColor(name);

  return (
    <div
      style={{ backgroundColor: backgroundColor }}
      className={`${style.nameIcon} ${customClass}`}>
      <span className={style.textIcon}>{firstUserCharacter}</span>
    </div>
  );
};
