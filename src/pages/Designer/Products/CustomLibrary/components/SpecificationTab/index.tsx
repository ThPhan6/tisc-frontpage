import { useState } from 'react';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';
import PlaceHolderImage from '@/assets/images/product-placeholder.png';

import { showImageUrl } from '@/helper/utils';
import { uniqueId } from 'lodash';

import { NameContentProps, ProductOptionProps } from '../../types';
import store, { useAppSelector } from '@/reducers';

import CustomCollapse from '@/components/Collapse';
import { DoubleInput } from '@/components/EntryForm/DoubleInput';
import InputGroup from '@/components/EntryForm/InputGroup';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import { setCustomProductDetail } from '../../slice';
import { ProductOptionModal } from '../Modal/ProductOptionModal';
import '../index.less';
import styles from './index.less';
import { DimensionWeight } from '@/features/dimension-weight';

const DEFAULT_CONTENT: NameContentProps = {
  id: '',
  name: '',
  content: '',
};

export const SpecificationTab = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const { specification, options, dimension_and_weight } = useAppSelector(
    (state) => state.customProduct.details,
  );

  const dimensionWeightData = dimension_and_weight;

  // console.log('dimensionWeightData', dimensionWeightData);

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

  const onChangeOptionTitle = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOptionGroup = [...options];
    newOptionGroup[index] = { ...newOptionGroup[index], title: e.target.value };

    store.dispatch(
      setCustomProductDetail({
        options: newOptionGroup,
      }),
    );
  };

  const handleAddOptionGroup = () => {
    const randomID = uniqueId();
    const newOptionGroup: ProductOptionProps = {
      id: randomID,
      tag: '',
      title: '',
      use_image: false,
      items: [],
    };

    store.dispatch(
      setCustomProductDetail({
        options: [...options, newOptionGroup],
      }),
    );
  };

  const handleDeleteOptionGroup = (index: number) => {
    const newOptionContent = options.filter((_item, itemIndex) => itemIndex !== index);
    store.dispatch(setCustomProductDetail({ options: newOptionContent }));
  };

  const handleDeleteOptionGroupItem = (optionIndex: number, itemIndex: number) => {
    const newOption = [...options];
    const newOptionItem = newOption[optionIndex].items.filter(
      (_item, itemIdx) => itemIdx !== itemIndex,
    );

    newOption[optionIndex] = { ...newOption[optionIndex], items: newOptionItem };

    store.dispatch(setCustomProductDetail({ options: newOption }));
  };

  return (
    <>
      <DimensionWeight
        editable
        data={dimensionWeightData}
        onChange={(data) => {
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
        <CustomPlusButton size={18} label="Add Option" onClick={handleAddOptionGroup} />
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
              firstPlaceholder="type name"
              firstOnChange={onChangeSpecification('name', item, index)}
              secondValue={item.content}
              secondPlaceholder="type content"
              secondOnChange={onChangeSpecification('content', item, index)}
            />
          );
        })}

        {options.length
          ? options.map((option, optionIndex) => (
              <>
                <CustomCollapse
                  key={option.id || optionIndex}
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
                      value={option.title}
                      onChange={onChangeOptionTitle(optionIndex)}
                    />
                  }>
                  <div className="flex-between">
                    <div className="flex-start cursor-pointer" onClick={() => setVisible(true)}>
                      <MainTitle level={4} customClass={styles.content}>
                        Create Option
                      </MainTitle>
                      <SingleRightIcon />
                    </div>
                    <DeleteIcon
                      className="cursor-pointer"
                      onClick={() => handleDeleteOptionGroup(optionIndex)}
                    />
                  </div>
                  {option.items.length
                    ? option.items.map((item, itemIndex) => (
                        <div className="flex-between">
                          <div className="flex-start pr-16">
                            <img
                              src={showImageUrl(item.image || PlaceHolderImage)}
                              className={styles.image}
                            />
                            <RobotoBodyText level={5}>{item.description}</RobotoBodyText>
                          </div>
                          <DeleteIcon
                            className="cursor-pointer"
                            onClick={() => handleDeleteOptionGroupItem(optionIndex, itemIndex)}
                          />
                        </div>
                      ))
                    : null}
                </CustomCollapse>
              </>
            ))
          : null}
      </div>

      {options.length
        ? options.map((option, optionIndex) => (
            <ProductOptionModal
              key={option.id || optionIndex}
              visible={visible}
              setVisible={(isClose) => (isClose ? undefined : setVisible(false))}
              data={option}
              optionIndex={optionIndex}
            />
          ))
        : null}
    </>
  );
};
