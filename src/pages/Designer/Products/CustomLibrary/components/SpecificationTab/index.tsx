import { FC, useState } from 'react';

import { Col, Row } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { useGetDimensionWeight } from '@/features/dimension-weight/hook';

import { NameContentProps, ProductInfoTab, ProductOptionProps } from '../../types';
import store, { useAppSelector } from '@/reducers';

import CustomCollapse from '@/components/Collapse';
import { EmptyOne } from '@/components/Empty';
import { DoubleInput } from '@/components/EntryForm/DoubleInput';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { SimpleContentTable } from '@/components/Table/components/SimpleContentTable';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import { setCustomProductDetail } from '../../slice';
import { DEFAULT_PRODUCT_OPTION, ProductOptionModal } from '../Modal/ProductOptionModal';
import '../index.less';
import { OptionCollapseHeader } from './OptionCollapseHeader';
import { OptionItemView, renderOptionImage } from './OptionItemView';
import styles from './index.less';
import { DimensionWeight } from '@/features/dimension-weight';

const DEFAULT_CONTENT: NameContentProps = {
  id: '',
  name: '',
  content: '',
};

export const SpecificationTab: FC<{
  productId?: string;
  viewOnly?: boolean;
  isPublicPage?: boolean;
  specifying?: boolean;
  activeKey: ProductInfoTab;
}> = ({ productId, viewOnly, isPublicPage, specifying, activeKey }) => {
  const [optionModalVisible, setOptionModalVisible] = useState<boolean>(false);

  const {
    specifications,
    options,
    dimension_and_weight,
    specification: defaultSelection,
    specifiedDetail,
  } = useAppSelector((state) => state.customProduct.details);
  const specification = specifiedDetail?.specification || defaultSelection;

  const [curOption, setCurOption] = useState<ProductOptionProps>(DEFAULT_PRODUCT_OPTION);
  const [curOptionIndex, setCurOptionIndex] = useState(-1);

  const { data: dwData } = useGetDimensionWeight(!productId);

  const dimensionWeightData = dimension_and_weight.id ? dimension_and_weight : dwData;

  const noneData =
    viewOnly &&
    !specifications.length &&
    !options.length &&
    !dimensionWeightData.attributes.some(
      (el) =>
        (el.with_diameter === dimensionWeightData.with_diameter || el.with_diameter === null) &&
        el.conversion_value_1,
    );

  if (noneData) {
    return <EmptyOne customClass="p-16" />;
  }

  const handleAddSpecification = () => {
    store.dispatch(
      setCustomProductDetail({
        specifications: [...specifications, { ...DEFAULT_CONTENT }],
      }),
    );
  };

  const handleDeleteSpecification = (specIndex: number) => {
    const newData = specifications?.filter((_item, itemIndex) => itemIndex !== specIndex);
    store.dispatch(
      setCustomProductDetail({
        specifications: newData,
      }),
    );
  };

  const onChangeSpecification =
    (fieldName: keyof Omit<NameContentProps, 'id'>, attributes: NameContentProps, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSpecification = [...specifications];
      newSpecification[index] = { ...attributes, [fieldName]: e.target.value };
      store.dispatch(
        setCustomProductDetail({
          specifications: newSpecification,
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

  const renderOptionItems = (option: ProductOptionProps, optionIndex: number) => {
    if (viewOnly) {
      return (
        <OptionItemView
          data={options}
          dataIndex={optionIndex}
          productId={productId}
          specification={specification}
          specifying={specifying}
          isPublicPage={isPublicPage}
          specifiedDetail={specifiedDetail}
          viewOnly={viewOnly}
        />
      );
    }

    return option.items.map((item, itemIndex) => (
      <Row className={styles.optionItem} align="middle" justify="space-between">
        {option.use_image && item.image ? (
          <Col flex="48px">{renderOptionImage(item.image)}</Col>
        ) : null}
        <Col flex="auto" style={{ maxWidth: 'calc(100% - 52px)', paddingLeft: 24 }}>
          <RobotoBodyText level={5} customClass="text-overflow">
            {item.description}
          </RobotoBodyText>
        </Col>
        <Col flex="18px" style={{ height: 18 }}>
          <DeleteIcon
            className={styles.deleteIcon}
            onClick={() => handleDeleteOptionGroupItem(optionIndex, itemIndex)}
          />
        </Col>
      </Row>
    ));
  };

  const renderProductOptionGroup = () => {
    if (options.length === 0) {
      return null;
    }

    return options.map((option: ProductOptionProps, optionIndex: number) => (
      <CustomCollapse
        key={option.id || optionIndex}
        showActiveBoxShadow={!specifying}
        noBorder={specifying || (viewOnly && option.use_image)}
        expandingHeaderFontStyle="bold"
        customHeaderClass={styles.optionCollapse}
        arrowAlignRight={specifying}
        header={
          <OptionCollapseHeader
            data={options}
            dataIndex={optionIndex}
            productId={productId}
            specification={specification}
            specifying={specifying}
            isPublicPage={isPublicPage}
            specifiedDetail={specifiedDetail}
            viewOnly={viewOnly}
          />
        }
      >
        {viewOnly ? null : (
          <div className="flex-between" style={{ padding: '10px 16px' }}>
            <div
              className="flex-start cursor-pointer"
              onClick={() => {
                setOptionModalVisible(true);
                setCurOption(option);
                setCurOptionIndex(optionIndex);
              }}
            >
              <MainTitle level={4} customClass={styles.content}>
                {option.items.length ? 'Update Options' : 'Create Options'}
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
                className={styles.deleteIcon}
                onClick={() => handleDeleteOptionGroup(optionIndex)}
              />
            </div>
          </div>
        )}

        {renderOptionItems(option, optionIndex)}
      </CustomCollapse>
    ));
  };

  const renderSpecification = () => {
    if (viewOnly) {
      return (
        <SimpleContentTable
          items={specifications}
          tdStyle={specifying ? { paddingLeft: 0 } : {}}
          flex={specifying ? '30-70' : '25-75'}
          noPadding={specifying}
        />
      );
    }
    return specifications?.map((item, index) => (
      <DoubleInput
        key={item.id || index}
        fontLevel={6}
        doubleInputClass="mb-8"
        leftIcon={<ScrollIcon />}
        rightIcon={
          <DeleteIcon
            className={styles.deleteIcon}
            onClick={() => handleDeleteSpecification(index)}
          />
        }
        firstValue={item.name}
        firstPlaceholder="type name"
        firstOnChange={onChangeSpecification('name', item, index)}
        secondValue={item.content}
        secondPlaceholder="type content"
        secondOnChange={onChangeSpecification('content', item, index)}
      />
    ));
  };

  return (
    <>
      <DimensionWeight
        customClass={specifying ? 'mt-8' : ''}
        editable={!viewOnly}
        isShow={activeKey === 'specification'}
        noPadding={specifying}
        collapseStyles={!specifying}
        arrowAlignRight={specifying}
        data={dimensionWeightData}
        isConversionText={specifying}
        onChange={(data) => {
          store.dispatch(
            setCustomProductDetail({
              dimension_and_weight: data,
            }),
          );
        }}
      />

      {viewOnly ? null : (
        <div className="flex-end pr-16 mb-8">
          <CustomPlusButton
            size={18}
            label="Add Specification"
            customClass="mr-24"
            onClick={handleAddSpecification}
          />
          <CustomPlusButton size={18} label="Add Option" onClick={handleAddOptionGroup} />
        </div>
      )}

      <div className={styles.mainContent}>
        {renderSpecification()}

        {renderProductOptionGroup()}
      </div>

      {viewOnly ? null : (
        <ProductOptionModal
          visible={optionModalVisible}
          setVisible={(isClose) => {
            if (isClose) {
              return;
            }
            setOptionModalVisible(false);
            setCurOption(DEFAULT_PRODUCT_OPTION);
            setCurOptionIndex(-1);
          }}
          option={curOption}
          optionIndex={curOptionIndex}
        />
      )}
    </>
  );
};
