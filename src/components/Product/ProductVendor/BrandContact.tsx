import { useState } from 'react';
import type { FC } from 'react';
import { BodyText } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';
import { useCheckPermission } from '@/helper/hook';

interface IBrandContactBox {
  title: string;
}

const BrandContact: FC<IBrandContactBox> = ({ title }) => {
  const [visible, setVisible] = useState(false);

  const editable = useCheckPermission('TISC Admin');
  const handleShowPopup = () => {
    if (editable.role !== 'TISC Admin') {
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
          {editable.role === 'TISC Admin' ? (
            <DropdownIcon />
          ) : (
            <SingleRightIcon className="single-right-icon" />
          )}
        </div>
      </div>
      <Popover title="SELECT LOCATION" visible={visible} setVisible={setVisible} />
    </div>
  );
};
export default BrandContact;
