import { useState } from 'react';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';

import { uniqueId } from 'lodash';

import { NameContentProps, ProductOptionProps, SpecificationRequestBody } from '../../types';

import CustomCollapse from '@/components/Collapse';
import { DoubleInput } from '@/components/EntryForm/DoubleInput';
import InputGroup from '@/components/EntryForm/InputGroup';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';

import { ProductOptionModal } from '../Modal/ProductOptionModal';
import '../index.less';
import styles from './index.less';
import { DimensionWeight, productWithDiameterData } from '@/features/dimension-weight';

const DEFAULT_OPTION: ProductOptionProps = {
  id: '',
  use_image: false,
  tag: '',
  contents: [],
};

const DEFAULT_CONTENT: NameContentProps = {
  id: '',
  name: '',
  content: '',
};

const DEFAULT_STATE: SpecificationRequestBody = {
  dimension_n_weight: productWithDiameterData,
  specifications: [],
  options: [],
};

export const SpecificationTab = () => {
  const [visible, setVisible] = useState<'' | 'option'>('');

  const [data, setData] = useState<SpecificationRequestBody>(DEFAULT_STATE);

  const handleDeleteSpecification = (id: string) => {
    const newData = data.specifications?.filter((specification) => specification.id !== id);
    setData((prevState) => ({
      ...prevState,
      specifications: newData,
    }));
  };

  console.log(data);

  const handleAddSpecification = () => {
    const randomID = uniqueId();
    setData((prevState) => ({
      ...prevState,
      specifications: [...prevState.specifications, { ...DEFAULT_CONTENT, id: randomID }],
    }));
  };

  const onChangeSpecification =
    (
      fieldName: keyof Omit<NameContentProps, 'id'>,
      specification: NameContentProps,
      index: number,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSpecification = [...data.specifications];
      newSpecification[index] = { ...specification, [fieldName]: e.target.value };
      setData((prevState) => ({
        ...prevState,
        specifications: newSpecification,
      }));
    };

  const handleAddOption = () => {
    const randomID = uniqueId();
    setData((prevState) => ({
      ...prevState,
      options: [...prevState.options, { ...DEFAULT_OPTION, id: randomID }],
    }));
  };

  return (
    <>
      <DimensionWeight />
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
        {data.specifications?.map((specification, index) => {
          return (
            <DoubleInput
              key={specification.id || index}
              fontLevel={6}
              doubleInputClass="mb-8"
              leftIcon={<ScrollIcon />}
              rightIcon={
                <DeleteIcon
                  className="cursor-pointer"
                  onClick={() => handleDeleteSpecification(specification.id)}
                />
              }
              firstValue={specification.name}
              firstPlaceholder="type content"
              firstOnChange={onChangeSpecification('name', specification, index)}
              secondValue={specification.content}
              secondPlaceholder="type content"
              secondOnChange={onChangeSpecification('content', specification, index)}
            />
          );
        })}

        {data.options?.map((option) => {
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
