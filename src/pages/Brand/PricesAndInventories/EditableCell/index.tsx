import { CSSProperties, useRef, useState } from 'react';

import { message } from 'antd';

import { CustomInputProps } from '@/components/Form/types';

import { CustomInput } from '@/components/Form/CustomInput';
import type { VolumePrice } from '@/pages/Brand/PricesAndInventories/CategoryTable';
import styles from '@/pages/Brand/PricesAndInventories/EditableCell/EditableCell.less';

interface EditStatus {
  [key: string]: {
    [columnKey: string]: { isEditing: boolean; value: string };
  };
}

interface EditableCell<T extends string | number | readonly string[] | undefined>
  extends CustomInputProps {
  inputStyle?: CSSProperties;
  item: VolumePrice;
  columnKey: string;
  defaultValue: T;
  valueClass?: string;
  onSave: (id: string, columnKey: string, newValue: string) => void;
}

const EditableCell = <T extends string | number | readonly string[] | undefined>({
  onSave,
  columnKey,
  inputStyle,
  defaultValue,
  valueClass = '',
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

  const handleSave = (id: string, colKey: string) => {
    const newValue = editStatus[id]?.[colKey]?.value ?? defaultValue;
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

    if (!newValue) {
      message.warn('Please fill in the value');
      inputRef.current?.focus();
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
      {isEditing ? (
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
          message={
            columnKey === 'discount_rate' && Number(editStatus[columndId]?.[columnKey]?.value) > 100
              ? 'Max discount rate is 100'
              : undefined
          }
          messageType={
            columnKey === 'discount_rate' && Number(editStatus[columndId]?.[columnKey]?.value) > 100
              ? 'error'
              : undefined
          }
          {...rest}
        />
      ) : (
        <span
          onClick={handleClick(columndId, columnKey, inputValue)}
          className={`indigo-dark-variant text-center ${valueClass}`}
        >
          {inputValue}
        </span>
      )}
    </div>
  );
};

export default EditableCell;
