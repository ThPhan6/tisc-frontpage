import React, { CSSProperties, FC, useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { MESSAGE_ERROR } from '@/constants/message';
import { IMAGE_ACCEPT_TYPES, LOGO_SIZE_LIMIT } from '@/constants/util';
import { Col, Collapse, Row, Upload, message } from 'antd';

import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove.svg';
import { ReactComponent as CirclePlusIcon } from '@/assets/icons/circle-plus.svg';
import DefaultImage from '@/assets/icons/default-option-icon.png';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as PlusIcon } from '@/assets/icons/plus-icon-18.svg';
import { ReactComponent as DragIcon } from '@/assets/icons/scroll-icon.svg';
import { ReactComponent as CopyIcon } from '@/assets/icons/tabs-icon-18.svg';

import { FormOptionContext } from '../../hook';
import { getBase64, showImageUrl } from '@/helper/utils';
import { cloneDeep, isEmpty } from 'lodash';

import { BasisOptionSubForm, MainBasisOptionSubForm, SubBasisOption } from '@/types';

import { DragDropContainer, getNewDataAfterReordering } from '@/components/Drag';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import styles from './OptionItem.less';

export const ImageUpload: FC<{
  onFileChange: (base64: string) => void;
  image?: string;
  style?: CSSProperties;
}> = ({ style, onFileChange, image, ...props }) => {
  return (
    <Upload
      accept={IMAGE_ACCEPT_TYPES.image}
      maxCount={1}
      showUploadList={false}
      beforeUpload={(file) => {
        if (file.size > LOGO_SIZE_LIMIT) {
          message.error(MESSAGE_ERROR.reachSizeLimit);
          return false;
        }
        getBase64(file)
          .then(onFileChange)
          .catch(() => {
            message.error('Upload Failed');
          });
        return true;
      }}
      {...props}
    >
      <img
        style={{
          width: 48,
          height: 48,
          objectFit: 'cover',
          marginRight: 16,
          cursor: 'pointer',
          ...style,
        }}
        src={image || DefaultImage}
      />
    </Upload>
  );
};

interface SubItemOptionProps {
  is_have_image?: boolean;
  subItemOption: SubBasisOption;
  onChange: (subItemOption: SubBasisOption) => void;
}

const DEFAULT_SUB_OPTION_ITEM: SubBasisOption = {
  value_1: '',
  value_2: '',
  unit_2: '',
  unit_1: '',
  product_id: '',
};

