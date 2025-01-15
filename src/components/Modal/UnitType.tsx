import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react';

import { Modal, ModalProps, Radio } from 'antd';

import { sortBy } from 'lodash';

import { useAppSelector } from '@/reducers';
import { CommonUnitTypeGroup } from '@/types';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import styles from '@/components/Modal/styles/UnitType.less';
import { BodyText } from '@/components/Typography';

export interface UnitItem {
  id: string;
  name: string;
  code: string;
  group: CommonUnitTypeGroup;
}

interface UnitTypeProps extends ModalProps {
  defaultValue?: string;
  title: ReactNode;
  visible: boolean;
  onCancel: () => void;
  onSave: (selectedItem: UnitItem | undefined) => void;
}

// Unit type group to label mapping
const unitGroupLabels: Record<CommonUnitTypeGroup, string> = {
  [CommonUnitTypeGroup.INV_AREA]: 'Area',
  [CommonUnitTypeGroup.INV_LENGTH]: 'Length',
  [CommonUnitTypeGroup.INV_LINEAR_DISTANCE]: 'Linear Distance',
  [CommonUnitTypeGroup.INV_VOLUME]: 'Volume',
  [CommonUnitTypeGroup.INV_WEIGHT]: 'Weight',
  [CommonUnitTypeGroup.INV_COUNT]: 'Count',
};

const UnitType = ({ title, visible, onCancel, onSave, defaultValue }: UnitTypeProps) => {
  const [selectedValue, setSelectedValue] = useState<UnitItem | undefined>();
  const { unitType } = useAppSelector((state) => state.summary);

  useEffect(() => {
    if (unitType.length > 0) {
      setSelectedValue(unitType.find((item) => item.id === defaultValue));
    }
  }, [unitType, defaultValue]);

  const getUnitByType = (group: CommonUnitTypeGroup): string => unitGroupLabels[group] || 'Unknown';

  const groupedData = useMemo(() => {
    return unitType.reduce<Record<string, UnitItem[]>>((acc, item) => {
      const type = getUnitByType(item.group);
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(item);
      return acc;
    }, {});
  }, [unitType, getUnitByType]);

  const handleRadioChange = (item: UnitItem) => () => setSelectedValue(item);

  const handleSave = () => {
    onSave(selectedValue);
    onCancel();
  };

  return (
    <Modal
      className={styles.unit_type}
      visible={visible}
      onCancel={onCancel}
      closable={false}
      title={
        <BodyText customClass={styles.unit_type_title} level={3}>
          {title}
        </BodyText>
      }
      footer={<CustomSaveButton contentButton="Done" onClick={handleSave} />}
    >
      {sortBy(Object.keys(groupedData)).map((category) => (
        <Fragment key={category}>
          <h4 className={styles.unit_type_heading}>{category}</h4>
          {groupedData[category].map((item) => (
            <div
              key={item.id}
              className={styles.unit_type_wrapper}
              onClick={handleRadioChange(item)}
            >
              <BodyText
                style={{ color: selectedValue?.id === item.id ? '#2B39D4' : '#000' }}
                customClass={styles.unit_type_wrapper_unit}
                fontFamily="Roboto"
                level={6}
              >
                {item.code}
              </BodyText>
              <BodyText
                style={{ color: selectedValue?.id === item.id ? '#2B39D4' : '#000' }}
                customClass={styles.unit_type_wrapper_label}
                fontFamily="Roboto"
                level={6}
              >
                {item.name}
              </BodyText>
              <Radio value={item.id} className="mr-16" checked={selectedValue?.id === item.id} />
            </div>
          ))}
        </Fragment>
      ))}
    </Modal>
  );
};

export default UnitType;
