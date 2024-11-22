import { FC } from 'react';

import { Col, Row } from 'antd';

import { showImageUrl } from '@/helper/utils';
import { ProductBasisFormType, useCheckBasicOptionForm } from '@/pages/TISC/Product/Basis/hook';
import { useCheckAttributeForm } from '@/pages/TISC/Product/BrandAttribute/hook';

import { AttributeSubForm, SubBasisOption } from '@/types';

import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';
import { AttributeItem } from '@/pages/TISC/Product/Attribute/components/AttributeItem';

import { ImageUpload } from './SubImage';
import styles from './SubItem.less';

interface SubItemOptionProps {
  is_have_image?: boolean;
  subItemOption: SubBasisOption;
  onChange: (subItemOption: SubBasisOption) => void;
  type?: ProductBasisFormType;
}

export const SubItemOption: FC<SubItemOptionProps> = ({ subItemOption, onChange, type }) => {
  const isBasicOption = useCheckBasicOptionForm();
  const { isAttribute } = useCheckAttributeForm();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...subItemOption,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeFileImage = (base64Image: string) => {
    onChange({
      ...subItemOption,
      image: base64Image,
      isBase64: true,
    });
  };

  if (isAttribute) {
    return (
      <AttributeItem
        item={subItemOption as unknown as AttributeSubForm}
        onChangeItemName={handleChangeInput}
      />
    );
  }

  if (isBasicOption) {
    return (
      <div className={styles.element}>
        <ImageUpload
          onFileChange={handleChangeFileImage}
          image={subItemOption.isBase64 ? subItemOption.image : showImageUrl(subItemOption.image)}
          style={{
            border: subItemOption.isBase64 ? 'unset' : '0.5px solid #e4e4e4',
            width: 64,
            height: 64,
          }}
        />

        <Row className={styles.form_sub__input} gutter={16}>
          {[1, 2].map((order) => (
            <Col className={styles.form_input} key={order} span={12}>
              <BodyText level={3}>S{order}:</BodyText>
              <CustomInput
                placeholder="value"
                name={`value_${order}`}
                size="small"
                autoWidth
                defaultWidth={
                  subItemOption[`value_${order}`] ? subItemOption[`value_${order}`].length * 8 : 40
                }
                containerClass={styles.form_input__formula}
                onChange={handleChangeInput}
                value={subItemOption[`value_${order}`]}
              />
              <CustomInput
                placeholder="unit"
                name={`unit_${order}`}
                size="small"
                autoWidth
                defaultWidth={
                  subItemOption[`unit_${order}`] ? subItemOption[`unit_${order}`].length * 8 : 30
                }
                containerClass={styles.form_input__unit}
                onChange={handleChangeInput}
                value={subItemOption[`unit_${order}`]}
              />
            </Col>
          ))}
          <Col span={12}>
            <div
              style={{
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <span className="product-id-label">Product ID:</span>
              <CustomInput
                placeholder="type here"
                className="product-id-input"
                name="product_id"
                onChange={handleChangeInput}
                value={subItemOption.product_id}
              />
            </div>
          </Col>
          <Col span={12} className="flex-start">
            <div
              style={{
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <span className="product-id-label">Paired:</span>

              <BodyText fontFamily="Roboto" level={5} style={{ paddingLeft: 12 }}>
                {subItemOption.paired}
              </BodyText>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className={styles.element}>
      <Row className={styles.form_sub__input} gutter={16}>
        {[1, 2].map((order) => (
          <Col className={styles.form_input} key={order} span={12}>
            <BodyText level={3}>P{order}:</BodyText>
            <CustomInput
              placeholder="value"
              name={`value_${order}`}
              size="small"
              autoWidth
              defaultWidth={40}
              containerClass={styles.form_input__formula}
              onChange={handleChangeInput}
              value={subItemOption[`value_${order}`]}
            />
            <CustomInput
              placeholder="unit"
              name={`unit_${order}`}
              size="small"
              autoWidth
              defaultWidth={30}
              containerClass={styles.form_input__unit}
              onChange={handleChangeInput}
              value={subItemOption[`unit_${order}`]}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};
