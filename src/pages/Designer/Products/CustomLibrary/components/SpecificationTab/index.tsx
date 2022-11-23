import { useState } from 'react';

import { Col, Row } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { showImageUrl } from '@/helper/utils';

import { NameContentProps, ProductOptionProps } from '../../types';
import store, { useAppSelector } from '@/reducers';

import CustomCollapse from '@/components/Collapse';
import { DoubleInput } from '@/components/EntryForm/DoubleInput';
import InputGroup from '@/components/EntryForm/InputGroup';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import { setCustomProductDetail } from '../../slice';
import { DEFAULT_PRODUCT_OPTION, ProductOptionModal } from '../Modal/ProductOptionModal';
import '../index.less';
import styles from './index.less';
import { DimensionWeight } from '@/features/dimension-weight';

const DEFAULT_CONTENT: NameContentProps = {
  id: '',
  name: '',
  content: '',
};

export const SpecificationTab = (props: { isUpdate?: boolean }) => {
  const [optionModalVisible, setOptionModalVisible] = useState<boolean>(false);

  const { specification, options, dimension_and_weight } = useAppSelector(
    (state) => state.customProduct.details,
  );

  const [curOption, setCurOption] = useState<ProductOptionProps>(DEFAULT_PRODUCT_OPTION);

  const dimensionWeightData = dimension_and_weight;

  const handleDeleteSpecification = (id: string) => {
    const newData = specification?.filter((filterItem) => filterItem.id !== id);
    store.dispatch(
      setCustomProductDetail({
        specification: newData,
      }),
    );
  };

  const handleAddSpecification = () => {
    store.dispatch(
      setCustomProductDetail({
        specification: [...specification, { ...DEFAULT_CONTENT }],
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
    const newOptionGroup: ProductOptionProps = {
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

  const renderProductOptionGroup = () => {
    if (options.length === 0) {
      return null;
    }
    return options.map((option: ProductOptionProps, optionIndex: number) => (
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
        <div className="flex-between" style={{ padding: '10px 16px' }}>
          <div
            className="flex-start cursor-pointer"
            onClick={() => {
              setOptionModalVisible(true);
              setCurOption(option);
            }}>
            <MainTitle level={4} customClass={styles.content}>
              {props.isUpdate ? 'Update' : 'Create'} Options
            </MainTitle>
            <SingleRightIcon />
          </div>
          <div className="flex-start">
            {option.tag ? (
              <RobotoBodyText level={6} style={{ fontWeight: '500', marginRight: 16 }}>
                TAG: {option.tag}
              </RobotoBodyText>
            ) : null}
            <DeleteIcon
              className="cursor-pointer"
              onClick={() => handleDeleteOptionGroup(optionIndex)}
            />
          </div>
        </div>

        {option.items.map((item, itemIndex) => (
          <Row className={styles.optionItem} align="middle" justify="space-between">
            {option.use_image && item.image ? (
              <Col flex="48px">
                <img
                  src={showImageUrl(item.image)}
                  style={{
                    width: 48,
                    height: 48,
                    objectFit: 'contain',
                    marginRight: 24,
                  }}
                />
              </Col>
            ) : null}
            <Col flex="auto" style={{ maxWidth: 'calc(100% - 66px)' }}>
              <RobotoBodyText level={5} customClass="text-overflow">
                {item.description}
              </RobotoBodyText>
            </Col>
            <Col flex="18px" style={{ height: 18 }}>
              <DeleteIcon
                className="cursor-pointer"
                onClick={() => handleDeleteOptionGroupItem(optionIndex, itemIndex)}
              />
            </Col>
          </Row>
        ))}
      </CustomCollapse>
    ));
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

        {renderProductOptionGroup()}
      </div>

      <ProductOptionModal
        visible={optionModalVisible}
        setVisible={(isClose) => (isClose ? undefined : setOptionModalVisible(false))}
        option={curOption}
      />
    </>
  );
};
