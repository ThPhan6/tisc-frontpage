import { FC } from 'react';

import { BodyText } from '@/components/Typography';

const TooltipLabel: FC<{ statusText: string; plainText: string }> = ({ statusText, plainText }) => {
  return (
    <tr>
      <td>
        <BodyText level={4} style={{ marginRight: '4px' }}>{`${statusText}:`}</BodyText>
      </td>
      <td>
        <BodyText level={6} fontFamily="Roboto">
          {plainText}
        </BodyText>
      </td>
    </tr>
  );
};
export default TooltipLabel;
