import { FC, useEffect, useState } from 'react';

import { Collapse, Row } from 'antd';

import { getLibraryByDesignFirm } from '../services';
import { getFullName, getValueByCondition, showImageUrl } from '@/helper/utils';
import { isNumber } from 'lodash';

import {
  ContactDetail,
  DimensionAndWeight,
  LibraryDesignFirm,
  OptionValue,
  RequiredValueProps,
} from '../types';
import { ConversionSubValueProps } from '@/types';

import { FormGroup } from '@/components/Form';
import { PhoneInput } from '@/components/Form/PhoneInput';
import TextForm from '@/components/Form/TextForm';
import { ResponsiveCol } from '@/components/Layout';
import { BodyText } from '@/components/Typography';

import indexStyles from '../styles/index.less';
import { CollapseLevel1Props, CollapseLevel2Props } from './ExpandIcon';
import styles from './LibraryDesign.less';
import { AttributeConversionText } from '@/features/dimension-weight/AttributeConversionText';

interface LabelHeaderProps {
  firstValue: string;
  quantity?: number | string;
  isSubHeader: boolean;
  secondValue?: string;
}

type LibraryType = 'brand' | 'distributor' | 'collection' | 'product';

interface LibraryItemProps {
  data?: LibraryDesignFirm;
  type: LibraryType;
}

interface DetailItemValue {
  title: string;
  quantity?: number;
  website?: string;
  country_name?: string;
  state_name?: string;
  city_name?: string;
  address?: string;
  phone_code?: string;
  postal_code?: string;
  contacts?: ContactDetail[];
  products?: {
    id: string;
    name: string;
    image: string;
  }[];
  brand_company?: string;
  description?: string;
  attributes?: {
    name: string;
    content: string;
  }[];
  specifications?: {
    name: string;
    content: string;
  }[];
  options?: OptionValue[];
  collection?: string;
  dimension_and_weight?: DimensionAndWeight;
}

interface DetailItemProps {
  detailItems: DetailItemValue[];
  type: LibraryType;
}

const LabelHeader: FC<LabelHeaderProps> = ({ firstValue, quantity, isSubHeader, secondValue }) => {
  return (
    <span
      className={isSubHeader ? styles.dropdownCount : ''}
      style={{
        color: '@mono-color',
        textTransform: 'capitalize',
        display: 'flex',
        alignItems: 'center',
      }}>
      {firstValue}
      {secondValue && <span className={styles.customText}>{secondValue}</span>}
      {isNumber(quantity) && !isNaN(quantity) ? (
        <span
          className={styles.quantity}
          style={{
            marginLeft: 8,
          }}>
          ({quantity ?? '0'})
        </span>
      ) : null}
    </span>
  );
};

interface LibraryTextProps {
  name?: string;
  content?: string;
  conversion?: ConversionSubValueProps;
  image?: string;
  customClass?: string;
}

const LibraryText: FC<LibraryTextProps> = ({ name, content, conversion, image, customClass }) => {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', height: '36px' }}
      className={customClass ? customClass : ''}>
      {image ? (
        <img
          src={showImageUrl(image)}
          style={{ width: '18px', height: '18px', marginRight: '12px' }}
        />
      ) : (
        <BodyText level={3} style={{ marginRight: '24px' }}>
          {name}
        </BodyText>
      )}
      {content ? (
        <BodyText level={5} fontFamily="Roboto">
          {content}
        </BodyText>
      ) : (
        <>
          <BodyText level={5} fontFamily="Roboto" style={{ marginRight: '16px' }}>
            {conversion?.formula_1} {conversion?.unit_1}
          </BodyText>
          <BodyText level={5} fontFamily="Roboto">
            {conversion?.formula_2} {conversion?.unit_2}
          </BodyText>
        </>
      )}
    </div>
  );
};

