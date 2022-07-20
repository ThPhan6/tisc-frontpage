import { useState } from 'react';
import type { FC } from 'react';
import { Title } from '@/components/Typography';
import Popover from '@/components/Modal/Popover';
import CustomButton from '@/components/Button';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/reducers';
import { setPartialProductDetail } from '@/reducers/product';
import type { CheckboxValue } from '@/components/CustomCheckbox/types';
import styles from '../styles/header.less';

interface ProductHeaderProps {
  title: string;
  customClass?: string;
  onSave?: () => void;
  onCancel?: () => void;
}

const ProductHeader: FC<ProductHeaderProps> = ({ title, customClass, onSave, onCancel }) => {
  const product = useAppSelector((state) => state.product);
  const dispatch = useDispatch();
  const { categories } = product.details;
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className={`${styles.productHeader} ${customClass}`}>
        <div className={styles.leftAction}>
          <Title level={7}>{title}</Title>
          <CustomButton
            variant="text"
            buttonClass="select-category-btn"
            onClick={() => setVisible(true)}
          >
            select
          </CustomButton>
        </div>
        <div className={styles.iconWrapper}>
          <CustomButton
            size="small"
            variant="primary"
            properties="rounded"
            buttonClass="save-btn"
            onClick={onSave}
          >
            Save
          </CustomButton>
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
      <Popover
        title="SELECT CATEGORY"
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
                  id: item.value,
                  name: item.label as string,
                };
              }),
            }),
          );
        }}
      />
    </>
  );
};
export default ProductHeader;
