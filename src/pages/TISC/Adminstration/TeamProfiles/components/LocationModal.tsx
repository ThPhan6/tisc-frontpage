import Popover from '@/components/Modal/Popover';
import { FC } from 'react';

interface ILocationModal {
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const LocationModal: FC<ILocationModal> = ({ visible, setVisible }) => {
  return (
    <Popover
      title="SELECT LOCATION"
      visible={visible}
      setVisible={(isVisible) => setVisible(isVisible)}
    />
  );
};

export default LocationModal;
