// import { CSSProperties, useRef, useState } from 'react';
// import { message } from 'antd';
// import { CustomInput } from '@/components/Form/CustomInput';

// interface EditStatus {
//   [key: string]: {
//     [columnKey: string]: { isEditing: boolean; value: string };
//   };
// }

// interface EditableCell {
//   inputStyle?: CSSProperties;
//   item: { id: string };
//   columnKey: string;
//   defaultValue: any;
//   valueClass?: string;
// }

// const EditableCell = ({
//   columnKey,
//   inputStyle,
//   defaultValue,
//   valueClass = '',
//   item,
// }: EditableCell) => {
//   const [editStatus, setEditStatus] = useState<EditStatus>({});
//   const inputRef = useRef<HTMLInputElement>(null);

//   const handleClick = (id: string, colKey: string, value: string) => () => {
//     setEditStatus((prev) => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [colKey]: { isEditing: true, value },
//       },
//     }));
//   };

//   const handleOnChange =
//     (id: string, colKey: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
//       setEditStatus((prev) => ({
//         ...prev,
//         [id]: {
//           ...prev[id],
//           [colKey]: { ...prev[id]?.[colKey], value: event.target.value },
//         },
//       }));
//     };

//   const handleSave = (id: string, colKey: string) => {
//     if (!editStatus[id]?.[colKey]?.value) {
//       message.warn('Please fill in the value');
//       inputRef.current?.focus();
//       return;
//     }
//     setEditStatus((prev) => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [colKey]: { ...prev[id]?.[colKey], isEditing: false },
//       },
//     }));
//   };

//   const handleKeyDown =
//     (id: string, colKey: string) => (event: React.KeyboardEvent<HTMLInputElement>) => {
//       if (event.key === 'Enter') handleSave(id, colKey);
//     };

//   const handleBlur = (id: string, colKey: string) => () => {
//     if (!editStatus[id]?.[colKey]?.value) {
//       message.warn('Please fill in the value');
//       inputRef.current?.focus();
//       return;
//     }
//     handleSave(id, colKey);
//   };

//   const isEditing = editStatus[item.id]?.[columnKey]?.isEditing;
//   const value = editStatus[item.id]?.[columnKey]?.value ?? defaultValue;

//   return isEditing ? (
//     <CustomInput
//       autoFocus={isEditing}
//       value={value}
//       onChange={handleOnChange(item.id, columnKey)}
//       onBlur={handleBlur(item.id, columnKey)}
//       onKeyDown={handleKeyDown(item.id, columnKey)}
//       style={inputStyle}
//       ref={inputRef}
//     />
//   ) : (
//     <span onClick={handleClick(item.id, columnKey, value)} className={`${valueClass} flex-1`}>
//       {value}
//     </span>
//   );
// };

// export default EditableCell;
