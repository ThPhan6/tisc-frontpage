import { CSSProperties, FC } from 'react';

import { showImageUrl } from '@/helper/utils';

interface LogoIconProps {
  logo: string;
  className?: string;
  size?: number | string;
  style?: CSSProperties;
}

export const LogoIcon: FC<LogoIconProps> = ({ logo, className, style, size = 48 }) => (
  <img
    src={showImageUrl(logo)}
    onError={(e) => (e.currentTarget.src = `/favicon.ico`)}
    className={className}
    style={{ ...style, width: size, height: size, objectFit: 'cover' }}
  />
);
