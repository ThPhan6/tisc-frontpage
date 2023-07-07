import { useState } from 'react';
import type { FC } from 'react';
import { useDispatch } from 'react-redux';

import { useScreen } from '@/helper/common';

import type { CheckboxValue } from '@/components/CustomCheckbox/types';
import { setPartialProductDetail } from '@/features/product/reducers';
import { useAppSelector } from '@/reducers';

import CustomButton from '@/components/Button';
import Popover from '@/components/Modal/Popover';
import { Title } from '@/components/Typography';

import styles from './ProductDetailHeader.less';

interface ProductDetailHeaderProps {
  title: string;
  label?: string;
  customClass?: string;
  onSave?: () => void;
  onCancel?: () => void;
  hideSelect?: boolean;
  disabled?: boolean;
}

const ProductDetailHeader: FC<ProductDetailHeaderProps> = ({
  title,
  customClass,
  onSave,
  onCancel,
  hideSelect,
  disabled,
  label,
}) => {
  const isTablet = useScreen().isTablet;
  const product = useAppSelector((state) => state.product);

  const dispatch = useDispatch();
  const { categories } = product.details;
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className={`${styles.productHeader} ${customClass}`}>
        <div className={styles.leftAction}>
          <Title level={7}>{title}</Title>
          {hideSelect || isTablet ? null : (
            <div className="select-category text-capitalize" onClick={() => setVisible(true)}>
              {label}
            </div>
          )}
        </div>
        <div className={styles.iconWrapper}>
          {isTablet ? null : (
            <CustomButton
              size="small"
              variant="primary"
              properties="rounded"
              buttonClass="save-btn"
              onClick={onSave}
              disabled={disabled}
            >
              Save
            </CustomButton>
          )}
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            buttonClass="cancel-btn"
            onClick={onCancel}
          >
            Close
          </CustomButton>
        </div>
      </div>
      {hideSelect ? null : (
        <Popover
          title="SELECT CATEGORY"
          secondaryModal
          visible={visible}
          setVisible={setVisible}
          categoryDropdown
          chosenValue={categories.map((category) => {
            return {
              label: category.name,
              value: category.id,
            };
          })}
          setChosenValue={(data: CheckboxValue[]) => {
            dispatch(
              setPartialProductDetail({
                categories: data.map((item) => {
                  return {
                    id: String(item.value),
                    name: String(item.label),
                  };
                }),
              }),
            );
          }}
        />
      )}
    </>
  );
};
export default ProductDetailHeader;
