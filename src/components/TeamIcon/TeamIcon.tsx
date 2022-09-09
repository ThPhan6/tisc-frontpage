import React from 'react';

import { showImageUrl } from '@/helper/utils';

import { ProfileIcon } from '@/components/ProfileIcon';

interface TeamIconProps {
  avatar?: string;
  name?: string;
  customClass?: string;
  size?: number;
}

const TeamIcon: React.FC<TeamIconProps> = ({ avatar, name, customClass = '', size = 20 }) => {
  if (avatar) {
    return (
      <img
        src={showImageUrl(avatar)}
        alt="avatar"
        style={{
          height: `${size}px`,
          width: `${size}px`,
          borderRadius: '50%',
          boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
          border: '1px solid #fff',
          objectFit: 'cover',
        }}
        className={customClass}
      />
    );
  }
  if (name) {
    return <ProfileIcon name={name} customClass={customClass} size={size} />;
  }
  return null;
};
export default TeamIcon;
