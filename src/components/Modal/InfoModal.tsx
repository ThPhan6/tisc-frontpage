import { ReactNode } from 'react';

import { CustomModal } from '@/components/Modal';
import styles from '@/components/Modal/styles/InfoModal.less';
import { BodyText, CormorantBodyText } from '@/components/Typography';

interface InfoModalProps {
  isOpen: boolean;
  title: string;
  onCancel: () => void;
  content: { id: number | string; heading: string; description: ReactNode }[];
}

const InfoModal = ({ isOpen, title, onCancel, content }: InfoModalProps) => {
  return (
    <CustomModal
      className={styles.info_modal}
      title={<h2 className={`${styles.info_modal_title} my-0`}>{title}</h2>}
      visible={isOpen}
      onCancel={onCancel}
      footer={null}
    >
      {content.map((item) => (
        <section key={item.id} className={`${styles.info_modal_content}`}>
          <CormorantBodyText customClass={`${styles.info_modal_content_heading}`}>
            {item.heading}
          </CormorantBodyText>
          <BodyText level={4} customClass={`${styles.info_modal_content_description}`}>
            {item.description}
          </BodyText>
        </section>
      ))}
    </CustomModal>
  );
};

export default InfoModal;
