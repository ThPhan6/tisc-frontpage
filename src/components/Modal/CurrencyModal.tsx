import { ReactNode, useState } from 'react';

import { Modal, ModalProps, Radio, RadioChangeEvent } from 'antd';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import styles from '@/components/Modal/styles/Currentcy.less';
import { BodyText, RobotoBodyText } from '@/components/Typography';

interface Currency {
  id: string;
  acronym: string;
  standFor: string;
}

interface CurrencyProps extends ModalProps {
  annouceContent: ReactNode;
  isShowAnnouncement?: boolean;
  title: ReactNode;
  open: boolean;
  onCancel: () => void;
  onOk: () => void;
  data: Currency[];
}

const CurrencyModal = ({
  annouceContent,
  title,
  data,
  onCancel,
  onOk,
  open,
  isShowAnnouncement = false,
  ...rest
}: CurrencyProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const handleRadioChange = (event: RadioChangeEvent) =>
    selectedValue === event.target.value
      ? setSelectedValue(null)
      : setSelectedValue(event.target.value);

  return (
    <Modal
      className={styles.currency}
      open={open}
      onCancel={onCancel}
      title={
        <BodyText level={3} customClass={styles.currency_title}>
          {title}
        </BodyText>
      }
      footer={<CustomSaveButton contentButton="Done" onClick={onOk} />}
      {...rest}
    >
      <>
        {isShowAnnouncement ? (
          <div className={styles.currency_annouce_wrapper}>
            <RobotoBodyText level={5} customClass={styles.currency_annouce}>
              {annouceContent}
            </RobotoBodyText>
          </div>
        ) : null}
        {data.map((item) => (
          <div key={item.id} className={styles.currency_items}>
            <BodyText fontFamily="Roboto" level={5} customClass={styles.currency_items_stand_for}>
              {item.acronym}
            </BodyText>
            <BodyText fontFamily="Roboto" level={5} customClass="flex-1">
              {item.standFor}
            </BodyText>
            <Radio
              value={item.id}
              className="mr-16"
              checked={selectedValue === item.id}
              onChange={handleRadioChange}
            />
          </div>
        ))}
      </>
    </Modal>
  );
};

export default CurrencyModal;
