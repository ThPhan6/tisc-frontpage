import { FC } from 'react';

import { BodyText } from './Typography';

export const EmptyDataMessage: FC<{ message: string }> = ({ message }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <BodyText level={5}>{message}</BodyText>
    </div>
  );
};
