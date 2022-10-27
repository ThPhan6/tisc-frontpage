import { FC } from 'react';

import { showImageUrl } from '@/helper/utils';

interface LogoIconProps {
  logo: string;
  className?: string;
}

export const LogoIcon: FC<LogoIconProps> = ({ logo, className }) => {
  return (
    <img
      src={showImageUrl(logo)}
      onError={(e) => (e.currentTarget.src = `/favicon.ico`)}
      className={className}
    />
  );
};
