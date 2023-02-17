import { FC, useEffect, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { useParams } from 'umi';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as DragIcon } from '@/assets/icons/scroll-icon.svg';

import { trimStart, uniqueId } from 'lodash';

import { CustomProductDetailProps, NameContentProps } from '../../types';
import { RadioValue } from '@/components/CustomRadio/types';
import { TextFormProps } from '@/components/Form/types';
import store, { useAppSelector } from '@/reducers';
import { CollectionRelationType } from '@/types';

import { DragDropContainer, getNewDataAfterReordering } from '@/components/Drag';
import { DoubleInput } from '@/components/EntryForm/DoubleInput';
import InputGroup from '@/components/EntryForm/InputGroup';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import TextForm from '@/components/Form/TextForm';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { SimpleContentTable } from '@/components/Table/components/SimpleContentTable';

import { resetCustomProductState, setCustomProductDetail } from '../../slice';
import styles from './index.less';
import { BrandCompanyModal } from '@/features/product/modals/BrandCompanyModal';
import { CollectionModal } from '@/features/product/modals/CollectionModal';

const DEFAULT_CONTENT: NameContentProps = {
  id: '',
  name: '',
  content: '',
  sequence: -1,
};

export const SummaryTab: FC<{ viewOnly?: boolean }> = ({ viewOnly }) => {
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

  // update collection when reselect company
  useEffect(() => {
    store.dispatch(
      setCustomProductDetail({
        collection: { id: '', name: '' },
      }),
    );
  }, [company.id]);

  useEffect(() => {
    if (company.id) {
      store.dispatch(
        setCustomProductDetail({
          collection,
        }),
      );
    }
  }, [collection.id]);

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

  const textFormProps: Partial<TextFormProps> = {
    boxShadow: true,
    fontLevel: 6,
    labelFontSize: 4,
  };

  const renderBasicInfo = () => {
    if (viewOnly) {
      return (
        <div className="p-16">
          <TextForm {...textFormProps} label="Brand Company">
            {company.name || ''}
          </TextForm>
          <TextForm {...textFormProps} label="Collection">
            {collection.name || ''}
          </TextForm>
          <TextForm {...textFormProps} label="Product">
            {name || ''}
          </TextForm>
          <TextForm
            {...textFormProps}
            label="Description"
            boxShadow={false}
            style={{ marginBottom: 0 }}
          >
            {description || ''}
          </TextForm>
        </div>
      );
    }

    return (
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
          placeholder={'select from list'}
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
          disabled={!company.id}
          value={collection.name || ''}
          placeholder={'select from list'}
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
          placeholder={'type product name here'}
          onChange={onChangeDataByInput('name')}
        />
        <FormGroup
          label="Description"
          layout="vertical"
          formClass="mb-16"
          labelFontSize={4}
          required
        >
          <CustomTextArea
            maxWords={50}
            placeholder="max.50 words of product summary"
            value={description || ''}
            onChange={onChangeDataByInput('description')}
            customClass={styles.customTextArea}
            borderBottomColor="mono-medium"
            boxShadow
            autoResize
          />
        </FormGroup>
      </div>
    );
  };

  const onDragEnd = (result: any) => {
    const newAttributes = getNewDataAfterReordering(result, attributes) as NameContentProps[];

    store.dispatch(setCustomProductDetail({ attributes: newAttributes }));
  };

  const renderAttributes = () => {
    if (viewOnly) {
      return <SimpleContentTable flexOnMobile items={attributes} customClass="mt-8" />;
    }

    return (
      <>
        {!attributes?.length ? null : (
          <DragDropContainer onDragEnd={onDragEnd}>
            {attributes.map((attribute, index) => (
              <Draggable
                key={attribute.id}
                draggableId={`${attribute?.id || index}-${attribute.name}-${attribute.content}`}
                index={index}
              >
                {(dragProvided: any) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <DoubleInput
                      key={attribute.id || index}
                      fontLevel={6}
                      leftIcon={
                        <div {...dragProvided.dragHandleProps}>
                          <DragIcon />
                        </div>
                      }
                      rightIcon={
                        <DeleteIcon
                          className={styles.deleteIcon}
                          onClick={() => handleDeleteAttribute(attribute.id)}
                        />
                      }
                      firstValue={attribute.name}
                      firstPlaceholder="type name"
                      firstOnChange={onChangeAttribute('name', attribute, index)}
                      secondValue={attribute.content}
                      secondPlaceholder="type content"
                      secondOnChange={onChangeAttribute('content', attribute, index)}
                      doubleInputClass="mb-8"
                    />
                  </div>
                )}
              </Draggable>
            ))}
          </DragDropContainer>
        )}
      </>
    );
  };

  return (
    <>
      <div className={styles.formWrapper}>{renderBasicInfo()}</div>

      {viewOnly ? null : (
        <CustomPlusButton
          size={18}
          label="Add Attribute"
          customClass={styles.plusBtn}
          onClick={handleAddAttribute}
        />
      )}

      {renderAttributes()}

      {viewOnly ? null : (
        <BrandCompanyModal
          visible={visible === 'company'}
          setVisible={handleCloseModal}
          chosenValue={{
            value: company.id,
            label: company.name,
          }}
          setChosenValue={onChangeDataBySelected('company')}
        />
      )}

      {!viewOnly && brandCompanyId ? (
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
