import { FC } from 'react';

import { showImageUrl } from '@/helper/utils';

interface ShowLogoProps {
  logo: string;
  className?: string;
}

export const ShowLogo: FC<ShowLogoProps> = ({ logo, className }) => {
  console.log(logo);
  return (
    <img
      src={showImageUrl(logo)}
      onError={(e) => (e.currentTarget.src = `/favicon.ico`)}
      className={className}
    />
  );
};
