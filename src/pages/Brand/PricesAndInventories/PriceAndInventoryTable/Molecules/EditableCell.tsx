import { CSSProperties, useRef, useState } from 'react';

import { message } from 'antd';

import { CustomInputProps } from '@/components/Form/types';

import { CustomInput } from '@/components/Form/CustomInput';
import styles from '@/pages/Brand/PricesAndInventories/PriceAndInventoryTable/Molecules/EditableCell.less';

interface EditStatus {
  [key: string]: {
    [columnKey: string]: { isEditing: boolean; value: string };
  };
}

interface EditableCell<T extends string | number | readonly string[] | undefined>
  extends CustomInputProps {
  inputStyle?: CSSProperties;
  item: {
    id?: string;
    in_stock?: number;
    convert?: number;
  };
  columnKey: string;
  defaultValue: T;
  valueClass?: string;
  includePercentage?: boolean;
  labelStyle?: CSSProperties;

  onSave: (id: string, columnKey: string, newValue: string) => void;
}

const EditableCell = <T extends string | number | readonly string[] | undefined>({
  onSave,
  columnKey,
  inputStyle,
  defaultValue,
  valueClass = '',
  labelStyle,
  includePercentage,
  item,
  ...rest
}: EditableCell<T>) => {
  const [editStatus, setEditStatus] = useState<EditStatus>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const columndId = item.id ?? '';

  const isEditing = editStatus[columndId]?.[columnKey]?.isEditing;
  const inputValue = editStatus[columndId]?.[columnKey]?.value ?? defaultValue;

  const handleClick = (id: string, colKey: string, value: string) => () => {
    setEditStatus((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [colKey]: { isEditing: true, value },
      },
    }));
  };

  const handleOnChange =
    (id: string, colKey: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      setEditStatus((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [colKey]: { ...prev[id]?.[colKey], value: event.target.value },
        },
      }));
    };

  const validateInput = (
    colKey: string,
    newValue: number,
    currentInStock: number,
    currentConvert: number,
  ) => {
    if (colKey === 'in_stock' && newValue - currentConvert < 0) {
      message.warn('In Stock cannot be less than Convert. Please adjust the Convert value.');
      inputRef.current?.focus();
      return false;
    }

    if (colKey === 'convert' && currentInStock - newValue < 0) {
      message.warn('Convert value cannot exceed In Stock. Please adjust the In Stock value.');
      inputRef.current?.focus();
      return false;
    }

    if (colKey === 'in_stock' && newValue < 0) {
      message.warn('In Stock cannot be negative. Please adjust the Convert value.');
      inputRef.current?.focus();
      return false;
    }

    return true;
  };

  const handleSave = (id: string, colKey: string) => {
    const newValue = Number(editStatus[id]?.[colKey]?.value ?? defaultValue);
    const currentInStock = Number(editStatus[id]?.['in_stock']?.value ?? item.in_stock);
    const currentConvert = Number(editStatus[id]?.['convert']?.value ?? item.convert);

    if (!validateInput(colKey, newValue, currentInStock, currentConvert)) return;

    if (newValue === defaultValue) {
      setEditStatus((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [colKey]: { ...prev[id]?.[colKey], isEditing: false },
        },
      }));
      return;
    }

    setEditStatus((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [colKey]: { ...prev[id]?.[colKey], isEditing: false },
      },
    }));

    onSave(id, colKey, inputValue);
  };

  const handleKeyDown =
    (id: string, colKey: string) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') handleSave(id, colKey);
    };

  const handleBlur = (id: string, colKey: string) => () => handleSave(id, colKey);

  return (
    <div className={styles.editable_cell}>
      {!includePercentage || (isEditing && includePercentage) ? (
        <CustomInput
          autoFocus={isEditing}
          value={inputValue}
          onChange={handleOnChange(columndId, columnKey)}
          onBlur={handleBlur(columndId, columnKey)}
          onKeyDown={handleKeyDown(columndId, columnKey)}
          additionalInputClass={styles.editable_cell_input}
          style={inputStyle}
          ref={inputRef}
          className="indigo-dark-variant text-center"
          type="number"
          autoWidth
          {...rest}
        />
      ) : (
        <span
          onClick={handleClick(columndId, columnKey, inputValue)}
          className={`indigo-dark-variant text-center ${valueClass}`}
          style={labelStyle}
        >
          {inputValue}
          {columnKey === 'discount_rate' ? '%' : ''}
        </span>
      )}
    </div>
  );
};

export default EditableCell;
