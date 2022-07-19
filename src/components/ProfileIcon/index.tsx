import { getLetterAvatarBackgroundColor } from '@/helper/utils';
import { FC } from 'react';
import style from './index.less';

interface ProfileUserProps {
  name: string;
}

export const ProfileIcon: FC<ProfileUserProps> = ({ name }) => {
  const firstUserCharacter = name.charAt(0);
  const backgroundColor = getLetterAvatarBackgroundColor(name);

  return (
    <div style={{ backgroundColor: backgroundColor }} className={style.nameIcon}>
      {firstUserCharacter}
    </div>
  );
};
