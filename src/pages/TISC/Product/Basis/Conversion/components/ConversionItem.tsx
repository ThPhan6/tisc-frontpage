import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as SwapIcon } from '@/assets/icons/swap-horizontal-icon.svg';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';
import classNames from 'classnames';
import type { FC } from 'react';
import { Row, Col } from 'antd';
import styles from '../styles/ConversionItem.less';
import { ConversionItemProps, ElementInputProp } from '../types';

const ElementInput: FC<ElementInputProp> = ({ order, onChange, value }) => {
  return (
    <Col className={styles.element} span={12}>
      <BodyText level={3}>C{order}:</BodyText>
      <CustomInput
        placeholder={`formula ${order}`}
        name={`formula_${order}`}
        size="small"
        autoWidth
        defaultWidth={60}
        containerClass={styles.element__input_formula}
        onChange={onChange}
        value={value[`formula_${order}`]}
      />
      <CustomInput
        placeholder="unit"
        name={`unit_${order}`}
        size="small"
        autoWidth
        defaultWidth={30}
        containerClass={classNames(styles.element__input_unit)}
        onChange={onChange}
        value={value[`unit_${order}`]}
      />
    </Col>
  );
};

export const ConversionItem: FC<ConversionItemProps> = ({
  value,
  onChangeValue,
  handleOnClickDelete,
}) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = {
      ...value,
      [e.target.name]: e.target.value,
    };
    if (onChangeValue) {
      onChangeValue(newInputValue);
    }
  };

  return (
    <div className={styles.conversion_container}>
      <div className={styles.field}>
        <div className={styles.field__name}>
          <BodyText level={3}>Between:</BodyText>
          <CustomInput
            onChange={handleOnChange}
            placeholder="name 1"
            name="name_1"
            size="small"
            autoWidth
            defaultWidth={48}
            containerClass={styles.field__name_input}
            value={value.name_1}
          />
          <div className={styles.swapIcon}>
            <SwapIcon />
          </div>
          <CustomInput
            onChange={handleOnChange}
            placeholder="name 2"
            name="name_2"
            size="small"
            autoWidth
            defaultWidth={48}
            containerClass={styles.field__name_input}
            value={value.name_2}
          />
        </div>
        <ActionDeleteIcon className={styles.field__delete_icon} onClick={handleOnClickDelete} />
      </div>

      <Row className={styles.form}>
        <ElementInput order={1} onChange={handleOnChange} value={value} />
        <ElementInput order={2} onChange={handleOnChange} value={value} />
      </Row>
    </div>
  );
};
