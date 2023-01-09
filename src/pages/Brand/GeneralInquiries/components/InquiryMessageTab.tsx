import { FC } from 'react';

import { InquiryMessageOfGeneralInquiry } from '../types';

import { ActionTaskTable } from '@/components/ActionTask/table';
import BrandProductBasicHeader from '@/components/BrandProductBasicHeader';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import TextForm from '@/components/Form/TextForm';

import styles from '../detail.less';

export const InquiryMessageTab: FC<{
  data: InquiryMessageOfGeneralInquiry;
  modelId: string;
}> = ({ data, modelId }) => {
  const { title, inquiry_for, message, designer, product } = data;

  return (
    <div style={{ height: 'calc(var(--vh) * 100 - 368px)' }}>
      <BrandProductBasicHeader
        image={product.image}
        text_1={product.collection}
        text_2={product.description}
        text_3={
          <a
            href={`${window.location.origin}/brand/product/${product.id}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#000' }}
          >
            {window.location.origin}/brand/product/{product.id}
          </a>
        }
        customClass={styles.brandProduct}
      />

      <TextForm boxShadow label="Inquirer">
        {designer.name}
      </TextForm>

      <TextForm boxShadow label="Position/Role">
        {designer.position}
      </TextForm>

      <TextForm boxShadow label="Work Email">
        {designer.email}
      </TextForm>

      <TextForm boxShadow label="Work Phone">
        +{designer.phone_code} {designer.phone}
      </TextForm>

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
        formClass={styles.messageForm}
      >
        <CustomTextArea value={message || ''} borderBottomColor="mono-medium" disabled />
      </FormGroup>

      <ActionTaskTable model_id={modelId} model_name="inquiry" />
    </div>
  );
};
