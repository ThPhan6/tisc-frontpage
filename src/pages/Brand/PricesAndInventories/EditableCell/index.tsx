import { CSSProperties, useRef, useState } from 'react';

import { message } from 'antd';

import { CustomInputProps } from '@/components/Form/types';

import { CustomInput } from '@/components/Form/CustomInput';

interface EditStatus {
  [key: string]: {
    [columnKey: string]: { isEditing: boolean; value: string };
  };
}

interface EditableCell extends CustomInputProps {
  inputStyle?: CSSProperties;
  item: { id: string };
  columnKey: string;
  defaultValue: any;
  valueClass?: string;
  onSave: (id: string, columnKey: string, newValue: string) => void;
}

const EditableCell = ({
  onSave,
  columnKey,
  inputStyle,
  defaultValue,
  valueClass = '',
  item,
  ...rest
}: EditableCell) => {
  const [editStatus, setEditStatus] = useState<EditStatus>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = editStatus[item.id]?.[columnKey]?.isEditing;
  const inputValue = editStatus[item.id]?.[columnKey]?.value ?? defaultValue;

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

  return isEditing ? (
    <CustomInput
      autoFocus={isEditing}
      value={inputValue}
      onChange={handleOnChange(item.id, columnKey)}
      onBlur={handleBlur(item.id, columnKey)}
      onKeyDown={handleKeyDown(item.id, columnKey)}
      style={inputStyle}
      ref={inputRef}
      className="indigo-dark-variant text-center"
      type="number"
      message={
        columnKey === 'discount_rate' && Number(editStatus[item.id]?.[columnKey]?.value) > 100
          ? 'Max discount rate is 100'
          : undefined
      }
      messageType={
        columnKey === 'discount_rate' && Number(editStatus[item.id]?.[columnKey]?.value) > 100
          ? 'error'
          : undefined
      }
      {...rest}
    />
  ) : (
    <CustomInput
      value={inputValue}
      onClick={handleClick(item.id, columnKey, inputValue)}
      className={` flex-1 indigo-dark-variant text-center ${valueClass}`}
      type="number"
      message={
        columnKey === 'discount_rate' && Number(editStatus[item.id]?.[columnKey]?.value) > 100
          ? 'Max discount rate is 100'
          : undefined
      }
      messageType={
        columnKey === 'discount_rate' && Number(editStatus[item.id]?.[columnKey]?.value) > 100
          ? 'error'
          : undefined
      }
    />
  );
};

export default EditableCell;
