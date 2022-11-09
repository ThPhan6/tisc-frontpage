import { useEffect, useState } from 'react';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';
import { ReactComponent as SingleRightFormIcon } from '@/assets/icons/single-right-form-icon.svg';

import { trimStart, uniqueId } from 'lodash';

import { NameContentProps, SummaryRequestBody } from '../../types';
import { RadioValue } from '@/components/CustomRadio/types';

import { DoubleInput } from '@/components/EntryForm/DoubleInput';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { CollectionModal } from '../Modal/CollectionModal';
import { CompanyModal } from '../Modal/CompanyModal';
import '../index.less';
import styles from './index.less';

const fData: SummaryRequestBody = {
  company: {
    id: '1',
    name: 'Chase',
  },
  collection: {
    id: '2',
    name: 'name 1',
  },
  product: 'product',
  description: 'description',
  attributes: [
    { id: '1ddd3313', name: 'name 1', content: 'content  1' },
    { id: '231j2h31jk2', name: 'name 2', content: 'content  2' },
  ],
};

const DEFAULT_CONTENT: NameContentProps = {
  id: '',
  name: '',
  content: '',
};

const DEFAULT_STATE: SummaryRequestBody = {
  company: {
    id: '',
    name: '',
  },
  collection: {
    id: '',
    name: '',
  },
  product: '',
  description: '',
  attributes: [],
};

export const SummaryTab = () => {
  const [visible, setVisible] = useState<'' | 'company' | 'collection'>('');
  const [data, setData] = useState<SummaryRequestBody>(DEFAULT_STATE);

  useEffect(() => {
    setData({
      company: { id: fData.company.id, name: fData.company.name },
      collection: { id: fData.collection.id, name: fData.collection.name },
      product: fData.product,
      description: fData.description,
      attributes: fData.attributes,
    });
  }, []);

  const onChangeDataByInput =
    (fieldName: keyof Omit<SummaryRequestBody, 'attributes'>, type?: 'object') =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (type) {
        setData((prevState) => ({
          ...prevState,
          [fieldName]: {
            id: fieldName === 'company' ? data.company.id : data.collection.id,
            name: e.target.value,
          },
        }));
      } else {
        setData((prevState) => ({
          ...prevState,
          [fieldName]: trimStart(e.target.value),
        }));
      }
    };

  /// for company and collection has been selected
  const onChangeDataBySelected =
    (fieldName: 'company' | 'collection') => (valueSelected: RadioValue) => {
      setData((prevState) => ({
        ...prevState,
        [fieldName]: {
          id: valueSelected.value,
          name: valueSelected.label,
        },
      }));
    };

  // console.log(data);

  const handleAddAttribute = () => {
    const randomID = uniqueId();

    setData((prevState) => ({
      ...prevState,
      attributes: [...prevState.attributes, { ...DEFAULT_CONTENT, id: randomID }],
    }));
  };

  const handleDeleteAttribute = (id: string) => {
    const newData = data.attributes.filter((attribute) => attribute.id !== id);
    setData((prevState) => ({
      ...prevState,
      attributes: newData,
    }));
  };

  const onChangeAttribute =
    (fieldName: keyof Omit<NameContentProps, 'id'>, attribute: NameContentProps, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAttribute = [...data.attributes];
      newAttribute[index] = { ...attribute, [fieldName]: e.target.value };
      setData((prevState) => ({
        ...prevState,
        attributes: newAttribute,
      }));
    };

  const handleCloseModal = (isClose: boolean) => (isClose ? undefined : setVisible(''));

  return (
    <>
      <div className={styles.formWrapper}>
        <div className="p-16">
          <FormGroup label="Brand Company" layout="vertical" formClass="mb-16" required>
            <div className="flex-between">
              <CustomInput
                fontLevel={6}
                placeholder="type here or select from existing"
                value={data.company.name || ''}
                onChange={onChangeDataByInput('company', 'object')}
              />
              <SingleRightFormIcon
                className="cursor-pointer"
                onClick={() => setVisible('company')}
              />
            </div>
          </FormGroup>

          <FormGroup label="Collection" layout="vertical" formClass="mb-16" required>
            <div className="flex-between">
              <CustomInput
                fontLevel={6}
                placeholder="type here or select from existing"
                value={data.collection.name || ''}
                onChange={onChangeDataByInput('collection', 'object')}
              />
              <SingleRightFormIcon
                className="cursor-pointer"
                onClick={() => setVisible('collection')}
              />
            </div>
          </FormGroup>

          <FormGroup label="Product" layout="vertical" formClass="mb-16" required>
            <CustomInput
              fontLevel={6}
              placeholder="type here or select from existing"
              value={data.product || ''}
              onChange={onChangeDataByInput('product')}
            />
          </FormGroup>

          <FormGroup label="Description" layout="vertical" formClass="mb-16" required>
            <CustomTextArea
              maxLength={100}
              showCount
              placeholder="type here"
              borderBottomColor="mono-medium"
              boxShadow
              value={data.description || ''}
              onChange={onChangeDataByInput('description')}
            />
          </FormGroup>
        </div>
      </div>

      <CustomPlusButton
        size={18}
        label="Add Attribute"
        customClass={styles.plusBtn}
        onClick={handleAddAttribute}
      />

      {data.attributes?.map((attribute, index) => {
        return (
          <DoubleInput
            key={attribute.id || index}
            fontLevel={6}
            leftIcon={<ScrollIcon />}
            rightIcon={
              <DeleteIcon
                className="cursor-pointer"
                onClick={() => handleDeleteAttribute(attribute.id)}
              />
            }
            firstValue={attribute.name}
            firstPlaceholder="type content"
            firstOnChange={onChangeAttribute('name', attribute, index)}
            secondValue={attribute.content}
            secondPlaceholder="type content"
            secondOnChange={onChangeAttribute('content', attribute, index)}
            doubleInputClass="mb-8"
          />
        );
      })}

      <CompanyModal
        companyId=""
        visible={visible === 'company'}
        setVisible={handleCloseModal}
        chosenValue={{
          value: data.company.id,
          label: data.company.name,
        }}
        setChosenValue={onChangeDataBySelected('company')}
      />

      <CollectionModal
        visible={visible === 'collection'}
        setVisible={handleCloseModal}
        chosenValue={{
          value: data.collection.id,
          label: data.collection.name,
        }}
        setChosenValue={onChangeDataBySelected('collection')}
      />
    </>
  );
};