const SubItemOption: FC<SubItemOptionProps> = ({ subItemOption, onChange }) => {
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...subItemOption,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeFileImage = (base64Image: string) => {
    onChange({
      ...subItemOption,
      image: base64Image,
      isBase64: true,
    });
  };

  return (
    <div className={styles.element}>
      <ImageUpload
        onFileChange={handleChangeFileImage}
        image={subItemOption.isBase64 ? subItemOption.image : showImageUrl(subItemOption.image)}
        style={{
          border: subItemOption.isBase64 ? 'unset' : '1px solid #e4e4e4',
          width: 64,
          height: 64,
        }}
      />

      <Row className={styles.form_sub__input} gutter={16}>
        {[1, 2].map((order) => (
          <Col className={styles.form_input} key={order} span={12}>
            <BodyText level={3}>O{order}:</BodyText>
            <CustomInput
              placeholder="value"
              name={`value_${order}`}
              size="small"
              autoWidth
              defaultWidth={40}
              containerClass={styles.form_input__formula}
              onChange={handleChangeInput}
              value={subItemOption[`value_${order}`]}
            />
            <CustomInput
              placeholder="unit"
              name={`unit_${order}`}
              size="small"
              autoWidth
              defaultWidth={30}
              containerClass={styles.form_input__unit}
              onChange={handleChangeInput}
              value={subItemOption[`unit_${order}`]}
            />
          </Col>
        ))}
        <div
          style={{
            margin: '0 8px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <span className="product-id-label">Product ID:</span>
          <CustomInput
            placeholder="type here"
            className="product-id-input"
            fontLevel={6}
            name="product_id"
            onChange={handleChangeInput}
            value={subItemOption.product_id}
          />
        </div>
      </Row>
    </div>
  );
};

interface SubOptionItemProps {
  subOption: BasisOptionSubForm;
  handleChangeSubItem: (changedSubs: BasisOptionSubForm) => void;
  handleDeleteSubOption: () => void;
  handleCopySubOtionItem: () => void;
  dragIcon: JSX.Element;
}

const SubOptionItem: FC<SubOptionItemProps> = (props) => {
  const {
    subOption,
    handleChangeSubItem,
    handleDeleteSubOption,
    dragIcon,
    handleCopySubOtionItem,
  } = props;

  const { mode } = useContext(FormOptionContext);

  const handleActiveKeyToCollapse = () => {
    handleChangeSubItem({
      ...subOption,
      is_collapse: subOption.is_collapse ? '' : '1',
    });
  };

  const addNewSubOptionItem = () => {
    /// default open option item list when add new
    /// add new sub option item
    handleChangeSubItem({
      ...subOption,
      is_collapse: '1',
      subs: [...subOption.subs, DEFAULT_SUB_OPTION_ITEM],
    });
  };

  const handleChangeSubOptionName = (e: React.ChangeEvent<HTMLInputElement>) => {
    /// change subOption name
    handleChangeSubItem({
      ...subOption,
      name: e.target.value,
    });
  };

  const handleDeleteSubItem = (index: number) => {
    const newSubItems = [...subOption.subs];
    newSubItems.splice(index, 1);
    handleChangeSubItem({
      ...subOption,
      subs: newSubItems,
    });

    if (newSubItems.length < 1) {
      /// unactive image if have none sub
      handleChangeSubItem({
        ...subOption,
        subs: newSubItems,
        is_collapse: '',
      });
    }
  };

  const handleChangeSubOptionItem = (changedOptionItem: SubBasisOption, index: number) => {
    const newSubItems = [...subOption.subs];
    newSubItems[index] = changedOptionItem;
    handleChangeSubItem({
      ...subOption,
      subs: newSubItems,
    });
  };

  const PanelHeader = () => {
    return (
      <div className={styles.panel_header}>
        <div className={styles.panel_header__field}>
          <div className={styles.panel_header__field_right}>
            {dragIcon}
            <CustomInput
              placeholder="sub option name"
              name="name"
              size="small"
              onChange={handleChangeSubOptionName}
              value={subOption.name}
              autoWidth
              defaultWidth={300}
              style={{ maxWidth: '100%' }}
            />
            <div className={styles.panel_header__field_title} onClick={handleActiveKeyToCollapse}>
              <ArrowIcon
                className={styles.panel_header__field_title_icon}
                style={{
                  transform: `rotate(${isEmpty(subOption.is_collapse) ? '0' : '180'}deg)`,
                }}
              />
            </div>
          </div>
          <div className={styles.panel_header__input}>
            <PlusIcon className={styles.panel_header__field_add} onClick={addNewSubOptionItem} />
            <CopyIcon className={styles.panel_header__field_add} onClick={handleCopySubOtionItem} />
            <ActionDeleteIcon
              className={styles.panel_header__input_delete_icon}
              onClick={handleDeleteSubOption}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.collapse_container}>
      <Collapse ghost activeKey={subOption.is_collapse!}>
        <Collapse.Panel
          // className={
          //   isEmpty(subOption.is_collapse)
          //     ? styles.active_collapse_panel
          //     : styles.unactive_collapse_panel
          // }
          className={!isEmpty(subOption.is_collapse) && styles.unactive_collapse_panel}
          header={PanelHeader()}
          key={subOption.is_collapse!}
          showArrow={false}
        >
          <div
            className={styles.sub_wrapper}
            style={{ flexDirection: mode === 'list' ? 'column' : 'row' }}
          >
            {subOption.subs.map((subItemOption, index) =>
              mode === 'list' ? (
                <div key={index} className={styles.optionItemGroup}>
                  <SubItemOption
                    subItemOption={subItemOption}
                    onChange={(changedOptionItem) =>
                      handleChangeSubOptionItem(changedOptionItem, index)
                    }
                  />
                  <div>
                    <RemoveIcon onClick={() => handleDeleteSubItem(index)} />
                  </div>
                </div>
              ) : subItemOption.image &&
                subItemOption.image?.indexOf('/default/option_default.webp') === -1 ? (
                <img
                  src={showImageUrl(subItemOption.image)}
                  style={{
                    width: 64,
                    height: 64,
                    marginRight: 16,
                    marginBottom: 16,
                    objectFit: 'cover',
                    cursor: 'default',
                  }}
                />
              ) : null,
            )}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

interface MainOptionItemProps {
  mainOption: MainBasisOptionSubForm;
  handleChangeMainSubItem: (changedSubs: MainBasisOptionSubForm) => void;
  handleDeleteMainSubOption: () => void;
  handleCopyMainOption: (mainOption: MainBasisOptionSubForm) => void;
}

const DEFAULT_MAIN_OPTION_ITEM: BasisOptionSubForm = {
  name: '',
  subs: [],
  is_collapse: '',
};

export const MainOptionItem: FC<MainOptionItemProps> = (props) => {
  const { mainOption, handleChangeMainSubItem, handleDeleteMainSubOption, handleCopyMainOption } =
    props;

  const handleActiveKeyToCollapse = () => {
    handleChangeMainSubItem({
      ...mainOption,
      is_collapse: mainOption.is_collapse ? '' : '1',
    });
  };

  const addNewMainOptionItem = () => {
    /// default open option item list when add new
    /// add new sub option item
    handleChangeMainSubItem({
      ...mainOption,
      is_collapse: '1',
      subs: [...mainOption.subs, DEFAULT_MAIN_OPTION_ITEM],
    });
  };

  const handleChangeMainOptionName = (e: React.ChangeEvent<HTMLInputElement>) => {
    /// change subOption name
    handleChangeMainSubItem({
      ...mainOption,
      name: e.target.value,
    });
  };

  const handleDeleteSubOption = (index: number) => {
    const newSubItems = [...mainOption.subs];
    newSubItems.splice(index, 1);
    handleChangeMainSubItem({
      ...mainOption,
      subs: newSubItems,
    });

    if (newSubItems.length < 1) {
      /// unactive image if have none sub
      handleChangeMainSubItem({
        ...mainOption,
        subs: newSubItems,
        is_collapse: '',
      });
    }
  };

  const handleChangeSubOptionItem = (changedOptionItem: BasisOptionSubForm, index: number) => {
    const newSubItems = [...mainOption.subs];
    newSubItems[index] = changedOptionItem;
    handleChangeMainSubItem({
      ...mainOption,
      subs: newSubItems,
    });
  };

  const onDragEnd = (result: any) => {
    const newSubOptions = getNewDataAfterReordering(result, mainOption.subs);

    handleChangeMainSubItem({ ...mainOption, subs: [...newSubOptions] });
  };

  const handleCopySubOtionItem = (subItem: BasisOptionSubForm) => {
    const newSubItem = cloneDeep(subItem);
    delete newSubItem.id;
    newSubItem.subs.forEach((item) => delete item.id);
    handleChangeMainSubItem({ ...mainOption, subs: [...mainOption.subs, newSubItem] });
  };

  const MainPanelHeader = () => {
    return (
      <div className={styles.main_panel_header}>
        <div className={styles.main_panel_header__left}>
          <CustomInput
            placeholder="main option name"
            name="name"
            size="small"
            onChange={handleChangeMainOptionName}
            value={mainOption.name}
            autoWidth
            defaultWidth={300}
            style={{ maxWidth: '100%' }}
          />
          <div onClick={handleActiveKeyToCollapse}>
            <ArrowIcon
              className={styles.main_panel_header__left_icon}
              style={{
                transform: `rotate(${isEmpty(mainOption.is_collapse) ? '0' : '180'}deg)`,
              }}
            />
          </div>
        </div>
        <div className={styles.main_panel_header__icon}>
          <CirclePlusIcon
            className={styles.main_panel_header__icon_add}
            onClick={addNewMainOptionItem}
          />
          <CopyIcon
            className={styles.main_panel_header__icon_add}
            onClick={() =>
              handleCopyMainOption({
                ...mainOption,
                name: `${mainOption.name} copy`,
                is_collapse: '',
              })
            }
          />
          <ActionDeleteIcon
            className={styles.main_panel_header__icon_delete}
            onClick={handleDeleteMainSubOption}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.collapse_container}>
      <Collapse ghost activeKey={mainOption.is_collapse!}>
        <Collapse.Panel
          className={
            isEmpty(mainOption.is_collapse)
              ? styles.active_collapse_panel
              : styles.unactive_collapse_panel
          }
          header={MainPanelHeader()}
          key={mainOption.is_collapse!}
          showArrow={false}
        >
          <div className={styles.main_option}>
            <DragDropContainer onDragEnd={onDragEnd}>
              {mainOption.subs.map((subItemOption, index) => (
                <Draggable
                  key={subItemOption.id}
                  index={index}
                  draggableId={subItemOption.id ?? String(index)}
                >
                  {(dragProvided: any) => (
                    <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
                      <SubOptionItem
                        subOption={subItemOption}
                        handleChangeSubItem={(changedSubs) =>
                          handleChangeSubOptionItem(changedSubs, index)
                        }
                        handleCopySubOtionItem={() => {
                          handleCopySubOtionItem({
                            ...subItemOption,
                            name: `${subItemOption.name} copy`,
                            is_collapse: '',
                          });
                        }}
                        handleDeleteSubOption={() => handleDeleteSubOption(index)}
                        dragIcon={
                          <div
                            {...dragProvided.dragHandleProps}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <DragIcon />
                          </div>
                        }
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </DragDropContainer>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};
