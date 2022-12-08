import { FC, useState } from 'react';

import { Col, Row } from 'antd';

import { ReactComponent as DeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';
import { ReactComponent as SingleRightIcon } from '@/assets/icons/single-right-form-icon.svg';

import { useGetDimensionWeight } from '@/features/dimension-weight/hook';
import { useSelectProductSpecification } from '@/features/product/services';
import { showImageUrl } from '@/helper/utils';
import { cloneDeep } from 'lodash';

import { NameContentProps, ProductInfoTab, ProductOptionProps } from '../../types';
import store, { useAppSelector } from '@/reducers';

import CustomCollapse from '@/components/Collapse';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomRadio } from '@/components/CustomRadio';
import { EmptyOne } from '@/components/Empty';
import { DoubleInput } from '@/components/EntryForm/DoubleInput';
import InputGroup from '@/components/EntryForm/InputGroup';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { SimpleContentTable } from '@/components/Table/components/SimpleContentTable';
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

export const SpecificationTab: FC<{
  productId?: string;
  viewOnly?: boolean;
  isPublicPage?: boolean;
  specifying?: boolean;
  activeKey: ProductInfoTab;
}> = ({ productId, viewOnly, isPublicPage, specifying, activeKey }) => {
  const selectProductSpecification = useSelectProductSpecification();
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

  const noneData = viewOnly && !specifications.length && !options.length;

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

  const renderOptionImage = (image: string) => (
    <img src={showImageUrl(image)} style={{ width: 48, height: 48, objectFit: 'contain' }} />
  );

  const renderOptionItems = (option: ProductOptionProps, optionIndex: number) => {
    if (viewOnly) {
      const selectOption = specification.attribute_groups?.find((el) => el.id === option.id);

      const getOptionPaddingStyles = () => {
        if (isPublicPage) {
          return '8px 16px';
        }

        if (specifying) {
          return '8px 0';
        }

        if (option.use_image) {
          return 16;
        }

        return '8px 16px 8px 20px';
      };

      return (
        <CustomRadio
          optionStyle={{
            cursor: isPublicPage ? 'default' : 'pointer',
            boxShadow: option.use_image ? 'inset 0 0.7px 0 rgb(0 0 0 / 30%)' : undefined,
            padding: getOptionPaddingStyles(),
          }}
          options={option.items.map((el, index) => ({
            label: (
              <div className="flex-start">
                {option.use_image && el.image ? renderOptionImage(el.image) : null}
                <RobotoBodyText
                  level={5}
                  customClass="text-overflow"
                  style={{
                    maxWidth: 'calc(100% - 52px)',
                    paddingLeft: isPublicPage && !option.use_image ? 0 : 24,
                  }}>
                  {el.description}
                </RobotoBodyText>
              </div>
            ),
            value: el.id || index,
          }))}
          direction="vertical"
          isRadioList
          disabled={isPublicPage}
          containerStyle={{ padding: 0 }}
          noPaddingLeft
          value={selectOption?.attributes[0].basis_option_id}
          onChange={(value) => {
            if (productId && value.value) {
              const optionId = option.id || '';
              const itemId = value.value.toString();
              const newOptionSpec = cloneDeep(specification);

              newOptionSpec.is_refer_document = false;

              const optIndex = specification.attribute_groups?.findIndex(
                (el) => el.id === optionId,
              );
              const newOption = {
                id: optionId,
                attributes: [
                  {
                    id: optionId,
                    basis_option_id: itemId,
                  },
                ],
                isChecked: true,
              };
              if (optIndex === -1) {
                newOptionSpec.attribute_groups.push(newOption);
              } else {
                newOptionSpec.attribute_groups[optIndex] = newOption;
              }

              store.dispatch(
                setCustomProductDetail(
                  specifying && specifiedDetail
                    ? {
                        specifiedDetail: { ...specifiedDetail, specification: newOptionSpec },
                      }
                    : {
                        specification: newOptionSpec,
                      },
                ),
              );
              if (!specifying) {
                selectProductSpecification(productId, {
                  custom_product: true,
                  specification: newOptionSpec,
                });
              }
            }
          }}
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

    const renderHeader = (option: ProductOptionProps, optionIndex: number) => {
      const selectOption = specification.attribute_groups?.find((el) => el.id === option.id);

      if (!viewOnly) {
        return (
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
        );
      }

      return (
        <Row style={{ width: '100%' }} align="middle" justify="space-between">
          {isPublicPage ? (
            <RobotoBodyText level={6} customClass="optionLabel">
              {option.title}
            </RobotoBodyText>
          ) : (
            <Col style={{ paddingLeft: specifying ? 0 : 16 }}>
              <CustomCheckbox
                options={[
                  {
                    label: <RobotoBodyText level={6}>{option.title}</RobotoBodyText>,
                    value: optionIndex,
                  },
                ]}
                selected={
                  selectOption?.isChecked
                    ? [
                        {
                          label: <RobotoBodyText level={6}>{option.title}</RobotoBodyText>,
                          value: optionIndex,
                        },
                      ]
                    : []
                }
                onChange={() => {
                  if (productId && selectOption?.isChecked) {
                    const newOptionSpec = {
                      is_refer_document: specification?.attribute_groups?.length
                        ? specification.attribute_groups.some(
                            (el) => el.id !== selectOption.id && el.isChecked,
                          )
                        : true,
                      attribute_groups: specification?.attribute_groups?.length
                        ? specification.attribute_groups.filter((el) => el.id !== selectOption.id)
                        : [],
                    };

                    store.dispatch(
                      setCustomProductDetail(
                        specifying && specifiedDetail
                          ? {
                              specifiedDetail: {
                                ...specifiedDetail,
                                specification: newOptionSpec,
                              },
                            }
                          : { specification: newOptionSpec },
                      ),
                    );
                    if (!specifying) {
                      selectProductSpecification(productId, {
                        custom_product: true,
                        specification: newOptionSpec,
                      });
                    }
                  }
                }}
              />
            </Col>
          )}
          <Col>
            <RobotoBodyText level={6}>({option.items.length})</RobotoBodyText>
          </Col>
          <Col flex="1 1 100px">
            <div className="flex-end">
              <RobotoBodyText level={6}>TAG: {option.tag}</RobotoBodyText>
            </div>
          </Col>
        </Row>
      );
    };

    return options.map((option: ProductOptionProps, optionIndex: number) => {
      return (
        <CustomCollapse
          key={option.id || optionIndex}
          defaultActiveKey={'1'}
          showActiveBoxShadow={!specifying}
          noBorder={specifying || (viewOnly && option.use_image)}
          customHeaderClass={styles.optionCollapse}
          header={renderHeader(option, optionIndex)}>
          {viewOnly ? null : (
            <div className="flex-between" style={{ padding: '10px 16px' }}>
              <div
                className="flex-start cursor-pointer"
                onClick={() => {
                  setOptionModalVisible(true);
                  setCurOption(option);
                  setCurOptionIndex(optionIndex);
                }}>
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
      );
    });
  };

  const renderSpecification = () => {
    if (viewOnly) {
      return (
        <SimpleContentTable items={specifications} tdStyle={specifying ? { paddingLeft: 0 } : {}} />
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
        data={dimensionWeightData}
        isSpecifying={specifying}
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
