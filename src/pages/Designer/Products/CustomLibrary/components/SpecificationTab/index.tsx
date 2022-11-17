import { useState } from 'react';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';

import { uniqueId } from 'lodash';

import { NameContentProps, ProductOptionProps } from '../../types';
import store, { useAppSelector } from '@/reducers';

import CustomCollapse from '@/components/Collapse';
import { DoubleInput } from '@/components/EntryForm/DoubleInput';
import InputGroup from '@/components/EntryForm/InputGroup';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { setCustomProductDetail } from '../../slice';
import { ProductOptionModal } from '../Modal/ProductOptionModal';
import '../index.less';
import styles from './index.less';
import { DimensionWeight } from '@/features/dimension-weight';

const DEFAULT_OPTION: ProductOptionProps = {
  id: '',
  use_image: false,
  tag: '',
  items: [],
};

const DEFAULT_CONTENT: NameContentProps = {
  id: '',
  name: '',
  content: '',
};

export const SpecificationTab = () => {
  const [visible, setVisible] = useState<'' | 'option'>('');

  const { specification, options, dimension_and_weight } = useAppSelector(
    (state) => state.customProduct.details,
  );

  const handleDeleteSpecification = (id: string) => {
    const newData = specification?.filter((filterItem) => filterItem.id !== id);
    store.dispatch(
      setCustomProductDetail({
        specification: newData,
      }),
    );
  };

  const handleAddSpecification = () => {
    const randomID = uniqueId();
    store.dispatch(
      setCustomProductDetail({
        specification: [...specification, { ...DEFAULT_CONTENT, id: randomID }],
      }),
    );
  };

  const onChangeSpecification =
    (fieldName: keyof Omit<NameContentProps, 'id'>, attributes: NameContentProps, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSpecification = [...specification];
      newSpecification[index] = { ...attributes, [fieldName]: e.target.value };
      store.dispatch(
        setCustomProductDetail({
          specification: newSpecification,
        }),
      );
    };

  const handleAddOption = () => {
    const randomID = uniqueId();

    store.dispatch(
      setCustomProductDetail({
        options: [...options, { ...DEFAULT_OPTION, id: randomID }],
      }),
    );
  };
  return (
    <>
      <DimensionWeight
        data={dimension_and_weight}
        editable
        setData={(data) => {
          store.dispatch(
            setCustomProductDetail({
              dimension_and_weight: data,
            }),
          );
        }}
      />

      <div className="flex-end pr-16">
        <CustomPlusButton
          size={18}
          label="Add Specification"
          customClass="mr-24"
          onClick={handleAddSpecification}
        />
        <CustomPlusButton size={18} label="Add Option" onClick={handleAddOption} />
      </div>

      <div>
        {specification?.map((item, index) => {
          return (
            <DoubleInput
              key={item.id || index}
              fontLevel={6}
              doubleInputClass="mb-8"
              leftIcon={<ScrollIcon />}
              rightIcon={
                <DeleteIcon
                  className="cursor-pointer"
                  onClick={() => handleDeleteSpecification(item.id)}
                />
              }
              firstValue={item.name}
              firstPlaceholder="type content"
              firstOnChange={onChangeSpecification('name', item, index)}
              secondValue={item.content}
              secondPlaceholder="type content"
              secondOnChange={onChangeSpecification('content', item, index)}
            />
          );
        })}

        {options?.map((option) => {
          return (
            <CustomCollapse
              defaultActiveKey={'1'}
              showActiveBoxShadow
              customHeaderClass={styles.optionCollapse}
              header={
                <InputGroup
                  horizontal
                  noWrap
                  fontLevel={4}
                  containerClass={styles.content}
                  label={<ScrollIcon />}
                  placeholder="type title eg Colour Rand or Material Options"
                  defaultValue={option.tag}
                  // onChange={onChangeAttributeName(groupIndex)}
                />
              }>
              ddd
            </CustomCollapse>
          );
        })}
      </div>

      <ProductOptionModal
        visible={visible === 'option'}
        setVisible={(isClose) => (isClose ? undefined : setVisible(''))}
      />
    </>
  );
};
