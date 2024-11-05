import { ReactNode } from 'react';

import { CustomModal } from '@/components/Modal';
import styles from '@/components/Modal/styles/InfoModal.less';
import { BodyText, CormorantBodyText } from '@/components/Typography';

interface InfoModalProps {
  title: string;
  isOpen: boolean;
  onCancel: () => void;
  additionalContainerClasses?: string;
  additionalContentClass?: string;
  content: { id: number | string; heading?: ReactNode; description: ReactNode }[];
}

const InfoModal = ({
  isOpen,
  title,
  onCancel,
  additionalContainerClasses = '',
  additionalContentClass = '',
  content,
}: InfoModalProps) => {
  return (
    <CustomModal
      className={`${styles.info_modal} ${additionalContainerClasses}`}
      title={
        <>
          <CormorantBodyText customClass={`${styles.info_modal_title}`}>{title}</CormorantBodyText>
        </>
      }
      visible={isOpen}
      onCancel={onCancel}
      footer={null}
    >
      {content.map((item) => (
        <section key={item.id} className={`${styles.info_modal_content} ${additionalContentClass}`}>
          <CormorantBodyText customClass={`${styles.info_modal_content_heading}`}>
            {item.heading}
          </CormorantBodyText>
          <BodyText
            fontFamily="Roboto"
            level={6}
            customClass={`${styles.info_modal_content_description}`}
          >
            {item.description}
          </BodyText>
        </section>
      ))}
    </CustomModal>
  );
};

export default InfoModal;
