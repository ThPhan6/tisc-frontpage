import { FC } from 'react';

import { useSelectProductSpecification } from '@/features/product/services';
import { showImageUrl } from '@/helper/utils';
import { cloneDeep } from 'lodash';

import { OptionGroupProps } from '../../types';
import store from '@/reducers';

import { CustomRadio } from '@/components/CustomRadio';
import { RobotoBodyText } from '@/components/Typography';

import { setCustomProductDetail } from '../../slice';

export const renderOptionImage = (image: string) => (
  <img src={showImageUrl(image)} style={{ width: 48, height: 48, objectFit: 'contain' }} />
);

export const OptionItemView: FC<OptionGroupProps> = ({
  data,
  dataIndex,
  productId,
  specifiedDetail,
  specification,
  specifying,
  isPublicPage,
}) => {
  const option = data[dataIndex];
  const selectOption = specification.attribute_groups?.find((el) => el.id === option.id);
  const selectProductSpecification = useSelectProductSpecification();

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

          const optIndex = specification.attribute_groups?.findIndex((el) => el.id === optionId);
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
};
