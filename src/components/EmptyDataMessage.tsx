import { FC } from 'react';

import { RobotoBodyText } from './Typography';

export const EmptyDataMessage: FC<{ message: string }> = ({ message }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <RobotoBodyText level={5} color="mono-color-dark">
        {message}
      </RobotoBodyText>
    </div>
  );
};
