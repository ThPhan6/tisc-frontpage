import { useEffect, useState } from 'react';

import { useParams } from 'umi';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';

import { trimStart, uniqueId } from 'lodash';

import { CustomProductDetailProps, NameContentProps } from '../../types';
import { RadioValue } from '@/components/CustomRadio/types';
import store, { useAppSelector } from '@/reducers';
import { CollectionRelationType } from '@/types';

import { DoubleInput } from '@/components/EntryForm/DoubleInput';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { resetCustomProductState, setCustomProductDetail } from '../../slice';
import { BrandCompanyModal } from '../Modal/BrandCompanyModal';
import { CollectionModal } from '../Modal/CollectionModal';
import '../index.less';
import styles from './index.less';

const DEFAULT_CONTENT: NameContentProps = {
  id: '',
  name: '',
  content: '',
};

export const SummaryTab = () => {
  const [visible, setVisible] = useState<'' | 'company' | 'collection'>('');

  const { collection, company, name, description, attributes } = useAppSelector(
    (state) => state.customProduct.details,
  );

  const params = useParams<{ id: string }>();
  const productId = params.id || '';

  const brandCompanyId = company.id || '';
  const collectionId = brandCompanyId ? collection.id : '';

  useEffect(() => {
    if (!productId) {
      store.dispatch(resetCustomProductState());
    }
  }, []);

  const onChangeDataByInput =
    (fieldName: keyof CustomProductDetailProps) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = trimStart(e.target.value);

      if (fieldName === 'company' || fieldName === 'collection') {
        store.dispatch(
          setCustomProductDetail({
            [fieldName]: {
              id: fieldName === 'company' ? brandCompanyId : collectionId,
              name: newValue,
            },
          }),
        );
      } else {
        store.dispatch(
          setCustomProductDetail({
            [fieldName]: newValue,
          }),
        );
      }
    };

  /// for company and collection has been selected
  const onChangeDataBySelected =
    (fieldName: 'company' | 'collection') => (valueSelected: RadioValue) => {
      store.dispatch(
        setCustomProductDetail({
          [fieldName]: {
            id: valueSelected.value,
            name: valueSelected.label,
          },
        }),
      );
    };

  const handleAddAttribute = () => {
    const randomID = uniqueId();

    store.dispatch(
      setCustomProductDetail({
        attributes: [...attributes, { ...DEFAULT_CONTENT, id: randomID }],
      }),
    );
  };

  const handleDeleteAttribute = (id: string) => {
    const newData = attributes.filter((attribute) => attribute.id !== id);

    store.dispatch(
      setCustomProductDetail({
        attributes: newData,
      }),
    );
  };

  const onChangeAttribute =
    (fieldName: keyof Omit<NameContentProps, 'id'>, attribute: NameContentProps, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAttribute = [...attributes];
      newAttribute[index] = { ...attribute, [fieldName]: e.target.value };

      store.dispatch(
        setCustomProductDetail({
          attributes: newAttribute,
        }),
      );
    };

  const handleCloseModal = (isClose: boolean) => (isClose ? undefined : setVisible(''));

  return (
    <>
      <div className={styles.formWrapper}>
        <div className="p-16">
          <InputGroup
            label="Brand Company"
            fontLevel={4}
            required
            rightIcon
            hasPadding
            colorPrimaryDark
            hasBoxShadow
            hasHeight
            value={company.name || ''}
            placeholder={brandCompanyId ? 'select from list' : 'company has not selected'}
            onChange={onChangeDataByInput('company')}
            onRightIconClick={() => setVisible('company')}
          />
          <InputGroup
            label="Collection"
            fontLevel={4}
            required
            rightIcon
            hasPadding
            colorPrimaryDark
            hasBoxShadow
            hasHeight
            value={collection.name || ''}
            placeholder={brandCompanyId ? 'select from list' : "dont's have company"}
            onChange={onChangeDataByInput('collection')}
            onRightIconClick={() => setVisible('collection')}
          />
          <InputGroup
            label="Product"
            fontLevel={4}
            required
            hasPadding
            colorPrimaryDark
            hasBoxShadow
            hasHeight
            value={name || ''}
            placeholder={brandCompanyId ? 'type product name here' : 'product name is missing'}
            onChange={onChangeDataByInput('name')}
          />
          <FormGroup
            label="Description"
            layout="vertical"
            formClass="mb-16"
            lableFontSize={4}
            required>
            <CustomTextArea
              maxLength={100}
              showCount
              placeholder="type here"
              borderBottomColor="mono-medium"
              boxShadow
              value={description || ''}
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

      {attributes?.map((attribute, index) => {
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

      <BrandCompanyModal
        visible={visible === 'company'}
        setVisible={handleCloseModal}
        chosenValue={{
          value: company.id,
          label: company.name,
        }}
        setChosenValue={onChangeDataBySelected('company')}
      />

      {brandCompanyId ? (
        <CollectionModal
          brandId={brandCompanyId}
          collectionType={CollectionRelationType.CustomLibrary}
          visible={visible === 'collection'}
          setVisible={handleCloseModal}
          chosenValue={{
            value: collection.id,
            label: collection.name,
          }}
          setChosenValue={onChangeDataBySelected('collection')}
        />
      ) : null}
    </>
  );
};
