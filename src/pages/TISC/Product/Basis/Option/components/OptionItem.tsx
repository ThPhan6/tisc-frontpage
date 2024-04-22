import React, { CSSProperties, FC, useContext } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import { MESSAGE_ERROR } from '@/constants/message';
import { IMAGE_ACCEPT_TYPES, LOGO_SIZE_LIMIT } from '@/constants/util';
import { Col, Collapse, Row, Upload, message } from 'antd';

import { ReactComponent as RemoveIcon } from '@/assets/icons/action-remove.svg';
import DefaultImage from '@/assets/icons/default-option-icon.png';
import { ReactComponent as DragIcon } from '@/assets/icons/scroll-icon.svg';

import { FormOptionGroupContext, FormOptionGroupHeaderContext } from '../../hook';
import { getBase64, showImageUrl } from '@/helper/utils';
import { cloneDeep, uniqueId } from 'lodash';

import { BasisOptionSubForm, MainBasisOptionSubForm, SubBasisOption } from '@/types';

import { EmptyOne } from '@/components/Empty';
import { CustomInput } from '@/components/Form/CustomInput';
import { BodyText } from '@/components/Typography';

import styles from './OptionItem.less';
import { MainPanelHeader } from './entryForm/MainPanelHeader';
import { SubPanelHeader } from './entryForm/SubPanelHeader';

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
          border: subItemOption.isBase64 ? 'unset' : '0.5px solid #e4e4e4',
          width: 64,
          height: 64,
        }}
      />

      <Row className={styles.form_sub__input} gutter={16}>
        {[1, 2].map((order) => (
          <Col className={styles.form_input} key={order} span={12}>
            <BodyText level={3}>S{order}:</BodyText>
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
        <Col span={12}>
          <div
            style={{
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <span className="product-id-label">Product ID:</span>
            <CustomInput
              placeholder="type here"
              className="product-id-input"
              name="product_id"
              onChange={handleChangeInput}
              value={subItemOption.product_id}
            />
          </div>
        </Col>
        <Col span={12} className="flex-start">
          <div
            style={{
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <span className="product-id-label">Paired:</span>

            <BodyText fontFamily="Roboto" level={5} style={{ paddingLeft: 12 }}>
              {subItemOption.paired}
            </BodyText>
          </div>
        </Col>
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

  const { mode } = useContext(FormOptionGroupHeaderContext);

  const { collapse, setCollapse } = useContext(FormOptionGroupContext);

  const handleDeleteSubItem =
    (index: number) => (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      e.stopPropagation();

      const newSubItems = [...subOption.subs];
      newSubItems.splice(index, 1);
      handleChangeSubItem({
        ...subOption,
        count: newSubItems.length,
        subs: newSubItems,
      });
    };

  const handleChangeSubOptionItem = (changedOptionItem: SubBasisOption, index: number) => {
    const newSubItems = [...subOption.subs];
    newSubItems[index] = changedOptionItem;
    handleChangeSubItem({
      ...subOption,
      subs: newSubItems,
    });
  };

  const handleCollapse = () => {
    const newCollapse: any = cloneDeep(collapse);

    if (newCollapse[subOption.id]) {
      delete newCollapse[subOption.id];
    } else {
      newCollapse[subOption.id] = true;
    }

    setCollapse(newCollapse);
  };

  return (
    <div className={styles.collapse_container}>
      <Collapse
        ghost
        activeKey={collapse[subOption.id] ? subOption.id : ''}
        onChange={handleCollapse}
        // collapsible={
        //   mode === 'card' &&
        //   subOption.subs.every((sub) => sub.image?.indexOf('/default/option_default.webp') !== -1)
        //     ? 'disabled'
        //     : undefined
        // }
      >
        <Collapse.Panel
          className={collapse[subOption.id] && styles.active_collapse_panel}
          header={
            <SubPanelHeader
              subOption={subOption}
              handleChangeSubItem={handleChangeSubItem}
              handleDeleteSubOption={handleDeleteSubOption}
              handleCopySubOtionItem={handleCopySubOtionItem}
              dragIcon={dragIcon}
            />
          }
          key={subOption.id}
          showArrow={false}
        >
          <div className={`${styles.sub_wrapper} ${mode === 'card' ? styles.cardMode : ''}`}>
            {!subOption.subs.length ? (
              <EmptyOne />
            ) : (
              subOption.subs.map(
                (subItemOption, index) =>
                  mode === 'list' ? (
                    <div key={index} className={styles.optionItemGroup}>
                      <SubItemOption
                        subItemOption={subItemOption}
                        onChange={(changedOptionItem) =>
                          handleChangeSubOptionItem(changedOptionItem, index)
                        }
                      />
                      <div>
                        <RemoveIcon
                          className="delete_sub_icon"
                          onClick={handleDeleteSubItem(index)}
                        />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={showImageUrl(subItemOption.image)}
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: 'cover',
                        cursor: 'default',
                      }}
                    />
                  ),
                // subItemOption.image &&
                //   subItemOption.image?.indexOf('/default/option_default.webp') === -1 ? (
                //   <img
                //     src={showImageUrl(subItemOption.image)}
                //     style={{
                //       width: 64,
                //       height: 64,
                //       objectFit: 'cover',
                //       cursor: 'default',
                //     }}
                //   />
                // ) : null,
              )
            )}
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

interface MainOptionItemProps {
  mainOption: MainBasisOptionSubForm;
  mainOptionIndex: number;
  handleChangeMainSubItem: (changedSubs: MainBasisOptionSubForm) => void;
  handleDeleteMainSubOption: () => void;
  handleCopyMainOption: (mainOption: MainBasisOptionSubForm) => void;
}

export const MainOptionItem: FC<MainOptionItemProps> = (props) => {
  const {
    mainOption,
    mainOptionIndex,
    handleChangeMainSubItem,
    handleDeleteMainSubOption,
    handleCopyMainOption,
  } = props;

  const { collapse, setCollapse } = useContext(FormOptionGroupContext);

  const handleDeleteSubOption = (index: number) => {
    const newSubItems = [...mainOption.subs];
    newSubItems.splice(index, 1);
    handleChangeMainSubItem({
      ...mainOption,
      count: newSubItems.length,
      subs: newSubItems,
    });
  };

  const handleChangeSubOptionItem = (changedOptionItem: BasisOptionSubForm, index: number) => {
    const newSubItems = [...mainOption.subs];
    newSubItems[index] = changedOptionItem;
    handleChangeMainSubItem({
      ...mainOption,
      subs: newSubItems,
    });
  };

  const handleCopySubOtionItem = (subItem: BasisOptionSubForm) => {
    const newId = uniqueId('new-');

    const newSub: BasisOptionSubForm = {
      ...subItem,
      id: `${newId}-${subItem.id}`,
      subs: subItem.subs.map((opt) => ({
        ...opt,
        id: `${newId}-${opt.id}`,
      })),
    };

    handleChangeMainSubItem({
      ...mainOption,
      count: mainOption.subs.length + 1,
      subs: [...mainOption.subs, newSub],
    });
  };

  const handleCollapse = () => {
    const newCollapse = cloneDeep(collapse);

    if (newCollapse[mainOption.id]) {
      delete newCollapse[mainOption.id];
    } else {
      newCollapse[mainOption.id] = true;
    }

    setCollapse(newCollapse);
  };

  return (
    <Draggable key={mainOption.id} draggableId={mainOption.id} index={mainOptionIndex}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Droppable droppableId={mainOption.id}>
            {(droppableProvided) => (
              <div
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
                className={styles.collapseContainer}
              >
                <Collapse
                  ghost
                  activeKey={collapse[mainOption.id] ? mainOption.id : ''}
                  onChange={handleCollapse}
                >
                  <Collapse.Panel
                    className={
                      collapse[mainOption.id]
                        ? styles.active_collapse_panel
                        : styles.unactive_collapse_panel
                    }
                    header={
                      <MainPanelHeader
                        mainOption={mainOption}
                        handleChangeMainSubItem={handleChangeMainSubItem}
                        handleDeleteMainSubOption={handleDeleteMainSubOption}
                        handleCopyMainOption={handleCopyMainOption}
                      />
                    }
                    key={mainOption.id}
                    showArrow={false}
                  >
                    <div className={styles.main_option}>
                      {!mainOption.subs.length ? (
                        <EmptyOne />
                      ) : (
                        mainOption.subs.map((subItemOption, index) => (
                          <Draggable
                            key={subItemOption.id}
                            draggableId={subItemOption.id}
                            index={index}
                          >
                            {(mainOptionProvided) => (
                              <div
                                ref={mainOptionProvided.innerRef}
                                {...mainOptionProvided.draggableProps}
                              >
                                <SubOptionItem
                                  subOption={subItemOption}
                                  handleChangeSubItem={(changedSubs) =>
                                    handleChangeSubOptionItem(changedSubs, index)
                                  }
                                  handleCopySubOtionItem={() => {
                                    handleCopySubOtionItem({
                                      ...subItemOption,
                                      name: `${subItemOption.name} copy`,
                                    });
                                  }}
                                  handleDeleteSubOption={() => handleDeleteSubOption(index)}
                                  dragIcon={
                                    <div
                                      {...mainOptionProvided.dragHandleProps}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                      className="drag-icon flex-start"
                                    >
                                      <DragIcon />
                                    </div>
                                  }
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                    </div>
                  </Collapse.Panel>
                </Collapse>
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
