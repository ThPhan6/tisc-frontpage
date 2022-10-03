// import { FC, useEffect, useState } from 'react';

// import e from '@umijs/deps/compiled/express';
// import { Col, Collapse, Row } from 'antd';

// import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
// import { ReactComponent as CirclePlusIcon } from '@/assets/icons/circle-plus.svg';
// import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';

// import { isEmpty, isEqual } from 'lodash';

// import {
//   DEFAULT_SUB_MATERIAL_PRODUCT,
//   MaterialProductItemProps,
//   MaterialProductSubForm,
// } from '../type';

// import { CustomInput } from '@/components/Form/CustomInput';
// import { BodyText } from '@/components/Typography';

// import styles from '.MaterialProductItem.less';

// const MaterialProductElementInput = () => {
//   return (
//     <div>
//       <BodyText></BodyText>
//     </div>
//   );
// };

// export const MaterialProductItem: FC<MaterialProductItemProps> = ({
//   value,
//   onChangeValue,
//   handleOnClickDeleteItem,
// }) => {
//   const [materialItem, setMaterialItem] = useState<MaterialProductSubForm>(
//     DEFAULT_SUB_MATERIAL_PRODUCT,
//   );

//   useEffect(() => {
//     if (value) {
//       setMaterialItem({ ...value });
//     }
//   }, [!isEqual(value, materialItem)]);

//   const handleActiveKeyToCollapse = () => {
//     onChangeValue({
//       ...materialItem,
//       is_collapse: materialItem.is_collapse ? '' : '1',
//     });
//   };

//   const handleOnChangeSubList = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onChangeValue({ ...materialItem, name: e.target.value });
//   };

//   const handleOnClickAddItem = () => {
//     const newSubs = [...materialItem.codes];
//   };
//   const PanelHeader = () => {
//     return (
//       <div className={styles.panel_header}>
//         <div className={styles.panel_header__field}>
//           <div className={styles.panel_header__field_title} onClick={handleActiveKeyToCollapse}>
//             <BodyText
//               level={3}
//               customClass={
//                 isEmpty(materialItem.is_collapse) ? styles.font_weight_300 : styles.font_weight_600
//               }>
//               Sub-List
//             </BodyText>
//             <ArrowIcon
//               className={styles.panel_header__field_title_icon}
//               style={{
//                 transform: `rotate(${isEmpty(materialItem.is_collapse) ? '0' : '180'}deg)`,
//               }}
//             />
//           </div>
//           <CirclePlusIcon
//             className={styles.panel_header__field_add}
//             onClick={handleOnClickAddItem}
//           />
//         </div>
//         <div className={styles.panel_header__input}>
//           <CustomInput
//             placeholder="type sub-list name"
//             size="small"
//             containerClass={styles.panel_header__input_value}
//             onChange={handleOnChangeSubList}
//             value={materialItem.name}
//           />
//           <ActionDeleteIcon
//             className={styles.panel_header__input_delete_icon}
//             onClick={handleOnClickDelete}
//           />
//         </div>
//       </div>
//     );
//   };
//   return (
//     <div className={styles.preset}>
//       <Collapse ghost activeKey={materialItem.is_collapse}>
//         <Collapse.Panel
//           className={`
//              ${styles['customPadding']}
//               ${
//                 isEmpty(materialItem.is_collapse) ? styles['bottomMedium'] : styles['bottomBlack']
//               }`}
//           header={PanelHeader()}
//           key={materialItem.is_collapse}
//           showArrow={false}>
//           <div>
//             {materialItem.codes.map((preset, index) => (
//               <div className={styles.form} key={index}>
//                 <Row className={styles.form__element} gutter={16}>
//                   <Col span={12}>
//                     {/* <PresetElementInput
//                       order={1}
//                       onChange={(e) => handleOnChange(e, index)}
//                       value={preset}
//                     /> */}
//                   </Col>
//                   <Col span={12}>
//                     {/* <PresetElementInput
//                       order={2}
//                       onChange={(e) => handleOnChange(e, index)}
//                       value={preset}
//                     /> */}
//                   </Col>
//                 </Row>
//                 <ActionDeleteIcon
//                   className={styles.form__delete_icon}
//                   onClick={() => handleOnClickDeleteItem(index)}
//                 />
//               </div>
//             ))}
//           </div>
//         </Collapse.Panel>
//       </Collapse>
//     </div>
//   );
// };
