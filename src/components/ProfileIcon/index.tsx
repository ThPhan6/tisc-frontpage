import { getLetterAvatarBackgroundColor } from '@/helper/utils';
import { FC } from 'react';
import style from './index.less';

interface IProfileUserProp {
  name: string;
}

export const ProfileIcon: FC<IProfileUserProp> = ({ name }) => {
  const firstUserCharacter = name.charAt(0);
  const backgroundColor = getLetterAvatarBackgroundColor(name);

  return (
    <div style={{ backgroundColor: backgroundColor }} className={style.nameIcon}>
      {firstUserCharacter}
    </div>
  );
};
