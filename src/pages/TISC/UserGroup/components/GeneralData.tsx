import { EmptyOne } from '@/components/Empty';
import { FC } from 'react';

const GeneralData: FC = ({ children }) => {
  return <div>{children ? children : <EmptyOne isCenter />}</div>;
};

export default GeneralData;
