import { ReactNode, useEffect, useState } from 'react';

import { Modal, ModalProps, Radio } from 'antd';

import store, { useAppSelector } from '@/reducers';
import { setCurrencySelected } from '@/reducers/summary';

import { CustomSaveButton } from '@/components/Button/CustomSaveButton';
import styles from '@/components/Modal/styles/Currentcy.less';
import { BodyText, RobotoBodyText } from '@/components/Typography';

export interface Currency {
  code: string;
  name: string;
}

interface CurrencyProps extends ModalProps {
  headerContent?: ReactNode;
  title: ReactNode;
  open: boolean;
  onSave?: (value: string) => void;
}

const CurrencyModal = ({
  headerContent = 'Beware that changing this currency will impact ALL of your price settings for the existing product cards and partner price rates. Proceed with caution.',
  title,
  onCancel,
  open,
  onSave,
  ...rest
}: CurrencyProps) => {
  const [isShowModal, setIsShowModal] = useState(open);
  const { summaryFinancialRecords: data } = useAppSelector((state) => state.summary);
  const [selectedValue, setSelectedValue] = useState<string>('');

  useEffect(() => {
    setIsShowModal(open);
  }, [open]);

  useEffect(() => {
    if (data && data.currencies.length > 0) {
      setSelectedValue(data.exchange_history.to_currency || '');
      store.dispatch(setCurrencySelected(data.exchange_history.to_currency));
    }
  }, [data]);

  const handleRadioChange = (code: string) => () => setSelectedValue(code);

  const handleSave = () => {
    store.dispatch(setCurrencySelected(selectedValue));
    onSave?.(selectedValue);
    setIsShowModal(false);
  };

  return (
    <Modal
      className={styles.currency}
      open={isShowModal}
      onCancel={onCancel}
      title={
        <BodyText level={3} customClass={styles.currency_title}>
          {title}
        </BodyText>
      }
      footer={<CustomSaveButton contentButton="Done" onClick={handleSave} />}
      {...rest}
    >
      <>
        <div className={styles.currency_annouce_wrapper}>
          <RobotoBodyText level={5} customClass={styles.currency_annouce}>
            {headerContent}
          </RobotoBodyText>
        </div>
        <div className={styles.currency_content_wrapper}>
          {data.currencies.map((item) => {
            return (
              <div
                key={item.code}
                className={styles.currency_items}
                onClick={handleRadioChange(item.code)}
              >
                <BodyText
                  style={{ color: selectedValue === item.code ? '#2B39D4' : '#000' }}
                  fontFamily="Roboto"
                  level={5}
                  customClass={styles.currency_items_stand_for}
                >
                  {item.code}
                </BodyText>
                <BodyText
                  style={{ color: selectedValue === item.code ? '#2B39D4' : '#000' }}
                  fontFamily="Roboto"
                  level={5}
                  customClass={`flex-1 ${styles.currency_items_name}`}
                >
                  {item.name}
                </BodyText>
                <Radio value={item.code} className="mr-16" checked={selectedValue === item.code} />
              </div>
            );
          })}
        </div>
      </>
    </Modal>
  );
};

export default CurrencyModal;