const DetailItem: FC<DetailItemProps> = ({ detailItems, type }) => {
  const renderContentItem = (item: DetailItemValue) => {
    if (type === 'collection') {
      return (
        <>
          {item.products?.map((product, index) => (
            <LibraryText image={product.image} content={product.name} key={index} />
          ))}
        </>
      );
    }

    if (type === 'product') {
      return (
        <>
          <TextForm label="Brand Company">{item.brand_company}</TextForm>
          <TextForm label="Collection">{item.collection}</TextForm>
          <TextForm label="Description">{item.description}</TextForm>
          <FormGroup label="Attribute" labelColor="mono-color-dark" layout="vertical">
            {item.attributes?.map((attribute, index) => (
              <LibraryText
                name={attribute.name}
                content={attribute.content}
                key={index}
                customClass={styles.libraryText}
              />
            ))}
          </FormGroup>
          <FormGroup label="Dimension & Weight" labelColor="mono-color-dark" layout="vertical">
            <table className={styles.tableContent}>
              <tbody>
                {item.dimension_and_weight && item.dimension_and_weight?.attributes.length
                  ? item.dimension_and_weight.attributes.map((conversionItem, index) => (
                      <AttributeConversionText
                        key={conversionItem.id || index}
                        data={item.dimension_and_weight}
                        conversionItem={conversionItem}
                      />
                    ))
                  : null}
              </tbody>
            </table>
          </FormGroup>
          <FormGroup label="Options / Tags" labelColor="mono-color-dark" layout="vertical">
            {item.options?.map((option, index) => (
              <Collapse {...CollapseLevel1Props} style={{ paddingLeft: '16px' }}>
                <Collapse.Panel
                  header={
                    <LabelHeader
                      firstValue={option.title}
                      isSubHeader={true}
                      secondValue={option.tag}
                    />
                  }
                  key={index}>
                  {option.items.map((optionItem, optionIndex) => (
                    <LibraryText
                      image={optionItem.image}
                      content={optionItem.description}
                      key={optionIndex}
                    />
                  ))}
                </Collapse.Panel>
              </Collapse>
            ))}
          </FormGroup>
          <FormGroup label="Specification" labelColor="mono-color-dark" layout="vertical">
            {item.specifications?.map((specification, index) => (
              <LibraryText
                name={specification.name}
                content={specification.content}
                key={index}
                customClass={styles.libraryText}
              />
            ))}
          </FormGroup>
        </>
      );
    }

    return (
      <>
        <div style={{ marginBottom: '8px' }}>
          <TextForm label={'Website'} boxShadow>
            {item.website}
          </TextForm>
          <TextForm label={'Country Location'} boxShadow>
            {item.country_name}
          </TextForm>
          <TextForm label={'State / Province'} boxShadow>
            {item.state_name}
          </TextForm>
          <TextForm label={'City / Town'} boxShadow>
            {item.city_name}
          </TextForm>
          <TextForm label={'Address'} boxShadow>
            {item.address}
          </TextForm>
          <TextForm label={'Postal / Zip Code'} boxShadow>
            {item.postal_code}
          </TextForm>
        </div>
        {item.contacts?.map((contact, index) => (
          <Collapse {...CollapseLevel1Props}>
            <Collapse.Panel
              header={
                <LabelHeader
                  firstValue={getFullName(contact)}
                  isSubHeader={true}
                  secondValue={contact.position}
                />
              }
              key={index}>
              <TextForm boxShadow label="Work email">
                {contact.work_email}
              </TextForm>
              <FormGroup label="Work Phone" layout="vertical" labelColor="mono-color-dark">
                <PhoneInput
                  codeReadOnly
                  phoneNumberReadOnly
                  value={{
                    zoneCode: item.phone_code ?? '00',
                    phoneNumber: contact.work_phone,
                  }}
                />
              </FormGroup>
              <FormGroup label="Work Mobile" layout="vertical" labelColor="mono-color-dark">
                <PhoneInput
                  codeReadOnly
                  phoneNumberReadOnly
                  value={{
                    zoneCode: item.phone_code ?? '00',
                    phoneNumber: contact.work_mobile,
                  }}
                />
              </FormGroup>
            </Collapse.Panel>
          </Collapse>
        ))}
      </>
    );
  };

  return (
    <>
      {detailItems.map((item, index) => (
        <Collapse {...CollapseLevel2Props}>
          <Collapse.Panel
            header={
              <LabelHeader firstValue={item.title} quantity={item?.quantity} isSubHeader={true} />
            }
            key={index}
            collapsible={item.quantity === 0 ? 'disabled' : undefined}>
            {renderContentItem(item)}
          </Collapse.Panel>
        </Collapse>
      ))}
    </>
  );
};

