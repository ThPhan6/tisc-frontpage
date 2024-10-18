import { Fragment, ReactNode, useState } from 'react';

import { Modal, ModalProps, Radio, RadioChangeEvent } from 'antd';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import styles from '@/components/Modal/styles/UnitType.less';
import { BodyText } from '@/components/Typography';

interface UnitItem {
  id: string;
  unit: string;
  label: string;
}

interface UnitCategory {
  category: string;
  items: UnitItem[];
}

interface UnitTypeProps extends ModalProps {
  title: ReactNode;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  unitData: UnitCategory[];
}

const UnitType = ({ title, visible, onCancel, onConfirm, unitData }: UnitTypeProps) => {
  const [selectedValue, setSelectedvalue] = useState<string | null>(null);

  const handleRadioChange = (event: RadioChangeEvent) =>
    selectedValue === event.target.value
      ? setSelectedvalue(null)
      : setSelectedvalue(event.target.value);

  return (
    <Modal
      className={styles.unit_type}
      open={visible}
      onCancel={onCancel}
      closable={false}
      title={
        <BodyText customClass={styles.unit_type_title} level={3}>
          {title}
        </BodyText>
      }
      footer={<CustomSaveButton contentButton="Done" onClick={onConfirm} />}
    >
      {unitData.map((el) => (
        <Fragment key={el.category}>
          <h4 className={styles.unit_type_heading}>{el.category}</h4>
          {el.items.map((item) => (
            <div key={item.id} className={styles.unit_type_wrapper}>
              <BodyText customClass={styles.unit_type_wrapper_unit} fontFamily="Roboto" level={6}>
                {item.unit}
              </BodyText>
              <BodyText customClass={styles.unit_type_wrapper_label} fontFamily="Roboto" level={6}>
                {item.label}
              </BodyText>
              <Radio
                value={item.id}
                className="mr-16"
                checked={selectedValue === item.id}
                onChange={handleRadioChange}
              />
            </div>
          ))}
        </Fragment>
      ))}
    </Modal>
  );
};

export default UnitType;
