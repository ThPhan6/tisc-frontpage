import { FC } from 'react';

import { getLetterAvatarBackgroundColor } from '@/helper/utils';

import style from './index.less';

interface ProfileUserProps {
  name: string;
  customClass?: string;
  size?: number;
  isFullName?: boolean;
}

export const ProfileIcon: FC<ProfileUserProps> = ({ name, customClass, size = 20, isFullName }) => {
  const firstUserCharacter = name.charAt(0);
  const backgroundColor = getLetterAvatarBackgroundColor(name);

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        width: `${size}px`,
        height: `${size}px`,
      }}
      className={`${style.nameIcon} ${customClass}`}
    >
      {isFullName ? name : firstUserCharacter}
    </div>
  );
};