const LibraryItem: FC<LibraryItemProps> = ({ data, type }) => {
  const title = getValueByCondition([
    [type === 'brand', 'Brands'],
    [type === 'distributor', 'Distributors'],
    [type === 'collection', 'Collections'],
    [type === 'product', 'Product Cards'],
  ]);

  const quantity = getValueByCondition([
    [type === 'brand', data?.brands.length],
    [type === 'distributor', data?.distributors.length],
    [type === 'collection', data?.collections.length],
    [type === 'product', data?.products.length],
  ]);

  const summaryOption = (options: OptionValue[]) => {
    let total = 0;
    for (const element of options) {
      if (options.length === 0) {
        total += 1;
      }
      total += element.items.length;
    }
    return total;
  };

  return (
    <Collapse {...CollapseLevel1Props}>
      <Collapse.Panel
        header={<LabelHeader firstValue={title} quantity={quantity} isSubHeader={false} />}
        key={title}
        collapsible={quantity === 0 ? 'disabled' : undefined}>
        <DetailItem
          detailItems={getValueByCondition([
            [
              type === 'brand',
              data?.brands.map((el) => ({
                title: el.business_name,
                website: el.website_uri,
                country_name: el.country_name,
                state_name: el.state_name,
                city_name: el.city_name,
                address: el.address,
                postal_code: el.postal_code,
                contacts: el.contacts,
                phone_code: el.phone_code,
              })),
            ],
            [
              type === 'distributor',
              data?.distributors.map((el) => ({
                title: el.business_name,
                website: el.website_uri,
                country_name: el.country_name,
                state_name: el.state_name,
                city_name: el.city_name,
                address: el.address,
                postal_code: el.postal_code,
                contacts: el.contacts,
                phone_code: el.phone_code,
              })),
            ],
            [
              type === 'collection',
              data?.collections.map((el) => ({
                title: el.name,
                products: el.products,
                quantity: el.products.length,
              })),
            ],
            [
              type === 'product',
              data?.products.map((el) => ({
                title: el.name,
                quantity: summaryOption(el.options),
                brand_company: el.company_name,
                description: el.description,
                collection: el.collection_name,
                attributes: el.attributes,
                specifications: el.specifications,
                options: el.options,
                dimension_and_weight: el.dimension_and_weight,
              })),
            ],
          ])}
          type={type}
        />
      </Collapse.Panel>
    </Collapse>
  );
};

const LibraryDesign: FC<RequiredValueProps> = ({ id }) => {
  const [libraryData, setLibraryData] = useState<LibraryDesignFirm>();

  useEffect(() => {
    if (!id) return;
    getLibraryByDesignFirm(id).then((res) => {
      if (res) {
        setLibraryData(res);
      }
    });
  }, []);

  return (
    <Row className={indexStyles.container}>
      <ResponsiveCol>
        <div className={`${indexStyles.form} ${styles.content}`}>
          <LibraryItem data={libraryData} type="brand" />
          <LibraryItem data={libraryData} type="distributor" />
          <LibraryItem data={libraryData} type="collection" />
          <LibraryItem data={libraryData} type="product" />
        </div>
      </ResponsiveCol>
    </Row>
  );
};

export default LibraryDesign;
