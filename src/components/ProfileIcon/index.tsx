import { FC } from 'react';
import style from './index.less';

interface IProfileUserProp {
  name: string;
}

export const ProfileIcon: FC<IProfileUserProp> = ({ name }) => {
  const firstUserCharacter = name.charAt(0);

  let indexString = '';

  for (let i = 0; i < name.length; i++) {
    indexString += name[i].charCodeAt(0);
  }

  const number = Number(indexString) * 9999;

  const backgroundColor = '#' + number.toString().replace(/\D/g, '').substring(0, 6);

  return (
    <div style={{ backgroundColor: backgroundColor }} className={style.nameIcon}>
      {firstUserCharacter}
    </div>
  );
};
