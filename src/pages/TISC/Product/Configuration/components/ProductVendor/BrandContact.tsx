import { useState } from 'react';
import type { FC } from 'react';
import { BodyText } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import { ReactComponent as DropdownIcon } from '@/assets/icons/drop-down-icon.svg';

interface IBrandContactBox {
  title: string;
}

const BrandContact: FC<IBrandContactBox> = ({ title }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="contact-item-wrapper">
      <div className="contact-item">
        <BodyText level={4} customClass="contact-item-title">
          {title}
        </BodyText>
        <div className="contact-select-box" onClick={() => setVisible(true)}>
          <BodyText level={6} fontFamily="Roboto">
            select
          </BodyText>
          <DropdownIcon />
        </div>
      </div>
      <Popover title="SELECT LOCATION" visible={visible} setVisible={setVisible} />
    </div>
  );
};
export default BrandContact;
