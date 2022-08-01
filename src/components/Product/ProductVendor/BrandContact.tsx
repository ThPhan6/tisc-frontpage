import { useState } from 'react';
import type { FC } from 'react';
import { BodyText } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';
import { useCheckPermission } from '@/helper/hook';

interface BrandContactBoxProps {
  title: string;
}

const BrandContact: FC<BrandContactBoxProps> = ({ title }) => {
  const [visible, setVisible] = useState(false);

  const showPopUp = useCheckPermission('Brand Admin');
  const handleShowPopup = () => {
    if (showPopUp) {
      setVisible(true);
    }
  };

  return (
    <div className="contact-item-wrapper">
      <div className="contact-item">
        <BodyText level={4} customClass="contact-item-title">
          {title}
        </BodyText>
        <div className="contact-select-box" onClick={handleShowPopup}>
          <BodyText level={6} fontFamily="Roboto">
            select
          </BodyText>
          {showPopUp ? <SingleRightIcon className="single-right-icon" /> : <DropdownIcon />}
        </div>
      </div>
      <Popover title="SELECT LOCATION" visible={visible} setVisible={setVisible} />
    </div>
  );
};
export default BrandContact;
