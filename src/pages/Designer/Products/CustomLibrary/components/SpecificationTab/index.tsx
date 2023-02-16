import { FC, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { Col, Row } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { useGetDimensionWeight } from '@/features/dimension-weight/hook';

import { NameContentProps, ProductInfoTab, ProductOptionProps } from '../../types';
import store, { useAppSelector } from '@/reducers';

import { ActiveOneCustomCollapse } from '@/components/Collapse';
import { useDragging } from '@/components/DragIcon';
import { EmptyOne } from '@/components/Empty';
import { DoubleInput } from '@/components/EntryForm/DoubleInput';
import { LogoIcon } from '@/components/LogoIcon';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { SimpleContentTable } from '@/components/Table/components/SimpleContentTable';
import { MainTitle, RobotoBodyText } from '@/components/Typography';

import { setCustomProductDetail } from '../../slice';
import { DEFAULT_PRODUCT_OPTION, ProductOptionModal } from '../Modal/ProductOptionModal';
import '../index.less';
import { OptionCollapseHeader } from './OptionCollapseHeader';
import { OptionItemView } from './OptionItemView';
import styles from './index.less';
import { DimensionWeight } from '@/features/dimension-weight';

const DEFAULT_CONTENT: NameContentProps = {
  id: '',
  name: '',
  content: '',
  type: 'specification',
  sequence: -1,
};

export const SpecificationTab: FC<{
  productId?: string;
  viewOnly?: boolean;
  isPublicPage?: boolean;
  specifying?: boolean;
  activeKey: ProductInfoTab;
  specOptionData: any[];
  setSpecOptionData?: (data: any) => void;
}> = ({
  productId,
  viewOnly,
  isPublicPage,
  specifying,
  activeKey,
  specOptionData,
  setSpecOptionData,
}) => {
  const [optionModalVisible, setOptionModalVisible] = useState<boolean>(false);

  const { DragDropContainer, isDragDisabled, DragDropIcon, getNewDataAfterReordering } =
    useDragging();

  const {
    // specifications, // specification data(edit mode)
    // options,
    dimension_and_weight,
    specification: defaultSelection,
    specifiedDetail,
  } = useAppSelector((state) => state.customProduct.details);

  /// using for user selection(view mode)
  const specification = specifiedDetail?.specification || defaultSelection;

  /// using for option data
  const [curOption, setCurOption] = useState<ProductOptionProps>(DEFAULT_PRODUCT_OPTION);
  const [curOptionIndex, setCurOptionIndex] = useState(-1);

  const { data: dwData } = useGetDimensionWeight(!productId);

  const dimensionWeightData = dimension_and_weight.id ? dimension_and_weight : dwData;

  const noneData =
    viewOnly &&
    !specOptionData?.length &&
    // !options.length &&
    !dimensionWeightData.attributes.some(
      (el) =>
        (el.with_diameter === dimensionWeightData.with_diameter || el.with_diameter === null) &&
        el.conversion_value_1,
    );

  if (noneData) {
    return <EmptyOne customClass="p-16" />;
  }

  const handleAddSpecification = () => {
    setSpecOptionData?.((prevState: any) => [
      ...prevState,
      { ...DEFAULT_CONTENT, sequence: specOptionData.length },
    ]);

    // const newSpecOptionData = [...specOptionData];

    // store.dispatch(
    //   setCustomProductDetail({
    //     specifications: [
    //       ...newSpecification,
    //       { ...DEFAULT_CONTENT, sequence: specOptionData.length },
    //     ],
    //   }),
    // );
  };

  const handleDeleteSpecification = (specIndex: number) => {
    setSpecOptionData?.((prevState: any) => {
      const newData = [...prevState];
      newData?.filter((_item: any, itemIndex: number) => itemIndex !== specIndex);

      return newData;
    });

    // const newData = specOptionData?.filter((_item, itemIndex) => itemIndex !== specIndex);

    // store.dispatch(
    //   setCustomProductDetail({
    //     specifications: newSpecification,
    //   }),
    // );
  };

  const onChangeSpecification =
    (fieldName: keyof Omit<NameContentProps, 'id'>, attributes: NameContentProps, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSpecOptionData?.((prevState: any) => {
        const newData = [...prevState];
        newData[index] = { ...attributes, [fieldName]: e.target.value };

        return newData;
      });

      // const newSpecificationData = [...specOptionData];
      // newSpecificationData[index] = { ...attributes, [fieldName]: e.target.value };

      // store.dispatch(
      //   setCustomProductDetail({
      //     specifications: newSpecification,
      //   }),
      // );
    };

  const handleAddOptionGroup = () => {
    setSpecOptionData?.((prevState: any) => [
      ...prevState,
      { ...DEFAULT_PRODUCT_OPTION, sequence: specOptionData.length },
    ]);

    // store.dispatch(
    //   setSpecificationAndOptionData({
    //     specifications: newSpecification,
    //     options: [...newOptionData, { ...DEFAULT_PRODUCT_OPTION, sequence: specOptionData.length }],
    //   }),
    // );
  };

  const handleDeleteOptionGroup = (index: number) => {
    // const newOptionContent = specOptionData.filter((_item, itemIndex) => itemIndex !== index);
    // store.dispatch(setCustomProductDetail({ options: newOptionData }));

    setSpecOptionData?.((prevState: any) => {
      const newData = [...prevState];
      newData.filter((_item: any, itemIndex: number) => itemIndex !== index);

      return newData;
    });
  };

  const handleDeleteOptionGroupItem = (optionIndex: number, itemIndex: number) => {
    // const newOptionItem = newOption[optionIndex].items.filter(
    //   (_item, itemIdx) => itemIdx !== itemIndex,
    // );

    // newOption[optionIndex] = { ...newOption[optionIndex], items: newOptionItem };

    // store.dispatch(setCustomProductDetail({ options: newOption }));

    setSpecOptionData?.((prevState: any) => {
      const newData = [...prevState];
      const newOptionItem = newData[optionIndex].items.filter(
        (_item: any, itemIdx: number) => itemIdx !== itemIndex,
      );

      newData[optionIndex] = { ...newData[optionIndex], items: newOptionItem };

      return newData;
    });
  };

  const onDragEnd = async (result: any) => {
    const newData = (await getNewDataAfterReordering(result, specOptionData)) as any[];

    /// update sequence field for the data as same as its index after dragging
    const newSpecOptionData = newData.map((el, index) => ({ ...el, sequence: index }));

    /// update data to state
    setSpecOptionData?.(newSpecOptionData);
  };

  const renderOptionItems = (option: ProductOptionProps, optionIndex: number) => {
    if (viewOnly) {
      return (
        <OptionItemView
          data={[option]}
          // dataIndex={optionIndex}
          productId={productId}
          specification={specification} /// data of user selected on view mode
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
          <Col flex="48px">
            <LogoIcon logo={item.image} />
          </Col>
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

      {!specOptionData?.length ? null : (
        <div className={styles.mainContent}>
          <DragDropContainer onDragEnd={onDragEnd}>
            {specOptionData.map((el: NameContentProps & ProductOptionProps, index: number) => {
              const specType = el.type === 'specification';
              const draggableId = specType
                ? `${el.name}-${el.content}-${el.sequence}-${index}`
                : `${el.title}-${el.tag}-${el.sequence}-${index}`;

              return (
                <Draggable
                  key={el.sequence}
                  draggableId={draggableId}
                  index={index}
                  isDragDisabled={isDragDisabled}
                >
                  {(dragProvided: any) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                    >
                      {specType ? (
                        viewOnly ? (
                          <SimpleContentTable
                            items={[el]}
                            tdStyle={specifying ? { paddingLeft: 0 } : {}}
                            flex={specifying ? '30-70' : '25-75'}
                            flexOnMobile
                            noPadding={specifying}
                          />
                        ) : (
                          <DoubleInput
                            key={el.sequence}
                            fontLevel={6}
                            doubleInputClass="mb-8"
                            leftIcon={<DragDropIcon />}
                            rightIcon={
                              <DeleteIcon
                                className={styles.deleteIcon}
                                onClick={() => handleDeleteSpecification(index)}
                              />
                            }
                            firstValue={el.name}
                            firstPlaceholder="type name"
                            firstOnChange={onChangeSpecification('name', el, index)}
                            secondValue={el.content}
                            secondPlaceholder="type content"
                            secondOnChange={onChangeSpecification('content', el, index)}
                          />
                        )
                      ) : (
                        <ActiveOneCustomCollapse
                          key={el.sequence}
                          groupName={'specification' as ProductInfoTab}
                          groupIndex={Number(el.sequence)}
                          noBorder={specifying || (viewOnly && el.use_image)}
                          expandingHeaderFontStyle="bold"
                          customHeaderClass={styles.optionCollapse}
                          arrowAlignRight={specifying}
                          header={
                            <OptionCollapseHeader
                              data={specOptionData}
                              setSpecOptionData={setSpecOptionData}
                              dataIndex={index}
                              productId={productId}
                              specification={specification}
                              specifying={specifying}
                              isPublicPage={isPublicPage}
                              specifiedDetail={specifiedDetail}
                              viewOnly={viewOnly}
                              icon={<DragDropIcon />}
                            />
                          }
                        >
                          {viewOnly ? null : (
                            <div className="flex-between" style={{ padding: '10px 16px' }}>
                              <div
                                className="flex-start cursor-pointer"
                                onClick={() => {
                                  setOptionModalVisible(true);
                                  setCurOption(el);
                                  setCurOptionIndex(index);
                                }}
                              >
                                <MainTitle level={4} customClass={styles.content}>
                                  {el.items.length ? 'Update Options' : 'Create Options'}
                                </MainTitle>
                                <SingleRightIcon />
                              </div>
                              <div className="flex-start">
                                {el.tag ? (
                                  <RobotoBodyText
                                    level={6}
                                    style={{ fontWeight: '500', marginRight: 16 }}
                                  >
                                    TAG: {el.tag}
                                  </RobotoBodyText>
                                ) : null}
                                <DeleteIcon
                                  className={styles.deleteIcon}
                                  onClick={() => handleDeleteOptionGroup(index)}
                                />
                              </div>
                            </div>
                          )}

                          {renderOptionItems(el, index)}
                        </ActiveOneCustomCollapse>
                      )}
                    </div>
                  )}
                </Draggable>
              );
            })}
          </DragDropContainer>
        </div>
      )}

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
          // optionIndex={curOptionIndex}
          onChange={(data: ProductOptionProps) => {
            setSpecOptionData?.((prevState: any) => {
              const newData = [...prevState];
              newData[curOptionIndex] = data;

              return newData;
            });
          }}
        />
      )}
    </>
  );
};
