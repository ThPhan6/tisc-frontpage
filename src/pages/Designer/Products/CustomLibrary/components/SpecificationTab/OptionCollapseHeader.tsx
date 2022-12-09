import { FC } from 'react';

import { Col, Row } from 'antd';

import { ReactComponent as ScrollIcon } from '@/assets/icons/scroll-icon.svg';

import { selectProductSpecification } from '@/features/product/services';

import { OptionGroupProps } from '../../types';
import store from '@/reducers';

import { CustomCheckbox } from '@/components/CustomCheckbox';
import InputGroup from '@/components/EntryForm/InputGroup';
import { RobotoBodyText } from '@/components/Typography';

import { setCustomProductDetail } from '../../slice';
import styles from './index.less';

export const OptionCollapseHeader: FC<OptionGroupProps> = ({
  data,
  dataIndex,
  productId,
  specifiedDetail,
  specification,
  specifying,
  isPublicPage,
  viewOnly,
}) => {
  const option = data[dataIndex];
  const selectOption = specification.attribute_groups?.find((el) => el.id === option.id);

  const onChangeOptionTitle = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOptionGroup = [...data];
    newOptionGroup[index] = { ...newOptionGroup[index], title: e.target.value };

    store.dispatch(
      setCustomProductDetail({
        options: newOptionGroup,
      }),
    );
  };

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
        onChange={onChangeOptionTitle(dataIndex)}
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
                value: dataIndex,
              },
            ]}
            selected={
              selectOption?.isChecked
                ? [
                    {
                      label: <RobotoBodyText level={6}>{option.title}</RobotoBodyText>,
                      value: dataIndex,
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
