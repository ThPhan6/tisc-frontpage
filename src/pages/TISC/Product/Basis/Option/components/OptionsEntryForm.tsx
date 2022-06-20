// import { EntryFormWrapper } from '@/components/EntryForm';
// import { FormNameInput } from '@/components/EntryForm/FormNameInput';
// import { FC, useState } from 'react';
// import { OptionItem } from './OptionItem';
// import { OptionEntryFormProps, SubOptionValueProps, ElementInputItemProps } from '../types';
// import styles from '../styles/OptionsEntryForm.less';

// const subOptionValueDefault: SubOptionValueProps = {
//   name: '',
//   subs: [],
// };

// export const OptionEntryForm: FC<OptionEntryFormProps> = ({
//   optionValue,
//   setOptionValue,
//   onCancel,
//   onSubmit,
// }) => {
//   const [subOptions, setSubOptions] = useState<SubOptionValueProps>(subOptionValueDefault);

//   const handleOnChangeValue = (value: SubOptionValueProps, index: number) => {
//     console.log(value, index);

//     const newOptions = [...optionValue.subs];
//     newOptions[index] = value;
//     setOptionValue({ ...optionValue, subs: newOptions });
//   };

//   const handleOnChangeOptionNameInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const newSubOptions = {
//       ...subOptions,
//       name: e.target.value,
//     };
//     setSubOptions(newSubOptions);
//     handleOnChangeValue({ ...newSubOptions }, index);
//   };

//   const handleOnClickDeleteSubOption = (index: number) => {
//     const newOptions = [...optionValue.subs];
//     newOptions.splice(index, 1);
//     setOptionValue({ ...optionValue, subs: newOptions });
//   };

//   const handleClickAddOption = () => {
//     setOptionValue({ ...optionValue, subs: [...optionValue.subs, subOptionValueDefault] });
//   };

//   const handleSubmit = () => {
//     if (onSubmit) {
//       onSubmit(optionValue);
//     }
//   };

//   const handleCancel = () => {
//     if (onCancel) {
//       onCancel();
//     }
//   };
//   const handleChange = (changedSubs: ElementInputItemProps, index: number) => {
//     const newSubs = [...subOptions.subs];
//     newSubs[index] = changedSubs;
//     setSubOptions({
//       ...subOptions,
//       subs: newSubs,
//     });
//   };

//   return (
//     <EntryFormWrapper
//       handleSubmit={handleSubmit}
//       handleCancel={handleCancel}
//       contentClass={styles.container}
//     >
//       <FormNameInput
//         placeholder="type group name"
//         title="Option Group"
//         HandleOnClickAddIcon={handleClickAddOption}
//         onChangeInput={(e) => {
//           setOptionValue({ ...optionValue, name: e.target.value });
//         }}
//         inputValue={optionValue.name}
//       />
//       <div
//         className={styles.container__item_wrapper}
//         style={{
//           padding: '0px 16px',
//         }}
//       >
//         {optionValue.subs.map((option, index) => (
//           <OptionItem
//             key={index}
//             value={option}
//             onChangeValue={(value) => {
//               handleOnChangeValue(value, index);
//             }}
//             handleOnClickDeleteSubOption={() => {
//               handleOnClickDeleteSubOption(index);
//             }}
//             handleOnChangeOptionNameInput={(e) => handleOnChangeOptionNameInput(e, index)}
//             subOptions={subOptions}
//             handleChange={(sub) => handleChange(sub, index)}
//           />
//         ))}
//       </div>
//     </EntryFormWrapper>
//   );
// };
