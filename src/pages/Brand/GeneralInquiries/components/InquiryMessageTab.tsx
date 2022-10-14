import { FC } from 'react';

import { InquiryMessageOfGeneralInquiry } from '../types';

import { ActionTaskTable } from '@/components/ActionTask/table';
import BrandProductBasicHeader from '@/components/BrandProductBasicHeader';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import TextForm from '@/components/Form/TextForm';

import styles from '../detail.less';

export const InquiryMessageTab: FC<
  InquiryMessageOfGeneralInquiry & {
    modelId: string;
  }
> = ({
  title,
  inquiry_for,
  message,
  product_collection,
  product_description,
  product_image,
  official_website,
  modelId,
}) => {
  return (
    <div>
      <BrandProductBasicHeader
        image={product_image}
        text_1={product_collection}
        text_2={product_description}
        text_3={official_website}
        customClass={styles.brandProduct}
      />

      <TextForm boxShadow label="Inquiry For">
        {inquiry_for || ''}
      </TextForm>

      <TextForm boxShadow label="Title">
        {title || ''}
      </TextForm>

      <FormGroup
        label="Message"
        layout="vertical"
        labelColor="mono-color-dark"
        formClass={styles.messageForm}>
        <CustomTextArea value={message || ''} borderBottomColor="mono-medium" disabled />
      </FormGroup>

      <ActionTaskTable model_id={modelId} model_name="inquiry" />
    </div>
  );
};
